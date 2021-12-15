FROM node:latest

COPY . .

RUN yarn install

ENV PORT=8080
EXPOSE 8080

CMD [ "yarn", "start" ]