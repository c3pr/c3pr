docker build -f test.Dockerfile -t delme --rm=false .
docker run -p 1234:5003 delme
