#!/usr/bin/env bash
docker run --name mongodb -v `pwd`/.mongo/data:/data/db -p 27017:27017 -d mongo:3.2