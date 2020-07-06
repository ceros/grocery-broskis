FROM mhart/alpine-node

WORKDIR /src
COPY . .

RUN npm install
RUN npm run test
RUN npm run build

EXPOSE 8080 

CMD ["npm", "start"]
