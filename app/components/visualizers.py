"""
Visualizer components for risk gauge, factor attribution, and metrics benchmarking.
"""
import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go

def render_risk_gauge(probability: float, risk_level: str, badge_color: str):
    """
    Renders an interactive semicircular clinical risk gauge meter.
    """
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=probability,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': f"<b>Assessed Disease Probability</b><br><span style='color:gray;font-size:0.8em'>{risk_level}</span>", 'font': {'size': 20}},
        number={'suffix': "%", 'font': {'size': 36}},
        gauge={
            'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "darkblue"},
            'bar': {'color': "#1e293b", 'thickness': 0.3},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "#cbd5e1",
            'steps': [
                {'range': [0, 35], 'color': 'rgba(34, 197, 94, 0.45)'},    # Green
                {'range': [35, 65], 'color': 'rgba(234, 179, 8, 0.45)'},    # Yellow/Orange
                {'range': [65, 100], 'color': 'rgba(239, 68, 68, 0.45)'}    # Red
            ],
            'threshold': {
                'line': {'color': "black", 'width': 4},
                'thickness': 0.75,
                'value': probability
            }
        }
    ))
    fig.update_layout(height=280, margin=dict(l=20, r=20, t=50, b=20))
    st.plotly_chart(fig, use_container_width=True)

def render_contributing_factors(factors: list):
    """
    Renders horizontal bar chart of top clinical factors influencing the prediction.
    """
    if not factors:
        return
        
    df_f = pd.DataFrame(factors)
    colors = ["#ef4444" if d == "Elevates Risk" else "#22c55e" for d in df_f["Direction"]]
    
    fig = go.Figure(go.Bar(
        x=df_f["Impact"],
        y=df_f["Feature"],
        orientation='h',
        marker=dict(color=colors)
    ))
    fig.update_layout(
        title="<b>Key Biomarkers Driving Risk</b>",
        xaxis_title="Relative Attribution (SHAP / Feature Impact)",
        yaxis_title="Biomarker",
        height=260,
        margin=dict(l=20, r=20, t=40, b=20),
        yaxis=dict(autorange="reversed")
    )
    st.plotly_chart(fig, use_container_width=True)

def render_model_benchmarks(metrics_df: pd.DataFrame):
    """
    Renders styled benchmark comparison table for Logistic Regression, SVM, Random Forest, XGBoost.
    """
    st.markdown("### Model Benchmark Comparison (4 Algorithms)")
    st.dataframe(
        metrics_df.drop(columns=["Confusion_Matrix"], errors="ignore").style
        .highlight_max(axis=0, subset=["Accuracy", "Recall", "F1-Score", "ROC-AUC"], color="#bbf7d0")
        .format({
            "Accuracy": "{:.2%}",
            "Precision": "{:.2%}",
            "Recall": "{:.2%}",
            "Specificity": "{:.2%}",
            "F1-Score": "{:.2%}",
            "ROC-AUC": "{:.2%}",
            "CV_F1_Mean": "{:.2%}",
            "CV_F1_Std": "{:.3f}"
        }),
        use_container_width=True
    )

def render_confusion_matrix_chart(cm_list, model_name: str):
    """
    Renders interactive confusion matrix heatmap.
    """
    cm = np.array(cm_list)
    labels = ["Actual Negative", "Actual Positive"]
    preds = ["Predicted Negative", "Predicted Positive"]
    
    fig = go.Figure(data=go.Heatmap(
        z=cm,
        x=preds,
        y=labels,
        colorscale='Blues',
        text=cm,
        texttemplate="%{text}",
        textfont={"size": 18}
    ))
    fig.update_layout(
        title=f"<b>Confusion Matrix - {model_name}</b>",
        height=320,
        margin=dict(l=40, r=40, t=50, b=40)
    )
    st.plotly_chart(fig, use_container_width=True)
