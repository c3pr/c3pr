docker rm -f c3pr_brain
docker run ^
 -p 5001:5001 ^
 --name c3pr_brain ^
 -e C3PR_MONGO_URL=%C3PR_MONGO_URL% ^
 -e C3PR_HUB_URL=http://host.docker.internal:5000 ^
 -e C3PR_BRAIN_URL=http://host.docker.internal:5001 ^
 c3pr-brain