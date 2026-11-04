#!/bin/zsh
# dùng: dev/w2-multi.sh name "query" [w h] [evals...]  -> dev/shots/w2-name.png
cd "$(dirname "$0")/.."
n="$1"; q="$2"; shift 2
node dev/w2-shot.mjs "$q" "dev/shots/w2-$n.png" "$@" | tail -2
