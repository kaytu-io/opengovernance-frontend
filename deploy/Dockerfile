# Prepare nginx
FROM docker.io/nginx:1.25.0-alpine
COPY ./build /usr/share/nginx/html
COPY ./.env.example /usr/share/nginx/html/.env
RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/nginx.conf /etc/nginx/conf.d

RUN apk add --update npm
RUN npm i -g runtime-env-cra@0.2.4

WORKDIR /usr/share/nginx/html

# Fire up nginx
EXPOSE 7298
#CMD ["nginx", "-g", "daemon off;"]
CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
