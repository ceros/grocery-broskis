# Grocery App 

An application to make it easier for the Immuno compromised to get their groceries!

## Development

After pulling the github repo, you can run the development server by first running the MySql docker
container and then running nodemon and the react dev server.

From the root project directory, build the mysql docker container:

```
$ cd database
$ docker build -t grocery-sql .
```

Navigate back to the root directory and run the MySql docker container:

```
$ cd ..
$ docker run -d -p 3306:3306 --name grocery-sql grocery-sql
```

Run ``npm install`` to install project dependencies:

```
$ npm install
```

Run the development server for react and node to allow hot reloading while you develop:

```
$ npm run dev
```

When you're ready to test your project in a more production like context, kill the development
server and build the app docker container.

From the root project directory:

```
$ docker build -t grocery .
$ docker run -d -p 8080:8080 -e NODE_ENV="development" --name grocery grocery 
```

To connect to the docker container, you'll need to point your browser to `http://localhost:8080`.

When you're done, make sure to clean up the two docker containers:

```
$ docker stop grocery
$ docker stop grocery-sql
$ docker rm grocery
$ docker rm grocery-sql
```
