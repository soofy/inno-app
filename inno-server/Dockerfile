FROM node:16-alpine

#RUN mkdir -p /usr/src/app

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3001

CMD ["npm", "run", "dev"]
