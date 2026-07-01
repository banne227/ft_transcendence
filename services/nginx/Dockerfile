FROM nginx:stable-alpine3.23-perl
RUN apk add npm nodejs

COPY ./frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./tailwind.config.js /usr/share/nginx/html/tailwind.config.js

WORKDIR /usr/share/nginx/html

RUN npm install socket.io
RUN npm install -D tailwindcss@^3 postcss autoprefixer

# Compile Tailwind : lit le fichier source (@tailwind/@apply)
# et écrit le CSS final que game.html charge déjà.
RUN ./node_modules/.bin/tailwindcss -i ./game/style/style-theme.src.css -o ./game/style/style-theme.css --minify