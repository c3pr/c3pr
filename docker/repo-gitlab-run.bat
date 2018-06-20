docker rm -f c3pr_repo_gitlab
docker run ^
 -p 5004:5004 ^
 --name c3pr_repo_gitlab ^
 -e C3PR_MONGO_URL=%C3PR_MONGO_URL% ^
 -e C3PR_REPO_GITLAB_URL=http://127.0.0.1:5004 ^
 -e C3PR_HUB_URL=http://host.docker.internal:5000 ^
 -e GITLAB_URL=http://c3prgitlab:8888 ^
 -e GITLAB_API_TOKEN=%GITLAB_API_TOKEN% ^
 --entrypoint "/bin/sh" ^
 c3pr-repo-gitlab ^
 -c "echo `/sbin/ip route|awk '/default/ { print $3 }'` c3prgitlab >> /etc/hosts; npm start"

REM -e GITLAB_BOT_USER_ID=%GITLAB_BOT_USER_ID% ^
REM -e GITLAB_BOT_USER_USERNAME=%GITLAB_BOT_USER_USERNAME% ^
REM -e GITLAB_BOT_USER_EMAIL=%GITLAB_BOT_USER_EMAIL% ^