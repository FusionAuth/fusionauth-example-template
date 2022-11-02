# Example: Using {THING} with FusionAuth
This project contains an example project that illustrates using FusionAuth with {THING}.

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/): Presumably you already have this on your machine if you are looking at this project locally; if not, use your platform's package manager to install git, and `git clone` this repo.
* {THING requirements}

## Installation
* `git clone https://github.com/FusionAuth/fusionauth-example-template`
* `cd fusionauth-example-template`
* `docker-compose up`
* {Other steps}

## FusionAuth Configuration
This example assumes that you will run FusionAuth from a Docker container. In the root of this project directory (next to this README) are two files [a Docker compose file](./docker-compose.yml) and an [environment variables configuration file](./.env). Assuming you have Docker installed on your machine, a `docker-compose up` will bring FusionAuth up on your machine.

The FusionAuth configuration files also make use of a unique feature of FusionAuth, called Kickstart: when FusionAuth comes up for the first time, it will look at the [Kickstart file](./kickstart/kickstart.json) and mimic API calls to configure FusionAuth for use. It will perform all the necessary setup to make this demo work correctly, but if you are curious as to what the setup would look like by hand, the "FusionAuth configuration (by hand)" section of this README describes it in detail.

For now, get FusionAuth in Docker up and running (via `docker-compose up`) if it is not already running; to see, [click here](http://localhost:9011/) to verify it is up and running.

> **NOTE**: If you ever want to reset the FusionAuth system, delete the volumes created by docker-compose by executing `docker-compose down -v`. FusionAuth will only apply the Kickstart settings when it is first run (e.g., it has no data configured for it yet).


## Running / Development



## FusionAuth configuration (by hand)
Again, remember that all of this is already automated for you as part of the [Kickstart file](kickstart/kickstart.json) that will be executed the first time FusionAuth comes up, and if you ever need to regenerate it, you can delete the Docker volumes (`docker-compose down -v`) to remove them entirely (which will then cause FusionAuth to initialize itself from the Kickstart file on the next startup).

Assuming FusionAuth is running locally on port 9011, go [here](http://localhost:9011/admin) to log in as an admin and configure an asymmetric key, an application, and two users. If you have never run FusionAuth locally before, you will need to create an admin user (next).

### Create the Admin user
This will only be necessary

### Create the asymmetric key

### Create the application

### Configure the application to use the asymmetric key you created

### Register the admin user to the application

### Create a non-admin user

### Register the non-admin user to the application

