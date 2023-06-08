FROM node:16.4.0-alpine as build
# RUN mkdir -p /meli_bff

WORKDIR /meli_bff

COPY package.json /meli_bff

RUN npm install

COPY . /meli_bff

CMD [ "npm", "run", "start" ]

EXPOSE 8181