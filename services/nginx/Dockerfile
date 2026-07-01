FROM nginx:stable-alpine3.23-perl
RUN apk add npm nodejs

COPY ./frontend /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./tailwind.config.js /usr/share/nginx/html/tailwind.config.js

WORKDIR /usr/share/nginx/html

RUN npm install socket.io
RUN npm install -D tailwindcss@^3 postcss autoprefixer

# Compile Tailwind CSS files
RUN ./node_modules/.bin/tailwindcss -i ./game/style/style.src.css -o ./game/style/style-theme.css --minify
RUN ./node_modules/.bin/tailwindcss -i ./hub/style/hub.src.css -o ./hub/style/hub.css --minify
RUN ./node_modules/.bin/tailwindcss -i ./stats/stats.src.css -o ./stats/stats.css --minify
RUN ./node_modules/.bin/tailwindcss -i ./error/error.src.css -o ./error.css --minify

EXPOSE 443 80
CMD ["nginx", "-g", "daemon off;"]