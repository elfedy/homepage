#!/usr/bin/env bash

set -e
set -o pipefail

rm -rf build
mkdir build
mkdir build/articles

echo starting build..

node build_pages.js
npx postcss src/css/index.css > build/index.css

echo built successfully
