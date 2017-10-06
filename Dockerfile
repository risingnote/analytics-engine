FROM node:8.6

# Run an analytics engine for a party to manage db access and act as client to spdz engines.
# Relies on npm install run already, see build.sh.
# Build container with:
#   docker build -t spdz/analytics-engine:vx.y.z .
# Run container with:
#    docker run -d --rm --name analytics-engine-0 -p 3020:8080 
#      -v $(pwd)/config/analyticConfig.bank.json:/usr/app/config/analyticConfig.json 
#      -v $(pwd)/logs:/usr/app/logs spdz/analytics-engine:snapshot

LABEL name="SPDZ Analytics Engine." \
  description="SPDZ Analytics Engine is run by a party to manage DB access and act as a client to SPDZ engines." \
  maintainer="Jonathan Evans" \
  license="University of Bristol : Open Access Software Licence" 

ENV NODE_ENV production
ENV LOG_LEVEL info
ENV HTTP_PORT 8080
ENV PLAYER_ID 0

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Pull in files
# Not using npm install because complexity of accessing private github repo from docker.
COPY node_modules /usr/app/node_modules
COPY src /usr/app/src
COPY package.json /usr/app

EXPOSE 8080

# Logs are mapped to host to be kept
VOLUME /usr/app/logs
# Location of config file
VOLUME /usr/app/config/analyticConfig.json

CMD exec node src/index.js 2>&1 | tee /usr/app/logs/analytics-engine_$PLAYER_ID.log
