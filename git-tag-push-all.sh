#!/usr/bin/env bash

cd ../c3pr-agent
echo tagging c3pr-agent...
git tag $(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
# git push --tags

cd ../c3pr-brain
echo tagging c3pr-brain...
git tag $(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
# git push --tags

cd ../c3pr-dashboard
echo tagging c3pr-dashboard...
git tag $(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
# git push --tags

cd ../c3pr-dashboard-ui
echo tagging c3pr-dashboard-ui...
git tag $(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
# git push --tags

cd ../c3pr-hub
echo tagging c3pr-hub...
git tag $(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
# git push --tags

cd ../c3pr-repo-gitlab
echo tagging c3pr-repo-gitlab...
git tag $(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json)
# git push --tags

# cd ../c3pr-tool-walkmod-sonar