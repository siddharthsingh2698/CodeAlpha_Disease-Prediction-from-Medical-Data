"""
Main Streamlit Application for Multi-Disease Prediction System.
Provides Single-Patient Triage, Batch Screening, Benchmarking, and Explainable AI.
"""
import sys
from pathlib import Path
from io import BytesIO

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import streamlit as st
import pandas as pd
from src.config import SAVED_MODELS_DIR, METRICS_DIR, DATA_RAW_DIR, BASE_DIR
from src.predictor import predict_patient_risk, load_disease_model
from src.explainability import get_feature_importances
from app.components.input_forms import (
    render_heart_form, render_diabetes_form, render_breast_cancer_form
)
from app.components.visualizers import (
    render_risk_gauge, render_contributing_factors,
    render_model_benchmarks, render_confusion_matrix_chart
)
from app.components.report_generator import render_report_download_button

FIGURES_DIR = BASE_DIR / "reports" / "figures"

# Page configuration
st.set_page_config(
    page_title="Multi-Disease Clinical Risk Predictor",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load CSS
css_file = ROOT_DIR / "app" / "styles" / "custom.css"
if css_file.exists():
    with open(css_file, "r") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# UI Experience Mode in Sidebar
st.sidebar.image("https://img.icons8.com/color/96/medical-heart.png", width=70)
st.sidebar.title("Diagnostic Center")

ui_mode = st.sidebar.radio(
    "🖥️ UI Experience Mode",
    ["🌟 CareCompanion Modern Platform (Recommended)", "📋 Classic Streamlit Dashboard"],
    index=0
)

if ui_mode.startswith("🌟"):
    col_hdr, col_lnk = st.columns([3, 1])
    with col_hdr:
        st.markdown("<h2 style='margin:0;'>🩺 CareCompanion — Daily Health & Clinical Platform</h2>", unsafe_allow_html=True)
        st.caption("Active ML Engine: Logistic Regression, SVM, Random Forest & XGBoost | CareCompanion Modern UI")
    with col_lnk:
        st.link_button("🚀 Open Direct Fullscreen (Port 8000)", "http://localhost:8000", type="primary", use_container_width=True)

    import streamlit.components.v1 as components
    components.iframe("http://localhost:8000", height=1250, scrolling=True)
    st.stop()

# Header
st.markdown("<h1 class='main-title'>🩺 Multi-Disease Prediction Platform</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Predictive Clinical Risk Assessment powered by Logistic Regression, SVM, Random Forest, and XGBoost.</p>", unsafe_allow_html=True)

disease_choice = st.sidebar.selectbox(
    "Select Target Disease",
    ["Heart Disease", "Diabetes", "Breast Cancer"],
    index=0
)

disease_key_map = {
    "Heart Disease": "heart_disease",
    "Diabetes": "diabetes",
    "Breast Cancer": "breast_cancer"
}
disease_key = disease_key_map[disease_choice]

# Model selection in sidebar
model_choice = st.sidebar.selectbox(
    "Select Algorithm",
    ["Champion (Auto-Selected Best)", "Logistic_Regression", "SVM", "Random_Forest", "XGBoost"],
    index=0
)
model_key = "champion" if "Champion" in model_choice else model_choice

st.sidebar.markdown("---")
st.sidebar.markdown("### Clinical Protocol")
st.sidebar.info(
    f"**Selected Domain:** {disease_choice}\n\n"
    f"**Active Model:** `{model_choice}`\n\n"
    "**Evaluation Standard:** 5-Fold Stratified Cross-Validation on held-out test splits."
)

# Top Tabs
tab1, tab2, tab3, tab4 = st.tabs([
    "🔍 Patient Risk Assessment",
    "📂 Batch Screening (CSV)",
    "📊 Model Benchmarks & ROC",
    "📁 Dataset Explorer"
])

# ----------------- TAB 1: INDIVIDUAL PREDICTION -----------------
with tab1:
    st.subheader(f"Patient Diagnostic Assessment: {disease_choice}")

    if disease_choice == "Heart Disease":
        patient_data = render_heart_form()
    elif disease_choice == "Diabetes":
        patient_data = render_diabetes_form()
    else:
        patient_data = render_breast_cancer_form()

    st.markdown("---")
    predict_btn = st.button("Run Diagnostic Risk Assessment", type="primary", use_container_width=True)

    if predict_btn:
        with st.spinner("Processing biomarkers and executing predictive inference..."):
            try:
                res = predict_patient_risk(disease_key, patient_data, model_key)
                
                # Display Results
                res_col1, res_col2 = st.columns([1.2, 1])
                
                with res_col1:
                    render_risk_gauge(res["probability"], res["risk_level"], res["badge_color"])
                    
                    if res["badge_color"] == "green":
                        st.success(f"**Outcome:** {res['predicted_label']}\n\n**Clinical Guidance:** {res['recommendation']}")
                    elif res["badge_color"] == "orange":
                        st.warning(f"**Outcome:** {res['predicted_label']}\n\n**Clinical Guidance:** {res['recommendation']}")
                    else:
                        st.error(f"**Outcome:** {res['predicted_label']}\n\n**Clinical Guidance:** {res['recommendation']}")

                    # Download Report
                    st.markdown("---")
                    render_report_download_button(disease_choice, model_choice, res, patient_data)

                with res_col2:
                    st.markdown("### Key Risk Contributors")
                    if res["top_contributing_factors"]:
                        render_contributing_factors(res["top_contributing_factors"])
                    else:
                        st.info("Feature importance breakdown is calculated across model weights.")
                        
            except Exception as e:
                st.error(f"Error during prediction: {str(e)}")
                st.info("Ensure models have been trained by running `python -m src.train`.")

# ----------------- TAB 2: BATCH SCREENING -----------------
with tab2:
    st.subheader(f"Batch Cohort Screening: {disease_choice}")
    st.markdown("Upload a patient cohort `.csv` file to run high-throughput screening across all records.")

    uploaded_file = st.file_uploader(f"Upload {disease_choice} CSV", type=["csv"])
    
    if uploaded_file is not None:
        try:
            batch_df = pd.read_csv(uploaded_file)
            st.markdown(f"**Loaded Cohort:** {len(batch_df)} patient records")
            st.dataframe(batch_df.head(5), use_container_width=True)

            if st.button("Run Batch Inference", type="primary"):
                with st.spinner("Screening cohort records..."):
                    pipeline = load_disease_model(disease_key, model_key)
                    
                    # Remove target column if present
                    target_cols = ["Heart Disease Status", "Outcome", "target", "Heart_Disease_Status"]
                    feat_df = batch_df.drop(columns=[c for c in target_cols if c in batch_df.columns], errors="ignore")
                    
                    preds = pipeline.predict(feat_df)
                    if hasattr(pipeline, "predict_proba"):
                        probs = pipeline.predict_proba(feat_df)[:, 1]
                    else:
                        probs = preds.astype(float)

                    results_batch = batch_df.copy()
                    results_batch["Predicted_Risk_Score (%)"] = (probs * 100).round(2)
                    results_batch["Predicted_Condition"] = ["Positive" if p == 1 else "Negative" for p in preds]
                    results_batch["Risk_Tier"] = [
                        "High Risk" if p > 0.65 else ("Moderate Risk" if p >= 0.35 else "Low Risk")
                        for p in probs
                    ]

                    st.success(f"Successfully screened {len(batch_df)} patients!")
                    st.dataframe(results_batch, use_container_width=True)

                    # Export results CSV
                    csv_data = results_batch.to_csv(index=False).encode('utf-8')
                    st.download_button(
                        label="📥 Download Screened Cohort Results (.csv)",
                        data=csv_data,
                        file_name=f"screened_{disease_key}_cohort.csv",
                        mime="text/csv",
                        use_container_width=True
                    )
        except Exception as e:
            st.error(f"Batch screening error: {str(e)}")
    else:
        st.info("Tip: You can use sample rows from `data/processed/` or `data/raw/` to test batch screening.")

# ----------------- TAB 3: BENCHMARKS & ROC -----------------
with tab3:
    st.subheader(f"Algorithm Benchmarking & Metrics: {disease_choice}")
    metrics_path = METRICS_DIR / f"{disease_key}_metrics.csv"
    
    if metrics_path.exists():
        metrics_df = pd.read_csv(metrics_path)
        render_model_benchmarks(metrics_df)
        
        st.markdown("---")
        b_col1, b_col2 = st.columns(2)
        
        with b_col1:
            st.markdown("#### Confusion Matrix")
            sel_row = metrics_df[metrics_df["Model"] == model_key]
            if sel_row.empty:
                sel_row = metrics_df.iloc[[0]]
            
            import ast
            cm_str = sel_row.iloc[0]["Confusion_Matrix"]
            cm_data = ast.literal_eval(cm_str) if isinstance(cm_str, str) else cm_str
            render_confusion_matrix_chart(cm_data, sel_row.iloc[0]["Model"])

            # ROC Curve Image if available
            roc_img = FIGURES_DIR / f"{disease_key}_roc_curves.png"
            if roc_img.exists():
                st.markdown("#### Multi-Model ROC Curves")
                st.image(str(roc_img), caption=f"Receiver Operating Characteristic - {disease_choice}")

        with b_col2:
            st.markdown("#### Global Feature Importances")
            try:
                pipeline = load_disease_model(disease_key, model_key)
                raw_df = pd.read_csv(DATA_RAW_DIR / f"{disease_key}.csv")
                raw_cols = [c for c in raw_df.columns if c not in ["Heart Disease Status", "Outcome", "target", "Heart_Disease_Status"]]
                imp_df = get_feature_importances(pipeline, raw_cols, top_n=10)
                st.bar_chart(imp_df.set_index("Feature"))
            except Exception as ex:
                st.info(f"Feature importance display: {ex}")

            # SHAP Summary Plot if available
            shap_img = FIGURES_DIR / f"{disease_key}_shap_summary.png"
            if shap_img.exists():
                st.markdown("#### Global SHAP Interpretability Summary")
                st.image(str(shap_img), caption=f"SHAP Biomarker Impact - {disease_choice}")
    else:
        st.warning(f"Metrics not yet generated for {disease_choice}. Please run the training script.")

# ----------------- TAB 4: DATASET EXPLORER -----------------
with tab4:
    st.subheader(f"Dataset Overview: {disease_choice}")
    raw_path = DATA_RAW_DIR / f"{disease_key}.csv"
    if raw_path.exists():
        df_preview = pd.read_csv(raw_path)
        d_col1, d_col2, d_col3 = st.columns(3)
        d_col1.metric("Total Records", f"{len(df_preview):,}")
        d_col2.metric("Feature Columns", f"{len(df_preview.columns) - 1}")
        d_col3.metric("Missing Values", f"{df_preview.isnull().sum().sum():,}")
        
        st.markdown("#### Raw Data Preview")
        st.dataframe(df_preview.head(20), use_container_width=True)
        
        st.markdown("#### Statistical Summary")
        st.dataframe(df_preview.describe(), use_container_width=True)
    else:
        st.info("Dataset file not found in `data/raw/`.")

# Disclaimer
st.markdown(
    "<div class='disclaimer-box'>"
    "<b>Clinical Disclaimer:</b> This application is designed solely for educational, academic, and clinical "
    "decision-support research. It is not intended to replace formal professional diagnosis, medical consultation, "
    "or clinical judgment by a licensed healthcare practitioner."
    "</div>",
    unsafe_allow_html=True
)
