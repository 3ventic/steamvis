#!/bin/bash

TAG=$(git describe --tags --abbrev=0)

docker build -t ghcr.io/3ventic/steamvis:$TAG .
docker push ghcr.io/3ventic/steamvis:$TAG