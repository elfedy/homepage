#!/usr/bin/env bash

set -e
set -o pipefail

rm -rf build
mkdir build
mkdir build/articles
mkdir build/games

echo starting build..
timestart=$SECONDS

node build_pages.js
npx postcss src/css/index.css > build/index.css
cp src/games/* build/games

timeend=$SECONDS
timediff=$(($timeend - $timestart))
echo built successfully in $timediff seconds
