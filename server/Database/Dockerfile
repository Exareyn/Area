FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=password

COPY ./DataBase.sql /docker-entrypoint-initdb.d/DataBase.sql

# EXPOSE 5432