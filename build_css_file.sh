#!/usr/bin/env bash

set -e
set -o pipefail

npx postcss $1 > build/${1##*/}
