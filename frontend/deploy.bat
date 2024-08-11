@echo off
echo Building the project...
call npm run build

echo Moving build to docs...
if exist ..\docs (
    attrib -r ..\docs\*.* /s
    rmdir /s /q ..\docs
)
if errorlevel 1 (
    echo Failed to remove old docs folder. Please close any programs that might be using files in this folder.
    exit /b 1
)

xcopy /E /I /Y build ..\docs
if errorlevel 1 (
    echo Failed to copy build files to docs folder.
    exit /b 1
)

echo Committing and pushing changes...
cd ..
git add .
git commit -m "Update build"
git push origin main

echo Deployment complete!
