set VERSION=3.0.0
cd ..
call npm run bundle
git commit -m "[%VERSION%] release new version"
git tag %VERSION%
cd build
docker build . --build-arg AGENT_VERSION=%VERSION% -t c3pr-agent-build
docker run -v %~dp0..\dist:/c3pr c3pr-agent-build