FROM golang

# RUN git clone https://0460ab60ab75c65493cf9d05591f687c9ba7168a@github.com/dring1/gopheringdj.git /go/src/github.com/dring/gopheringdj


WORKDIR /go/src/github.com/dring1/gopheringdj

ADD . /go/src/github.com/dring1/gopheringdj

RUN go get github.com/tools/godep

RUN godep restore

RUN go install

EXPOSE 9015

ENTRYPOINT ["/go/bin/gopheringdj"]