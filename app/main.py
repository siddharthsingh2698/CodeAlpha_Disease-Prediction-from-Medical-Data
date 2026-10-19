"""
Main Streamlit Application for Multi-Disease Prediction System.
"""
import sys
from pathlib import Path

# Add project root to path
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import streamlit as st
import pandas as pd
from src.config import SAVED_MODELS_DIR, METRICS_DIR, DATA_RAW_DIR
from src.predictor import predict_patient_risk, load_disease_model
from src.explainability import get_feature_importances
from app.components.input_forms import (
    render_heart_form, render_diabetes_form, render_breast_cancer_form
)
from app.components.visualizers import (
    render_risk_gauge, render_contributing_factors,
    render_model_benchmarks, render_confusion_matrix_chart
)

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

# Header
st.markdown("<h1 class='main-title'>🩺 Multi-Disease Prediction Platform</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Predictive Clinical Risk Assessment powered by Logistic Regression, SVM, Random Forest, and XGBoost.</p>", unsafe_allow_html=True)

# Sidebar
st.sidebar.image("https://img.icons8.com/color/96/medical-heart.png", width=70)
st.sidebar.title("Diagnostic Center")

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
st.sidebar.markdown("### System Specs")
st.sidebar.info(
    "**Algorithms Trained:**\n"
    "- Logistic Regression\n"
    "- Support Vector Machine (SVM)\n"
    "- Random Forest\n"
    "- XGBoost\n\n"
    "**Validation:** 5-Fold Stratified CV\n"
    "**Benchmark:** UCI ML Repository"
)

# Tabs
tab1, tab2, tab3 = st.tabs([
    "🔍 Patient Risk Assessment",
    "📊 Model Benchmarks & Metrics",
    "📁 Dataset Explorer"
])

# ----------------- TAB 1: PREDICTION -----------------
with tab1:
    st.subheader(f"Assess Patient Risk: {disease_choice}")

    # Render appropriate input form
    if disease_choice == "Heart Disease":
        patient_data = render_heart_form()
    elif disease_choice == "Diabetes":
        patient_data = render_diabetes_form()
    else:
        patient_data = render_breast_cancer_form()

    st.markdown("---")
    predict_btn = st.button("Run Diagnostic Risk Assessment", type="primary", use_container_width=True)

    if predict_btn:
        with st.spinner("Analyzing patient biomarkers and computing risk..."):
            try:
                res = predict_patient_risk(disease_key, patient_data, model_key)
                
                # Display Results
                res_col1, res_col2 = st.columns([1.2, 1])
                
                with res_col1:
                    render_risk_gauge(res["probability"], res["risk_level"], res["badge_color"])
                    
                    # Recommendation alert
                    if res["badge_color"] == "green":
                        st.success(f"**Outcome:** {res['predicted_label']}\n\n**Clinical Guidance:** {res['recommendation']}")
                    elif res["badge_color"] == "orange":
                        st.warning(f"**Outcome:** {res['predicted_label']}\n\n**Clinical Guidance:** {res['recommendation']}")
                    else:
                        st.error(f"**Outcome:** {res['predicted_label']}\n\n**Clinical Guidance:** {res['recommendation']}")

                with res_col2:
                    st.markdown("### Key Risk Contributors")
                    if res["top_contributing_factors"]:
                        render_contributing_factors(res["top_contributing_factors"])
                    else:
                        st.info("Feature importance breakdown is calculated across model weights.")
                        
            except Exception as e:
                st.error(f"Error during prediction: {str(e)}")
                st.info("Ensure models have been trained by running `python -m src.train`.")

# ----------------- TAB 2: BENCHMARKS -----------------
with tab2:
    st.subheader(f"Algorithm Benchmarking: {disease_choice}")
    metrics_path = METRICS_DIR / f"{disease_key}_metrics.csv"
    
    if metrics_path.exists():
        metrics_df = pd.read_csv(metrics_path)
        render_model_benchmarks(metrics_df)
        
        st.markdown("---")
        b_col1, b_col2 = st.columns(2)
        
        with b_col1:
            st.markdown("#### Confusion Matrix")
            # Find row for selected model
            sel_row = metrics_df[metrics_df["Model"] == model_key]
            if sel_row.empty:
                sel_row = metrics_df.iloc[[0]]
            
            import ast
            cm_str = sel_row.iloc[0]["Confusion_Matrix"]
            cm_data = ast.literal_eval(cm_str) if isinstance(cm_str, str) else cm_str
            render_confusion_matrix_chart(cm_data, sel_row.iloc[0]["Model"])
            
        with b_col2:
            st.markdown("#### Global Feature Importances")
            try:
                pipeline = load_disease_model(disease_key, model_key)
                raw_df = pd.read_csv(DATA_RAW_DIR / f"{disease_key}.csv")
                raw_cols = [c for c in raw_df.columns if c not in ["Heart Disease Status", "Outcome", "target"]]
                imp_df = get_feature_importances(pipeline, raw_cols, top_n=10)
                st.bar_chart(imp_df.set_index("Feature"))
            except Exception as ex:
                st.info(f"Feature importance display: {ex}")
    else:
        st.warning(f"Metrics not yet generated for {disease_choice}. Please run the training script.")

# ----------------- TAB 3: DATASET EXPLORER -----------------
with tab3:
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
