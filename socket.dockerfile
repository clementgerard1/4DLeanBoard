# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR ./4DLeanBoard

RUN apk update && apk add git

#RUN git clone https://github.com/clementgerard1/4DLeanBoard.git .
COPY . .

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install

# start app
CMD ["npm", "run", "socket"]