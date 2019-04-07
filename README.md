# Debatably

The following instructions have been written to run on the Windows operating system. 
If viewing this file on a notepad application, please ignore the ``` notations for the commands.

You must have Node installed on your machine. To install Node, go to the following link and download the MSI installer for Windows: https://nodejs.org/en/ 
-   To confirm that npm package manager has been correctly installed, run the following in a command prompt: 

    ```
    npm --version
    ```

    You should see the version of npm on your machine. If not, then you will need to add the directory of the installed folder of Node into the environment variables on your machine.

## Instructions to start up and set-up the mongodb database server:
### Method 1 (Recommended)
1. To install the MongoDB Server, download the MSI package from the following link: https://www.mongodb.com/download-center/community
    - When asked to choose the setup type during the installation, choose the complete version.
    - IMPORTANT: Choose to run MongoD as a Service.
2. To verify that the MongoDB Server is running in the background as a service, open the 'Services' Windows application. In the list of services, MongoDB Server should listed and the status should be 'Running'. If it is correctly running, you can skip to the instructions for running the server API. If it is not running, then try Method 2 below.

### Method 2
1. To install the MongoDB Server, download the ZIP package from the following link: https://www.mongodb.com/download-center/community
2. From the debatably root folder, create the directory /database/data/db (a folder in debatably called database, which has a folder called data, and a folder in data called db).
3. Extract the downloaded ZIP file, for the MongoDB Server, to the /database folder.
4. Navigate to the 'bin' folder in the extracted MongoDB Server, and open a new command line in that directory.
5. Now to run the MongoDB Server, from the 'bin' directory, run the following in the opened command line: 

    ```
    mongod.exe --dbpath ../../data/db
    ```

## Instructions to run the server API:
1. From the root folder (debatably), navigate to the server folder, and open a new command prompt in that directory.
2. First install the dependencies, by running: 

    ```
    npm install
    ```
3. Then to populate the Mongo database, run the command: 

    ```
    populate_database.bat
    ```
    - If unable to execute the bat file, open the file with a notepad application. Then take each command and execute them manually.
4. Once complete, to run the server, run the command: 

    ```
    npm start
    ```

## Instructions to run the client:
1. From the root folder (debatably), go into the client folder, and open a new command prompt in that directory.
2. If there already exists a built application in the directory /client/build, then you can skip to step 3. In order to build the application, run the following in the command prompt:

    ```
    npm install
    npm run build
    ```
3. Install the serve package by running: 

    ```
    npm install -g serve
    ```
4. Then run the command: 

    ```
    serve -s build
    ```
4. You should now be able to open the application in a web browser by navigating to: http://localhost:5000

## Example User Credentials
You are able to either register onto the application to create a new account, or use the following credentials:
* Email Address: dummyaccount@mail.com
* Password: password


## Open-Source Library Acknowledgements
- axios
    * https://github.com/axios/axios
- dateformat
    * https://github.com/felixge/node-dateformat
- dotenv
    * https://github.com/motdotla/dotenv
- firebase
    * https://github.com/firebase/firebase-js-sdk
- prop-types
    * https://github.com/facebook/prop-types
- react
    * https://github.com/facebook/react
- react-bootstrap
    * https://github.com/react-bootstrap/react-bootstrap
- react-dom
    * https://github.com/facebook/react
- react-router-bootstrap
    * https://github.com/react-bootstrap/react-router-bootstrap
- react-router-dom
    * https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom
- react-scripts
    * https://github.com/facebook/create-react-app
- recompose
    * https://github.com/acdlite/recompose
- vis-react
    * https://github.com/anishmprasad/vis-react
- body-parser
    * https://github.com/expressjs/body-parser
- chai
    * https://github.com/chaijs/chai
- cors
    * https://github.com/expressjs/cors
- eslint
    * https://github.com/eslint/eslint
- express
    * https://github.com/expressjs/express
- mocha
    * https://github.com/mochajs/mocha
- mongodb
    * https://github.com/mongodb/node-mongodb-native
- mongoose
    * https://github.com/Automattic/mongoose
- sinon
    * https://github.com/sinonjs/sinon
- supertest
    * https://github.com/visionmedia/supertest
- nodemon
    * https://github.com/remy/nodemon