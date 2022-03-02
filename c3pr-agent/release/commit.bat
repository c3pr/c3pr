@echo off
call version.bat
git add -A ..
git commit -m "[%VERSION%] release new version"
git tag %VERSION%