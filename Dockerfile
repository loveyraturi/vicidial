# ############################################################
# #Dockerfile to build custom Ubuntu image
# # Use this as base image
# # Tag renovitetechnologies/reno-secure-ui-features-backend-sandbox:v1
# ############################################################

FROM ubuntu
RUN apt-get update && apt-get -y install git bash nodejs curl npm
RUN nodejs --version
RUN npm -v
ENV DB_ENGINE=mysql
ENV DB_ENGINE_VERSION=8
ENV PRODUCTION_HOST_API=
ENV JWT_SECRET = nTzg7**T$zzn$6Qu
ENV SESSION_SECRET = cQ%zxb7\"-xqQRxH 

RUN git clone https://github.com/loveyraturi/vicidial.git
WORKDIR /vicidial
RUN npm install
ENTRYPOINT ["node","index.js"]

