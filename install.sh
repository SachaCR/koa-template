#/bin/bash

echo Initializing: $1

git archive --format zip --output ../$1.zip origin/master
unzip ../$1.zip -d ../$1
grep -rl "koa-template" ../$1 | xargs sed -i "" "s/koa-template/$1/g"

echo Cleaning temporary files...

rm ../$1.zip
cd ../$1
rm install.sh
rm README.md
mv PROJECT_README.md README.md

echo $1 project created!
