FROM node:6.11.4

RUN mkdir /app

RUN npm install nodemon -g

WORKDIR /app

ADD package.json package.json
COPY config config

RUN npm install

RUN ls -l /app

ENV NAME default
RUN export NODE_ENV=default
ENTRYPOINT ["npm", "start"]
