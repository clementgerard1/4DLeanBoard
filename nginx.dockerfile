# base image
FROM nginx:alpine

# set working directory
WORKDIR .

COPY . .

RUN apk update && apk add git && apk add npm
RUN npm install 
RUN npm run build

# RUN git clone --single-branch --branch gh-pages https://github.com/clementgerard1/4DLeanBoard.git && mv 4DLeanBoard/* usr/share/nginx/html
# COPY dist usr/share/nginx/html
RUN mv dist/* usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]