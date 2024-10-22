
# OAuth2 Node API v2 - Installation Guide

Here’s a step-by-step installation guide for your GitHub repository oauth2-node-api-v2. This guide will walk users through the process of cloning your repository, setting it up, and running the application using Docker.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:

Docker: If you don’t have Docker installed, follow the installation instructions on the Docker website.
Git: You’ll need Git to clone the repository. Install it from here.

## Tutorial
[Demystifying OAuth 2.0 Flow: Unleashed With Google Authentication (Dockerized)](https://medium.com/jungletronics/demystifying-oauth-2-0-flow-unleashed-b6d1e652bbd5)

## Installation

#### Step 1: Clone the Repository
Open your terminal or command prompt.

Navigate to the directory where you want to clone the project. For example:
  
    cd ~/Documents/

Clone the repository using the following command:

    git clone https://github.com/giljr/oauth2-node-api-v2.git

Move into the project directory:

    cd oauth2-node-api-v2

#### Step 2: Build and Run the Docker Containers
Make sure you have Docker running on your system. Then follow these steps:

Check for any running Docker containers:

    docker ps -a

Build and start the application:

    sudo docker compose up --build

This command will:

```Build the Docker images as defined in the *docker-compose.yml* file.
   Start the containers and the application.   
```
Verify that the containers are running.

```If everything works correctly, you should see the application logs in the terminal.
``` 
You can check the status of running containers:

    docker ps

#### Step 3: Access the Application
Once the Docker containers are up and running, you can access the OAuth2 Node API by navigating to the following URL in your browser:

    http://localhost:5000

If the application uses a different port, be sure to check the ```docker-compose.yml``` file for the correct port mapping.

#### Step 4: Shut Down the Docker Containers
When you're done using the application, you can stop and remove the containers by running:

    sudo docker compose down

This will stop all running containers and remove them.

#### Step 5: Restart the Application
To restart the application after stopping the containers, use the following command:

    sudo docker compose up --build

You can use this command every time you need to restart the application, ensuring that any changes to the project will be rebuilt.

### Command Summary
Here’s a quick summary of the commands you’ll use:

1 . Clone the repo:

    git clone https://github.com/giljr/oauth2-node-api-v2.git
    cd oauth2-node-api-v2

2 . Build and run the Docker containers:

    sudo docker compose up --build

3 . Stop and remove the containers:

    sudo docker compose down

### Conclusion
You now have a working OAuth2 Node API running in Docker. If you encounter any issues during setup or have questions, feel free to consult the repository's documentation or reach out for help.

Happy coding!

## Tech Stack

**Client:** Express

**Server:** Node, Express


## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [Code of Conduct](./CODE_OF_CONDUCT.md).
