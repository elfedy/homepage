#!/usr/bin/env bash

set -e
set -o pipefail

rm -rf build
mkdir build

echo starting build..

cp src/*.html build/
npx postcss src/css/index.css > build/index.css

echo built successfully
