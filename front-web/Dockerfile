FROM node:carbon

WORKDIR /app

COPY ./package.json ./

RUN npm install --legacy-peer-deps
RUN npm install react-scripts@3.4.1 -g --silent

COPY . .

EXPOSE 8080

CMD ["npm", "start"]