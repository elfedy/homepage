#!/usr/bin/env bash

set -e
set -o pipefail

rm -rf build
mkdir build

cp src/*.html build/
