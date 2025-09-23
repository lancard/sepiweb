FROM node:trixie

WORKDIR /app

COPY index.js /app/index.js
COPY index.html /app/index.html

RUN npm i express iconv-lite socket.io

ENTRYPOINT node ./index.js
