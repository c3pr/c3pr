set VERSION=3.0.0
cd ..
call npm run bundle
cd build
docker build . --build-arg AGENT_VERSION=%VERSION% -t c3pr-agent-build
docker run -v %~dp0..\dist:/c3pr c3pr-agent-build
git commit -m "[%VERSION%] release new version"
git tag %VERSION%
REM notice the generated executable is not added to source control, but should be uploaded to github releases page