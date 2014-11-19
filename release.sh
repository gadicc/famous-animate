#! /bin/bash -e
msg=$1; if [ -z "${msg}" ]; then echo "commit message mandatory"; exit 3; fi

if [ $(git status | grep -c "Untracked") = 1 ]; then git status; exit 3; fi

#spacejam -test-packages ./
git commit -m "${msg}" -a
git push

