@echo off
call version.bat
docker build -f test.Dockerfile --build-arg AGENT_VERSION=%VERSION% -t c3pr-agent-test-can-delete --rm=false .
docker run -p 1234:5003 c3pr-agent-test-can-delete
start "" http://localhost:1234