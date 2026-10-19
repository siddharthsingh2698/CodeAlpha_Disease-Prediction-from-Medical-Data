"""
Input form components for Heart Disease, Diabetes, and Breast Cancer.
"""
import streamlit as st

def render_heart_form():
    """
    Renders input form for Heart Disease clinical biomarkers.
    Returns:
        dict: feature values matching heart_disease.csv schema.
    """
    st.markdown("#### Patient Clinical & Lifestyle Metrics")

    # Presets
    col_p1, col_p2, _ = st.columns([1, 1, 3])
    with col_p1:
        if st.button("Load Healthy Preset", key="heart_healthy"):
            st.session_state["heart_age"] = 32
            st.session_state["heart_bp"] = 120.0
            st.session_state["heart_chol"] = 175.0
            st.session_state["heart_bmi"] = 22.4
            st.session_state["heart_sleep"] = 8.0
            st.session_state["heart_trig"] = 110.0
            st.session_state["heart_fbs"] = 85.0
            st.session_state["heart_crp"] = 0.8
            st.session_state["heart_homo"] = 7.5
            st.session_state["heart_smok"] = "No"
            st.session_state["heart_fam"] = "No"
            st.session_state["heart_exer"] = "High"
            st.session_state["heart_stress"] = "Low"
    with col_p2:
        if st.button("Load High-Risk Preset", key="heart_risk"):
            st.session_state["heart_age"] = 64
            st.session_state["heart_bp"] = 168.0
            st.session_state["heart_chol"] = 270.0
            st.session_state["heart_bmi"] = 34.2
            st.session_state["heart_sleep"] = 5.0
            st.session_state["heart_trig"] = 290.0
            st.session_state["heart_fbs"] = 145.0
            st.session_state["heart_crp"] = 9.2
            st.session_state["heart_homo"] = 17.8
            st.session_state["heart_smok"] = "Yes"
            st.session_state["heart_fam"] = "Yes"
            st.session_state["heart_exer"] = "Low"
            st.session_state["heart_stress"] = "High"

    col1, col2, col3 = st.columns(3)

    with col1:
        age = st.number_input("Age (years)", min_value=18, max_value=100, value=st.session_state.get("heart_age", 52))
        gender = st.selectbox("Gender", ["Male", "Female"])
        bp = st.number_input("Resting Blood Pressure (mmHg)", min_value=90.0, max_value=220.0, value=st.session_state.get("heart_bp", 135.0))
        chol = st.number_input("Cholesterol Level (mg/dL)", min_value=120.0, max_value=400.0, value=st.session_state.get("heart_chol", 215.0))
        bmi = st.number_input("BMI (kg/m^2)", min_value=15.0, max_value=50.0, value=st.session_state.get("heart_bmi", 26.8))

    with col2:
        sleep = st.number_input("Sleep Hours per Day", min_value=3.0, max_value=12.0, value=st.session_state.get("heart_sleep", 7.0))
        trig = st.number_input("Triglycerides (mg/dL)", min_value=50.0, max_value=500.0, value=st.session_state.get("heart_trig", 160.0))
        fbs = st.number_input("Fasting Blood Sugar (mg/dL)", min_value=60.0, max_value=300.0, value=st.session_state.get("heart_fbs", 98.0))
        crp = st.number_input("CRP Level (mg/L)", min_value=0.0, max_value=20.0, value=st.session_state.get("heart_crp", 2.1))
        homo = st.number_input("Homocysteine (umol/L)", min_value=3.0, max_value=30.0, value=st.session_state.get("heart_homo", 11.2))

    with col3:
        exercise = st.selectbox("Exercise Habits", ["High", "Medium", "Low"], index=["High", "Medium", "Low"].index(st.session_state.get("heart_exer", "Medium")))
        smoking = st.selectbox("Smoking", ["No", "Yes"], index=["No", "Yes"].index(st.session_state.get("heart_smok", "No")))
        fam_hd = st.selectbox("Family Heart Disease", ["No", "Yes"], index=["No", "Yes"].index(st.session_state.get("heart_fam", "No")))
        diabetes = st.selectbox("Diagnosed Diabetes", ["No", "Yes"])
        hbp = st.selectbox("History of High Blood Pressure", ["No", "Yes"])
        low_hdl = st.selectbox("Low HDL Cholesterol", ["No", "Yes"])
        high_ldl = st.selectbox("High LDL Cholesterol", ["No", "Yes"])
        alcohol = st.selectbox("Alcohol Consumption", ["Low", "Medium", "High"])
        stress = st.selectbox("Stress Level", ["Low", "Medium", "High"], index=["Low", "Medium", "High"].index(st.session_state.get("heart_stress", "Medium")))
        sugar = st.selectbox("Sugar Consumption", ["Low", "Medium", "High"])

    return {
        "Age": float(age),
        "Gender": gender,
        "Blood Pressure": float(bp),
        "Cholesterol Level": float(chol),
        "Exercise Habits": exercise,
        "Smoking": smoking,
        "Family Heart Disease": fam_hd,
        "Diabetes": diabetes,
        "BMI": float(bmi),
        "High Blood Pressure": hbp,
        "Low HDL Cholesterol": low_hdl,
        "High LDL Cholesterol": high_ldl,
        "Alcohol Consumption": alcohol,
        "Stress Level": stress,
        "Sleep Hours": float(sleep),
        "Sugar Consumption": sugar,
        "Triglyceride Level": float(trig),
        "Fasting Blood Sugar": float(fbs),
        "CRP Level": float(crp),
        "Homocysteine Level": float(homo)
    }

