FROM node:4.3.1
MAINTAINER Fabien Franchini <fabien.franchini@heig-vd.ch>
COPY src /opt/app/
RUN ["npm", "install", "uuid", "--save"]
ENTRYPOINT ["node", "/opt/app/musician.js"]
