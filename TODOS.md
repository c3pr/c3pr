# TODOs

- GTILAB: Handle renamed files in gitlab
    - Get the commit hashes and read each info via API http://c3prgitlab:8888/api/v4/projects/1/repository/commits/13b7eed/diff?private_token=TKbVFC57TM27HcVnqK55
- BRAIN: save commit status in the database, so we can keep track of what has been created for each commit
- HUB-CLIENT: handleFirstCollectedEvent - uncollect upon error.

- GITLAB: add new project if project of given url not found (when creating ChangesCommitted, see `convertWebhookToChanges()`)

- TIC: add status (to indicate failure)

- DASHBOARD: add button that calls -repo to test if the bot can read the project.