#!/usr/bin/env bash

set -e
set -o pipefail

rm -rf build
mkdir build
mkdir build/articles
mkdir build/games

echo starting build..
timestart=$SECONDS

# html pages
node build_pages.js

# css
for file in src/css/*.css
do
  ./build_css_file.sh $file 
done

# copy games (src should just have a build)
cp -r src/games/* build/games

timeend=$SECONDS
timediff=$(($timeend - $timestart))
echo built successfully in $timediff seconds
