@echo off
echo Building the project...
call npm run build

echo Moving build to docs...
if exist ..\docs rmdir /s /q ..\docs
move build ..\docs

echo Committing and pushing changes...
cd ..
git add .
git commit -m "Update build"
git push origin main

echo Deployment complete!
