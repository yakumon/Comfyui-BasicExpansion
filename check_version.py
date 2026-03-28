import importlib.metadata
import os

try:
    frontend_version = importlib.metadata.version("comfyui-frontend-package")
    print(f"Frontend Package: {frontend_version}")
except Exception as e:
    print(f"Frontend Package not found: {e}")

try:
    with open("comfyui_version.py", "r") as f:
        print(f"ComfyUI Version File: {f.read().strip()}")
except Exception as e:
    print(f"ComfyUI Version File not found")
