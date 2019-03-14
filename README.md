# koa-template

- [API](#api)
    - [Documentation](#documentation)
    - [Tests](#tests)
    - [Run API Locally](#run-api-locally-)
    - [Code coverage](#code-coverage)

# API :

## Documentation

- run : `$ npm run doc`
- open `./apidoc/index.html` to read the documentation

## Tests

- run : `$ npm install`
- run test on docker : `npm run docker-test` This will run the tests and relaunch the tests if files are changing.
- run test locally : `$ npm test` You will need to have a postgresSQL on localhost. You can use the docker created by the `npm run docker-test` command.

## Run API Locally :

- run API server locally with docker : `npm run docker-dev`

## Code Coverage

After running `$ npm test` you can access the code coverage report here : `./coverage/index.html`
