# base image
FROM nginx:alpine

# set working directory
WORKDIR .

RUN apk update && apk add git

# RUN git clone --single-branch --branch gh-pages https://github.com/clementgerard1/4DLeanBoard.git && mv 4DLeanBoard/* usr/share/nginx/html
COPY . .

RUN npm install
RUN npm run build
RUN mv dist/* usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]