# WEB CONTROL CENTER (FRONTEND)

Base project directory: `./frontend`. The running commandos must be executed in the base directory

## Dependencies Install

### `npm install`

The command will automatically install the dependencies from package.json with version from package-lock.json

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
In order to change the application port, change script `start` to `set PORT=5000 && react-scripts start` on Window or `PORT=5000 react-scripts start` on Ubutu/Linux

## Deploy the application in Docker

- Make sure that `package.json` is configured for Linux kernel: script `start`, which sets application to use port 5000, should be `PORT=5000 react-scripts start`
- Build image: `docker build -t wcc-frontend .`
- Run the application in container: `docker run -p 5000:5000 wcc-frontend`
