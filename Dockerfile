FROM ubuntu:14.04

# RUN git clone https://<REPLACE ME>@github.com/dring1/gopheringdj.git /go/src/github.com/dring/gopheringdj
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y curl git mercurial make binutils bison gcc build-essential

# Install Golang V 1.5
ENV GOLANG_VERSION 1.5
ENV GOLANG_DOWNLOAD_URL https://golang.org/dl/go$GOLANG_VERSION.linux-amd64.tar.gz
ENV GOLANG_DOWNLOAD_SHA1 5817fa4b2252afdb02e11e8b9dc1d9173ef3bd5a

RUN curl -fsSL "$GOLANG_DOWNLOAD_URL" -o golang.tar.gz \
  && echo "$GOLANG_DOWNLOAD_SHA1  golang.tar.gz" | sha1sum -c - \
  && tar -C /usr/local -xzf golang.tar.gz \
  && rm golang.tar.gz

ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH

RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"

WORKDIR /go/src/github.com/dring1/gopheringdj

ADD . /go/src/github.com/dring1/gopheringdj

RUN go get github.com/tools/godep

RUN godep restore

RUN go install

RUN apt-get autoremove -y

# Clear package repository cache
RUN apt-get clean all

ENV DJPORT 8080

EXPOSE 8080

ENTRYPOINT ["/go/bin/gopheringdj"]
