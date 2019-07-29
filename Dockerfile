# ############################################################
# #Dockerfile to build custom Ubuntu image
# # Use this as base image
# # Tag renovitetechnologies/reno-secure-ui-features-backend-sandbox:v1
# ############################################################

FROM ubuntu
RUN apt-get update && apt-get -y install git bash nodejs curl npm
RUN nodejs --version
RUN npm -v
ARG username
ARG password
ARG ENV_DB_USER
ARG ENV_DB_PASSWORD
ARG ENV_DB_HOST
ARG ENV_DB_NAME
ARG ENV_DB_PORT

ENV DB_HOST=${ENV_DB_HOST}
ENV DB_USER=${ENV_DB_USER}
ENV DB_PASSWORD=${ENV_DB_PASSWORD}
ENV DB_NAME=${ENV_DB_NAME}
ENV DB_PORT=${ENV_DB_PORT}
ENV DB_ENGINE=mysql
ENV DB_ENGINE_VERSION=8
ENV PRODUCTION_HOST_API=
ENV JWT_SECRET = nTzg7**T$zzn$6Qu
ENV SESSION_SECRET = cQ%zxb7\"-xqQRxH 

RUN git clone https://${username}:${password}@bitbucket.org/renoprod/reno-secure-ui-features-backend-sandbox.git
WORKDIR /reno-secure-ui-features-backend-sandbox
RUN npm install
ENTRYPOINT ["node","index.js"]

