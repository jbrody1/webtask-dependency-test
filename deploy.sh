#!/bin/bash

npm install
rm build/test.js
#wt create --bundle test.js -n webtask-dependency-test
wt-bundle -m -o build/test.js test.js
wt create build/test.js -n webtask-dependency-test

