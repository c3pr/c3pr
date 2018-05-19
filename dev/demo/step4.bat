cd ..
docker build -t c3prgl .
docker run -d -p 5002:5002 --name c3prgl c3prgl