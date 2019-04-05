CALL npm install -g mocha
CALL cd ./src/data
CALL mocha populateDatabase.test.js --timeout 10000 --exit
CALL cd ../..