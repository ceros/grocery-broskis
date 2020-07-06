FROM mhart/alpine-node

WORKDIR /src
COPY . .

# TECHDEBT: Hacky, but cleaning out the node_modules before running npm install ensures
# that the correct modules for the containers context are installed, and we
# don't accidentially inherit modules used for local development.
RUN rm -r node_modules

RUN npm install
RUN npm run test
RUN npm run build

EXPOSE 8080 

CMD ["npm", "start"]
