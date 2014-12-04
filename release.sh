#! /bin/bash
msg=$1; if [ -z "${msg}" ]; then echo "commit message mandatory"; exit 3; fi

spacejam test-packages ./

echo "spacejam exitcode:$?"

if [ $(git status | grep -c "Untracked") = 1 ]; then git status; exit 3; fi

version=$(cat package.js | grep -Po 'version : "\K[^"]*')
minorVersion=$(echo ${version} | cut -d '.' -f 3)
newVersion="$(echo ${version} | cut -d '.' -f 1-2).$(($minorVersion + 1))"

echo "V: $version m: $minorVersion n:$newVersion"

sed -i "s/version : \"$version\"/version : \"$newVersion\"/g" package.js

git commit -m "${msg}" -a
git push

meteor publish
