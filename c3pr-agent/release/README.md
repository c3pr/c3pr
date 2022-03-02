# Release Steps

- Edit `release/version.bat` to update the `VERSION` number. 
- Run `release.bat`
    - That will generate an executable on `release/c3pr-agent-alpine-X.Y.Z`.
    - When OK, you should  **upload** it to the [github releases page](https://github.com/c3pr/c3pr-agent/releases).

You can test the binary via `test.bat`.

You can also automatically commit and tag via:

```bash
# inside release folder
commit.bat
```