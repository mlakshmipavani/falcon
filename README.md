# Read Me

This is the server for Yolobots.

## How to run the server, locally?
```sh
# install local dependencies
> npm install
```

Install [docker](https://docs.docker.com/engine/installation/ubuntulinux/), if you haven't already.

Now that you have all the tools required to run the server, lets try to run it.

```sh
# Build and run
> docker-compose up
```

The above command takes in to account `docker-compose.yml` and `docker-compose.override.yml` into account

To see the config before running the `docker-compose up`, you can use
```sh
> docker-compose config
```

## How to run using Intellij?

The first thing that you'll need is a mongodb instance
```sh
> ./runMongo.sh
```
Now that mongo is running you can start the app using the following steps:
- Open the file `app.js`
- Right click anywhere inside the file and select `Run 'app.js'`
- This will create a run configuration
- Edit that run configuration and add an env var `NODE_ENV=development`
- Run


## How to push the image to registry?
After you run `docker-compose up` or `docker-compose build`, the image is generated and named as `falconv2_falcon`.

Tag the image to `docker.yolosfalcon.com/falcon` as `docker.yolosfalcon.com` is StayYolo's private docker registry
```sh
> docker tag falconv2_falcon docker.yolosfalcon.com/falcon
```

Login to private docker registry
```sh
> docker login docker.yolosfalcon.com
# enter username/password
```

Push the image
```sh
> docker push docker.yolosfalcon.com/falcon
```

## How to deploy on Azure?
Check if you have a docker machine running on Azure with the name `yolo-falcon`
```sh
> docker-machine ls
```

It should give you an output similar to this
```sh
NAME            ACTIVE   DRIVER   STATE     URL                                     SWARM   DOCKER    ERRORS
yolo-falcon     -        azure    Running   tcp://yolo-falcon.cloudapp.net:2376             v1.10.3   
```

If it doesn't give you a machine named `yolo-falcon`, then use `deploy-machine` repo to deploy `yolo-falcon` machine.

Make sure you have the below port configuration on the VM in Azure

| Public Port | Private Port |
| ----------- | ------------ |
| 80 | 3000 |
| 443 | 5000 |

Going forward we'll assume that you have a machine named `yolo-falcon`.

SSH into the machine, and login to docker private registry
```sh
> docker-machine ssh yolo-falcon # you need to be in the deploy-machine dir for this to work

> sudo docker login docker.yolosfalcon.com
# enter username/password

> exit
```

Now connect to the remote docker-engine, and run the container
```sh
> eval $(docker-machine env yolo-falcon)
# now all the docker commands run in this instance of shell will be run on the remote docker engine

> docker-compose -f docker-compose.yml -f production.yml up -d
```

The `production.yml` is the file which contains production configuration for the container, get it from jaydp17's BitBucket snippets

## How to redeploy?
Just as mentioned in the deployment steps, build the new image and push it to private docker registry

Then connect to remote docker-engine
```sh
> eval $(docker-machine env yolo-falcon)
```

Pull the updated image
```sh
> docker-compose -f docker-compose.yml -f production.yml pull
```

Restart the service
```sh
> docker-compose -f docker-compose.yml -f production.yml up -d
```

## Troubleshooting

### docker-compose
Always run `docker-compose` commands with those two files specified
- docker-compose.yml
- production.yml

Like this
```sh
> docker-compose -f docker-compose.yml -f production.yml [COMMAND] [OPTIONS]
```
As all the production config resides in `production.yml`.

### See logs
If in case something goes wrong, run the service in foreground
```sh
> docker-compose -f docker-compose.yml -f production.yml up
# you can see the logs here
```

### Container keeps restarting
If the container keeps restarting, try removing the `restart` flag from the `docker-compose.yml` and then analyse the logs.

### DNS
In case if you change the name of he VM in azure, make sure that you change the AWS Route53 DNS record for `www.yolosfalcon.com` too to point it to the correct location

