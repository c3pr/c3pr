@echo off
call version.bat
cd ..
call npm run bundle
cd release
docker build -f release.Dockerfile --build-arg AGENT_VERSION=%VERSION% -t c3pr-agent-release-can-delete --rm=false .
docker run -v %~dp0..\dist:/c3pr -v %~dp0:/release c3pr-agent-release-can-delete