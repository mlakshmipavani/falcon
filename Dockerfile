FROM node:5.3.0

RUN mkdir /src

WORKDIR /src

COPY package.json /src/

RUN npm install --production

COPY . /src

EXPOSE 3000 3001

CMD ["npm", "run", "start_prod"]
