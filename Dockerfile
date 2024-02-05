FROM ubuntu

RUN ulimit -c unlimited
RUN apt-get update
RUN apt-get npm -y
RUN apt-get upgrade -y

COPY index.js /root/index.js
COPY app /root/app

WORKDIR /root

RUN npm i express iconv-lite socket.io

ENTRYPOINT node ./index.js
