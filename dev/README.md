# Developing for GitLab

## Steps

1. Add `127.0.0.1 c3prgitlab` line to the `hosts` file.
    - This is optional, but should make things easier.
    - If you skip this step, whenever you see `http://c3prgitlab:8888` below, replace with `http://127.0.0.1:8888`.

2. Run GitLab
    - `# cd gitlab/gitlab`
    - `# docker-compose up`

3. Create API token
    - Go to gitlab: http://c3prgitlab:8888 and log in using `root`/`c3prc3pr`
    - Go to: http://c3prgitlab:8888/admin/application_settings
        - Scroll down to "Outbound requests"
        - Check the checkbox and save.
    - Go to  `Settings|Access tokens`: http://c3prgitlab:8888/profile/personal_access_tokens
        - Create an **`api`**+**`read_user`** token for `@root`
        - Something like `GkrbEjtK3YkCQvPRU7ye`

4. Go to the `gitlab/scripts` folder and add `GkrbEjtK3YkCQvPRU7ye` to the `__rootAccessToken` property in the script `1`.

5. Run scripts 2 and on (in the `gitlab/scripts`) folder, but read first:
    - The basic requirement for C-3PR to work is:
        - Create a user for the bot
    - After that, you can set up projects individually.
    - Setting up projects:
        - You must add a webhook to the `c3pr-repo-gitlab` in each of your projects.
        - To do that you can either:
            - Add the webhook (`Settings|Integrations`) manually; or
            - Give the bot user **Master** access to the project, so it may add a webhook itself (see script `4`); or
            - Have the GITLAB_API_TOKEN be a token for the root user (which can create a webhook for any project). 

6. Edit the `docker-compose.yml`, add a **`api`**+**`read_user`** token **for the c3pr bot user, not root** to `c3pr-repo-gitlab`:
    - Either 
    - Example:
    
          c3pr-repo-gitlab:
            ...
            environment:
              ...
              GITLAB_API_TOKEN: TKbVFC57TM27HcVnqK55