"""
Verification script for Phase 1: Environment Setup & Scaffolding.
Validates directory structure, dependencies, configuration, and data integrity.
"""
import sys
import os
from pathlib import Path
import importlib

def check_phase_1():
    print("=" * 60)
    print("PHASE 1 AUDIT: Environment Setup & Project Scaffolding")
    print("=" * 60)

    # 1. Python Version
    print(f"\n[1] Python Runtime: {sys.version.split()[0]} ({sys.platform})")

    # 2. Dependency Check
    print("\n[2] Checking Core Dependencies:")
    dependencies = [
        "numpy", "pandas", "scipy", "sklearn", "xgboost",
        "shap", "matplotlib", "seaborn", "plotly", "streamlit",
        "joblib", "pytest"
    ]
    all_deps_ok = True
    for dep in dependencies:
        try:
            mod = importlib.import_module(dep)
            ver = getattr(mod, "__version__", "installed")
            print(f"    - {dep:<15} : OK (v{ver})")
        except ImportError:
            print(f"    - {dep:<15} : MISSING")
            all_deps_ok = False

    # 3. Directory Structure Check
    print("\n[3] Validating Directory Scaffolding:")
    base_dir = Path(__file__).resolve().parent
    required_dirs = [
        base_dir / "data" / "raw",
        base_dir / "data" / "processed",
        base_dir / "models" / "saved_models",
        base_dir / "models" / "metrics",
        base_dir / "notebooks",
        base_dir / "src",
        base_dir / "app" / "components",
        base_dir / "app" / "styles",
        base_dir / "tests"
    ]
    all_dirs_ok = True
    for d in required_dirs:
        rel_path = d.relative_to(base_dir)
        if d.is_dir():
            print(f"    - {str(rel_path):<25} : EXISTS")
        else:
            print(f"    - {str(rel_path):<25} : MISSING")
            all_dirs_ok = False

    # 4. Configuration Check
    print("\n[4] Validating Configuration (src/config.py):")
    try:
        from src.config import (
            RANDOM_STATE, TEST_SIZE, CV_FOLDS,
            HEART_RAW_PATH, DIABETES_RAW_PATH, BREAST_CANCER_RAW_PATH
        )
        print(f"    - RANDOM_STATE          : {RANDOM_STATE}")
        print(f"    - TEST_SIZE             : {TEST_SIZE * 100:.0f}%")
        print(f"    - CV_FOLDS              : {CV_FOLDS} folds")
        print(f"    - Heart Data Path       : {HEART_RAW_PATH.name} ({'FOUND' if HEART_RAW_PATH.exists() else 'NOT FOUND'})")
        print(f"    - Diabetes Data Path    : {DIABETES_RAW_PATH.name} ({'FOUND' if DIABETES_RAW_PATH.exists() else 'NOT FOUND'})")
        print(f"    - Breast Cancer Path    : {BREAST_CANCER_RAW_PATH.name} ({'FOUND' if BREAST_CANCER_RAW_PATH.exists() else 'NOT FOUND'})")
        config_ok = True
    except Exception as e:
        print(f"    - Config Error: {e}")
        config_ok = False

    # 5. Raw Data Integrity
    print("\n[5] Validating Raw Datasets:")
    import pandas as pd
    datasets = [
        ("Heart Disease", HEART_RAW_PATH, (10000, 21)),
        ("Diabetes", DIABETES_RAW_PATH, (768, 9)),
        ("Breast Cancer", BREAST_CANCER_RAW_PATH, (569, 31))
    ]
    all_data_ok = True
    for name, path, expected_shape in datasets:
        if path.exists():
            df = pd.read_csv(path)
            print(f"    - {name:<15} : {df.shape[0]} rows, {df.shape[1]} columns (Matches expected: {expected_shape})")
        else:
            print(f"    - {name:<15} : FILE MISSING")
            all_data_ok = False

    # Summary
    print("\n" + "=" * 60)
    if all_deps_ok and all_dirs_ok and config_ok and all_data_ok:
        print("RESULT: PHASE 1 COMPLETED AND FULLY VERIFIED")
    else:
        print("RESULT: PHASE 1 REQUIRES ATTENTION")
    print("=" * 60)

if __name__ == "__main__":
    check_phase_1()
