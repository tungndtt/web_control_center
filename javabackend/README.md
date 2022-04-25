# WEB CONTROL CENTER (JAVA BACKEND)

Base project directory: `./javabackend`. The running commandos must be executed in the base directory  

## Dependencies

If your IDE does not support auto-build, run `mvn install` to pull the dependencies

## Start the application

Run `mvn spring-boot:run`

## Application configuration

- `resources.properties`: configure the resources' path like `application.properties`, `users.json` and `control_config.json`
- `application.properties`: application's configuration
- `users.json`: users' information
- `control_config.json`: control state configuration

## Build the application

Run `mvn package` and a executable JAR file is generated in the directory `target`.

## Run executable JAR file

In `target`, run `java -jar WebcontrolCenter.jar`

## Deploy the application in Docker

- Build image: `docker build -t wcc-backend .`
- Run the application in container: `docker run -p 3500:3500 -p 4500:4500 wcc-backend`

**Note**: In `resources.properties`, the proper path to the configuration files `application.properties`, `users.json` and `control_config.json` must be adapted to read the configurations from `config`.

## Connect with DBD remote instance

- Install telnet: run `pkgmgr /iu:”TelnetClient”` in the terminal
- Telnet already installed: `telnet akabahn.de 2435`


