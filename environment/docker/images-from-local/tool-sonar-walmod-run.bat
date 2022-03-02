docker rm -f c3pr_agent
docker run ^
 -p 5003:5003 ^
 --name c3pr_agent ^
 -e C3PR_MONGO_URL=%C3PR_MONGO_URL% ^
 -e C3PR_HUB_URL=http://host.docker.internal:5000 ^
 -e C3PR_AGENT_URL=http://host.docker.internal:5003 ^
 -e C3PR_AGENT_ID=via-local-docker ^
 --entrypoint "/bin/sh" ^
 c3pr/c3pr-tool-walkmod-sonar:1.6.1 ^
 -c "echo `/sbin/ip route|awk '/default/ { print $3 }'` c3prgitlab >> /etc/hosts; /c3pr/agent/c3pr-agent"

REM -e GITLAB_BOT_USER_ID=%GITLAB_BOT_USER_ID% ^
REM -e GITLAB_BOT_USER_USERNAME=%GITLAB_BOT_USER_USERNAME% ^
REM -e GITLAB_BOT_USER_EMAIL=%GITLAB_BOT_USER_EMAIL% ^