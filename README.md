# Debatably

The following instructions have been written to run on the Windows operating system.

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
