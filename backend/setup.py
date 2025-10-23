import os
import sys
import subprocess
from pathlib import Path

if __name__ == "__main__":
    py = sys.executable
    root = Path(__file__).resolve().parent
    
    requirements_txt = root / "requirements.txt"
    if not requirements_txt.exists():
        print("You somehow deleted the requirements.txt file; try redownloading from the repo")
        sys.exit(1)
    
    venv_dir = root / ".venv"
    platform = os.name
        
    if not venv_dir.exists():
        subprocess.run([py, "-m", "venv", str(venv_dir)])
        print(f"Created virtual environment at {venv_dir}")
        
    venv_py = venv_dir / ("Scripts/python.exe" if platform == "nt" else "bin/python")
    
    subprocess.run([str(venv_py), "-m", "pip", "install", "-r", str(requirements_txt)])
    
    print("\n-------DONE-------")
    print("Virtual environment activation steps:")
    print("If linux/mac: Use `source .venv/bin/activate`")
    print("If Windows: Use `. .venv/Scripts/Activate.ps1` (i think)")
    print("Use `deactivate` to exit the virtual env.")
    