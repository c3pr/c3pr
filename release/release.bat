@echo off
call version.bat
rem cd ..
rem call npm run bundle
rem cd release
docker build -f release.Dockerfile --build-arg AGENT_VERSION=%VERSION% -t c3pr-agent-release-can-delete --rm=false .
rem docker run -v %~dp0..\dist:/c3pr -v %~dp0:/release c3pr-agent-release-can-delete
docker run -v %~dp0:/c3pr c3pr-agent-release-can-delete