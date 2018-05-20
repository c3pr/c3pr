#!/usr/bin/env bash

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")


./npmi.sh $SCRIPTPATH/../../c3pr-agent
./npmi.sh $SCRIPTPATH/../../c3pr-brain
# ./npmi.sh $SCRIPTPATH/../../c3pr-dashboard/frontend &
./npmi.sh $SCRIPTPATH/../../c3pr-dashboard
./npmi.sh $SCRIPTPATH/../../c3pr-hub
./npmi.sh $SCRIPTPATH/../../c3pr-repo-github
./npmi.sh $SCRIPTPATH/../../c3pr-repo-gitlab
./npmi.sh $SCRIPTPATH/../../node-c3pr-hub-client
./npmi.sh $SCRIPTPATH/../../node-c3pr-logger
./npmi.sh $SCRIPTPATH/../../node-c3pr-repo
./npmi.sh $SCRIPTPATH/../../node-git-client