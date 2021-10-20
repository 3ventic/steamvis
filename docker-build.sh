#!/bin/bash

TAG=$(git describe --tags --abbrev=0)

docker build -t docker.pkg.github.com/3ventic/steamvis/steamvis:$TAG .
docker push docker.pkg.github.com/3ventic/steamvis/steamvis:$TAG