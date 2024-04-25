FROM node:18.20.2-alpine3.18

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD [ "yarn" , "start:dev"]