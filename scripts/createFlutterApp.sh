#!/bin/bash

version="$1"

# Check if argument 1 is missing
if [ -z "$version" ]; then
  echo "Error: Missing flutter version argument."
  exit 1
fi

mkdir -p public/data/src
cd public/data/src
pwd
rm -rf $version

fvm spawn $version create flutter_upgrade_helper_app

cd flutter_upgrade_helper_app

git init
git add .
git commit -m first

git clean -Xdf
rm -rf .git
find . -type f -name "*.png" -exec rm {} +
find . -type f -name "*.ico" -exec rm {} +

pwd
cd ..
mv flutter_upgrade_helper_app/ $version
