FROM node:trixie

COPY index.js /root/index.js
COPY index.html /root/index.html

WORKDIR /root

RUN npm i express iconv-lite socket.io

ENTRYPOINT node ./index.js
