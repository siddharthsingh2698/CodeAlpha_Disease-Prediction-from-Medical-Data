"""
FastAPI Enterprise Web Server for Multi-Disease Clinical Prediction Platform.
Connects the Stitch UI frontend to trained Scikit-Learn and XGBoost ML pipelines.
"""
import io
import json
from pathlib import Path
from typing import Dict, Any, Optional

import pandas as pd
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, Response, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from src.config import (
    BASE_DIR, SAVED_MODELS_DIR, METRICS_DIR,
    DATA_RAW_DIR, DATA_PROCESSED_DIR
)
from src.predictor import predict_patient_risk, load_disease_model
from src.data_loader import (
    load_heart_disease_data, load_diabetes_data, load_breast_cancer_data
)
from app.components.report_generator import generate_patient_report_markdown

app = FastAPI(title="Multi-Disease Clinical Prediction Platform", version="4.2.0")

# Enable CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount figures directory for ROC and SHAP plots
FIGURES_DIR = BASE_DIR / "reports" / "figures"
if FIGURES_DIR.exists():
    app.mount("/figures", StaticFiles(directory=str(FIGURES_DIR)), name="figures")

# Mount CareCompanion React assets
CARE_ASSETS_DIR = BASE_DIR / "carecompanion_ui" / "dist" / "assets"
if CARE_ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(CARE_ASSETS_DIR)), name="assets")

# Disease mappings
DISEASE_KEYS = {
    "heart": "heart_disease",
    "heart_disease": "heart_disease",
    "diabetes": "diabetes",
    "breast": "breast_cancer",
    "breast_cancer": "breast_cancer"
}

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    """Serves the CareCompanion Multi-Disease Clinical Platform application."""
    index_file = BASE_DIR / "carecompanion_ui" / "dist" / "index.html"
    if not index_file.exists():
        index_file = BASE_DIR / "stitch_ui" / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Index HTML not found")
    with open(index_file, "r", encoding="utf-8") as f:
        content = f.read()
    return HTMLResponse(content=content)

@app.post("/api/predict")
async def api_predict(payload: Dict[str, Any]):
    """
    Executes real-time clinical risk inference for a single patient.
    Payload: { disease: str, model: str, biomarkers: dict }
    """
    disease = payload.get("disease", "heart_disease")
    clean_disease = DISEASE_KEYS.get(disease.lower(), "heart_disease")
    model_type = payload.get("model", "champion")
    biomarkers = payload.get("biomarkers", {})

    try:
        result = predict_patient_risk(clean_disease, biomarkers, model_type)
        return JSONResponse(content={"status": "success", "data": result})
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": "error", "message": str(e)}
        )

@app.post("/api/batch-predict")
async def api_batch_predict(
    disease: str = Form("heart_disease"),
    model: str = Form("champion"),
    file: Optional[UploadFile] = File(None)
):
    """
    Executes high-throughput batch inference across an uploaded cohort CSV.
    """
    clean_disease = DISEASE_KEYS.get(disease.lower(), "heart_disease")
    try:
        pipeline = load_disease_model(clean_disease, model)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Model loading failed: {str(e)}")

    if file:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    else:
        # Load sample from processed test partition
        test_path = DATA_PROCESSED_DIR / f"{'heart' if 'heart' in clean_disease else clean_disease}_test.csv"
        if not test_path.exists():
            test_path = DATA_RAW_DIR / f"{clean_disease}.csv"
        df = pd.read_csv(test_path).head(50)

    # Exclude target columns
    target_cols = ["Heart Disease Status", "Outcome", "target", "Heart_Disease_Status"]
    feat_df = df.drop(columns=[c for c in target_cols if c in df.columns], errors="ignore")

    try:
        preds = pipeline.predict(feat_df)
        if hasattr(pipeline, "predict_proba"):
            probs = pipeline.predict_proba(feat_df)[:, 1]
        else:
            probs = preds.astype(float)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

    results_df = df.copy()
    results_df["Risk_Score_Pct"] = (probs * 100).round(2)
    results_df["Prediction"] = ["Positive" if p == 1 else "Negative" for p in preds]
    results_df["Risk_Tier"] = [
        "High Risk" if p > 0.65 else ("Moderate Risk" if p >= 0.35 else "Low Risk")
        for p in probs
    ]

    high_risk_count = int((probs > 0.65).sum())
    mod_risk_count = int(((probs >= 0.35) & (probs <= 0.65)).sum())
    low_risk_count = int((probs < 0.35).sum())

    summary = {
        "total_records": len(df),
        "high_risk_count": high_risk_count,
        "moderate_risk_count": mod_risk_count,
        "low_risk_count": low_risk_count,
        "high_risk_rate_pct": round((high_risk_count / len(df)) * 100, 1),
        "mean_risk_pct": round(float(np.mean(probs) * 100), 2),
        "preview": results_df.head(25).replace({np.nan: None}).to_dict(orient="records"),
        "columns": results_df.columns.tolist()
    }
    return JSONResponse(content={"status": "success", "summary": summary})

