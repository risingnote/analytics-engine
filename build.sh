#!/bin/bash
# Build a docker image for production build of analytics-engine.
# NPM install is done outside of docker because need to pull down private repo, with user creds.
# Prerequisite is npm and docker installed, access to private spdz repos.
# Suggest building from separate checkout of project (i.e. not in dev version)
#  or will need to reinstall dev dependencies after)

PROJROOT=$(cd `dirname $0`; pwd)

echo "Building in $PROJROOT"

echo "============================================="
echo "Install node_modules for production only ...."
echo "============================================="
if test -d $PROJROOT/node_modules; then
  rm -fr $PROJROOT/node_modules
fi
npm install --production 

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "=================================================="
echo "Build docker image at version $PACKAGE_VERSION...."
echo "=================================================="
  
docker build -t spdz/workshop-voting-gui:v$PACKAGE_VERSION .
