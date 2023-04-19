#stage 1
FROM node:16.14.2-alpine as builder
LABEL author="Ugo"

#ARG NODE_ENV=staging
#ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app
COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn run build


#stage 2
FROM node:16.14.2
WORKDIR /usr/app
COPY package*.json ./

RUN yarn install --only=prod

COPY --from=builder /usr/app/dist .
#COPY .env .

EXPOSE 3500

#CMD ["npm", "start"]
CMD ["node", "index.js"]