def render_diabetes_form():
    """
    Renders input form for Diabetes clinical biomarkers (Pima Indians format).
    Returns:
        dict: feature values.
    """
    st.markdown("#### Patient Physiological & Diagnostic Indicators")

    # Presets
    col_p1, col_p2, _ = st.columns([1, 1, 3])
    with col_p1:
        if st.button("Load Healthy Preset", key="diab_healthy"):
            st.session_state["diab_preg"] = 1
            st.session_state["diab_gluc"] = 88.0
            st.session_state["diab_bp"] = 68.0
            st.session_state["diab_skin"] = 20.0
            st.session_state["diab_ins"] = 75.0
            st.session_state["diab_bmi"] = 21.5
            st.session_state["diab_dpf"] = 0.25
            st.session_state["diab_age"] = 28
    with col_p2:
        if st.button("Load High-Risk Preset", key="diab_risk"):
            st.session_state["diab_preg"] = 6
            st.session_state["diab_gluc"] = 172.0
            st.session_state["diab_bp"] = 92.0
            st.session_state["diab_skin"] = 38.0
            st.session_state["diab_ins"] = 210.0
            st.session_state["diab_bmi"] = 37.8
            st.session_state["diab_dpf"] = 0.89
            st.session_state["diab_age"] = 54

    col1, col2 = st.columns(2)
    with col1:
        preg = st.number_input("Number of Pregnancies", min_value=0, max_value=20, value=st.session_state.get("diab_preg", 2))
        gluc = st.number_input("Oral Glucose Tolerance (mg/dL)", min_value=40.0, max_value=300.0, value=st.session_state.get("diab_gluc", 115.0))
        bp = st.number_input("Diastolic Blood Pressure (mmHg)", min_value=30.0, max_value=160.0, value=st.session_state.get("diab_bp", 72.0))
        skin = st.number_input("Triceps Skinfold Thickness (mm)", min_value=5.0, max_value=99.0, value=st.session_state.get("diab_skin", 23.0))

    with col2:
        ins = st.number_input("2-Hour Serum Insulin (mu U/ml)", min_value=10.0, max_value=850.0, value=st.session_state.get("diab_ins", 85.0))
        bmi = st.number_input("Body Mass Index (BMI)", min_value=10.0, max_value=70.0, value=st.session_state.get("diab_bmi", 28.5))
        dpf = st.number_input("Diabetes Pedigree Function", min_value=0.05, max_value=2.5, value=st.session_state.get("diab_dpf", 0.45), step=0.01)
        age = st.number_input("Age (years)", min_value=18, max_value=100, value=st.session_state.get("diab_age", 38))

    return {
        "Pregnancies": int(preg),
        "Glucose": float(gluc),
        "BloodPressure": float(bp),
        "SkinThickness": float(skin),
        "Insulin": float(ins),
        "BMI": float(bmi),
        "DiabetesPedigreeFunction": float(dpf),
        "Age": int(age)
    }

