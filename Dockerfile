FROM node:6.1.0

RUN mkdir /src

WORKDIR /src

COPY package.json /src/

RUN npm install --production

COPY . /src

EXPOSE 3000 5000

CMD ["npm", "run", "start_prod"]
