FROM ubuntu:14.04

# RUN git clone https://<REPLACE ME>@github.com/dring1/gopheringdj.git /go/src/github.com/dring/gopheringdj
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y curl git mercurial make binutils bison gcc build-essential golang

RUN mkdir -p /go
ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH

WORKDIR /go/src/github.com/dring1/gopheringdj

ADD . /go/src/github.com/dring1/gopheringdj

RUN go get github.com/tools/godep

RUN godep restore

RUN go install

ENV DJPORT 8080

EXPOSE 8080

ENTRYPOINT ["/go/bin/gopheringdj"]