def render_breast_cancer_form():
    """
    Renders input form for Wisconsin Breast Cancer nuclear features.
    Returns:
        dict: all 30 features with defaults.
    """
    st.markdown("#### Fine Needle Aspirate (FNA) Nuclear Characteristics")

    # Presets
    col_p1, col_p2, _ = st.columns([1, 1, 3])
    with col_p1:
        if st.button("Load Benign Preset", key="bc_benign"):
            st.session_state["bc_radius"] = 12.1
            st.session_state["bc_texture"] = 15.3
            st.session_state["bc_perimeter"] = 78.0
            st.session_state["bc_area"] = 450.0
            st.session_state["bc_concav"] = 0.03
            st.session_state["bc_cp"] = 0.02
    with col_p2:
        if st.button("Load Malignant Preset", key="bc_malignant"):
            st.session_state["bc_radius"] = 19.8
            st.session_state["bc_texture"] = 24.5
            st.session_state["bc_perimeter"] = 132.0
            st.session_state["bc_area"] = 1250.0
            st.session_state["bc_concav"] = 0.22
            st.session_state["bc_cp"] = 0.14

    col1, col2, col3 = st.columns(3)
    with col1:
        radius = st.number_input("Mean Radius (um)", min_value=5.0, max_value=35.0, value=st.session_state.get("bc_radius", 14.1), step=0.1)
        texture = st.number_input("Mean Texture", min_value=8.0, max_value=40.0, value=st.session_state.get("bc_texture", 19.2), step=0.1)
        perimeter = st.number_input("Mean Perimeter (um)", min_value=40.0, max_value=200.0, value=st.session_state.get("bc_perimeter", 92.0), step=0.5)
        area = st.number_input("Mean Area (um^2)", min_value=100.0, max_value=2600.0, value=st.session_state.get("bc_area", 650.0), step=10.0)

    with col2:
        smoothness = st.number_input("Mean Smoothness", min_value=0.04, max_value=0.20, value=0.096, step=0.005, format="%.4f")
        compactness = st.number_input("Mean Compactness", min_value=0.01, max_value=0.35, value=0.104, step=0.005, format="%.4f")
        concavity = st.number_input("Mean Concavity", min_value=0.0, max_value=0.45, value=st.session_state.get("bc_concav", 0.088), step=0.005, format="%.4f")
        concave_pts = st.number_input("Mean Concave Points", min_value=0.0, max_value=0.25, value=st.session_state.get("bc_cp", 0.048), step=0.005, format="%.4f")

    with col3:
        symmetry = st.number_input("Mean Symmetry", min_value=0.10, max_value=0.35, value=0.181, step=0.005, format="%.4f")
        fractal = st.number_input("Mean Fractal Dimension", min_value=0.04, max_value=0.10, value=0.062, step=0.002, format="%.4f")

    # Build full 30-feature vector using scaled estimates for standard errors and worsts
    scale_factor = radius / 14.1
    return {
        "mean radius": radius,
        "mean texture": texture,
        "mean perimeter": perimeter,
        "mean area": area,
        "mean smoothness": smoothness,
        "mean compactness": compactness,
        "mean concavity": concavity,
        "mean concave points": concave_pts,
        "mean symmetry": symmetry,
        "mean fractal dimension": fractal,
        "radius error": 0.40 * scale_factor,
        "texture error": 1.21,
        "perimeter error": 2.86 * scale_factor,
        "area error": 40.3 * scale_factor,
        "smoothness error": 0.007,
        "compactness error": 0.025,
        "concavity error": 0.031,
        "concave points error": 0.011,
        "symmetry error": 0.020,
        "fractal dimension error": 0.0037,
        "worst radius": radius * 1.15,
        "worst texture": texture * 1.25,
        "worst perimeter": perimeter * 1.18,
        "worst area": area * 1.35,
        "worst smoothness": smoothness * 1.2,
        "worst compactness": compactness * 1.3,
        "worst concavity": concavity * 1.4,
        "worst concave points": concave_pts * 1.2,
        "worst symmetry": symmetry * 1.1,
        "worst fractal dimension": fractal * 1.1
    }
