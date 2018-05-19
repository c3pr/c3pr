# Developing for GitLab

## Steps

1. Add `127.0.0.1 c3prgitlab` line to the `hosts` file.
    - This is optional, but should make things easier.
    - If you skip this step, whenever you see `http://c3prgitlab:8888` below, replace with `http://127.0.0.1:8888`.
2. Run `docker-compose up`
3. log in using `root` as user and `c3prc3pr` as password.
    - Create an **`api`**+**`read_user`** token for `@root`
        - Navigate to `Settings -> Access tokens` or go to http://c3prgitlab:8888/profile/personal_access_tokens
        - Something like `-x-AyJ-9ULh1JytxMRs9`
4. create API token