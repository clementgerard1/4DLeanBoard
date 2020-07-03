# base image
FROM nginx:alpine

# set working directory
WORKDIR .

COPY . .

RUN apk update && apk add git && apk add npm
RUN npm install 
RUN mkdir dist
RUN npm run build

RUN mv dist/* usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]