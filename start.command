#!/bin/bash
BASEDIR=$(dirname "$0")
cd "$BASEDIR"
docker-compose build
docker-compose up -d