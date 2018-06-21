docker rm -f c3pr_hub
docker run ^
 -p 5000:5000 ^
 --name c3pr_hub ^
 -e PORT=5000 ^
 -e C3PR_MONGO_URL=%C3PR_MONGO_URL% ^
 c3pr-hub