@app.get("/api/metrics/{disease}")
async def api_get_metrics(disease: str):
    """Returns benchmark comparison metrics and metadata for the requested disease."""
    clean_disease = DISEASE_KEYS.get(disease.lower(), "heart_disease")
    metrics_file = METRICS_DIR / f"{clean_disease}_metrics.csv"
    metadata_file = METRICS_DIR / f"{clean_disease}_metadata.json"

    if not metrics_file.exists():
        raise HTTPException(status_code=404, detail="Metrics file not found")

    df = pd.read_csv(metrics_file)
    meta = {}
    if metadata_file.exists():
        with open(metadata_file, "r") as f:
            meta = json.load(f)

    return JSONResponse(content={
        "status": "success",
        "disease": clean_disease,
        "metrics": df.replace({np.nan: None}).to_dict(orient="records"),
        "metadata": meta,
        "roc_image_url": f"/figures/{clean_disease}_roc_curves.png",
        "shap_image_url": f"/figures/{clean_disease}_shap_summary.png"
    })

@app.get("/api/dataset/{disease}")
async def api_get_dataset(disease: str, page: int = 1, page_size: int = 15, search: str = ""):
    """Returns paginated raw dataset rows and statistical summaries."""
    clean_disease = DISEASE_KEYS.get(disease.lower(), "heart_disease")
    raw_file = DATA_RAW_DIR / f"{clean_disease}.csv"

    if not raw_file.exists():
        raise HTTPException(status_code=404, detail="Dataset file not found")

    df = pd.read_csv(raw_file)

    if search:
        # Search string across string/object columns
        mask = df.astype(str).apply(lambda row: row.str.contains(search, case=False).any(), axis=1)
        df_filtered = df[mask]
    else:
        df_filtered = df

    total_filtered = len(df_filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    page_data = df_filtered.iloc[start_idx:end_idx]
    desc_df = df.describe().round(2).reset_index()

    page_data_records = page_data.replace({np.nan: None}).to_dict(orient="records")
    desc_df_records = desc_df.replace({np.nan: None}).to_dict(orient="records")

    return JSONResponse(content={
        "status": "success",
        "disease": clean_disease,
        "total_records": len(df),
        "total_filtered": total_filtered,
        "columns": df.columns.tolist(),
        "rows": page_data_records,
        "summary_stats": desc_df_records,
        "missing_count": int(df.isnull().sum().sum()),
        "current_page": page,
        "page_size": page_size
    })

@app.get("/api/download-sample-cohort/{disease}")
async def api_download_sample(disease: str):
    """Downloads sample test CSV for batch screening."""
    clean_disease = DISEASE_KEYS.get(disease.lower(), "heart_disease")
    test_path = DATA_PROCESSED_DIR / f"{'heart' if 'heart' in clean_disease else clean_disease}_test.csv"
    if not test_path.exists():
        test_path = DATA_RAW_DIR / f"{clean_disease}.csv"
    df = pd.read_csv(test_path).head(30)
    csv_bytes = df.to_csv(index=False).encode("utf-8")
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sample_{clean_disease}_cohort.csv"}
    )

@app.post("/api/download-report")
async def api_download_report(payload: Dict[str, Any]):
    """Generates and streams downloadable medical markdown report."""
    disease = payload.get("disease", "Heart Disease")
    model = payload.get("model", "Champion")
    res = payload.get("prediction", {})
    inputs = payload.get("inputs", {})

    report_md = generate_patient_report_markdown(disease, model, res, inputs)
    return Response(
        content=report_md.encode("utf-8"),
        media_type="text/markdown",
        headers={"Content-Disposition": f"attachment; filename=clinical_report_{disease.lower().replace(' ', '_')}.md"}
    )
