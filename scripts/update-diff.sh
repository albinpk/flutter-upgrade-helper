#!/bin/bash

v=${1}

if [ -z "$v" ]; then
    echo "Error: Missing flutter version argument."
    exit 1
fi

echo "Version: $v"

git rm -rf .
git clean -fxd

fvm spawn $v create --project-name myflutterapp .

# Removing v prefix from tag (e.g. v1.0.0 -> 1.0.0)
tag=$v
if [[ $tag == v* ]]; then
    tag="${tag#v}"
fi

git add .
git commit -m "feat: upgrade to flutter \`v$tag\`"
git tag sdk-$tag
git push
git push --tags
