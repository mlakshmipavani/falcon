## Read Me

This is the server for Yolobots.

### How to run the server, locally?
```sh
# install local dependencies
> npm install

# we make a heavy use of gulp
> npm install -g gulp
```

Install [docker](https://docs.docker.com/engine/installation/ubuntulinux/), if you haven't already.

```sh
# pull the node image specified in Dockerfile
> docker pull node:5.3.0
```

Now that you have all the tools required to run the server, lets try to run it.

```sh
# Build the docker container
> gulp docker.build

# Run the server
> gulp docker.run
```

Gulp is a task runner we use, you can find the available tasks by
```sh
> gulp
```

### How to deploy the server?
We use [tutum](https://www.tutum.co/) to deploy our docker containers and those containers are run on Microsoft Azure.

All the things required to deploy the server are right inside this repo except the environment variables for production, they can be found in `jaydp17`'s gitlab snippets.

Get that file and store it in the root of the project with a file name `.env`

```sh
# Build the production docker image
> gulp docker.build.prod

# Push the image on tutum's private docker registory
> gulp tutum.push

# Create a service on tutum if it doesn't already exists (Most probably it does, so you don't need to do this)
> gulp tutum.create

# Start the service on tutum
> gulp tutum.start
```

## Multiple Tutum A/Cs
As we cannot link two Microsoft Azure a/c in one tutum a/c, we use two different tutum a/c.

| Tutum Username | A/C used for                      |
|----------------|-----------------------------------|
| jaydp17        | Runs the main server and the site |
| patoliya       | Runs mongodb                      |

