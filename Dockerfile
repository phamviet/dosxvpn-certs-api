FROM node:8-alpine

ENV NODE_ENV production
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install --production
VOLUME /etc/ipsec.d
EXPOSE 3000
CMD ["/usr/local/bin/npm", "start"]
