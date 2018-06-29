
FROM dystroy/gomysql:latest as builder

COPY ./go/src/chrall/ /go/src/chrall/
COPY ./go/src/chrallserver/ /go/src/chrallserver/

RUN go install chrall
RUN go install chrallserver

ENV	GOGO_PORT="9090"
ENV	DB_USERNAME="temp_user"
ENV	DB_PASSWORD="temp_password"

EXPOSE 9090

ENTRYPOINT ["/go/bin/chrallserver", "-dir", "/"]
