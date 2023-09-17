#!/bin/bash

docker stop $(docker ps | grep jaeger | awk '{print $1}')