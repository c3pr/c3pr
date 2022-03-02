@echo off
call version.bat
docker kill c3pr-agent-test-can-delete
docker build -f test.Dockerfile --build-arg AGENT_VERSION=%VERSION% -t c3pr-agent-test-can-delete --rm=false .
docker run -p 1234:5003 --name c3pr-agent-test-can-delete c3pr-agent-test-can-delete
start "" http://localhost:1234