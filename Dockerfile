FROM ubuntu

RUN ulimit -c unlimited
RUN apt-get update
RUN apt-get install npm -y
RUN apt-get upgrade -y

COPY index.js /root/index.js
COPY index.html /root/index.html

WORKDIR /root

RUN npm i express iconv-lite socket.io

ENTRYPOINT node ./index.js
