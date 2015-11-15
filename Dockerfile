FROM golang

# RUN git clone https://<REPLACE ME>@github.com/dring1/gopheringdj.git /go/src/github.com/dring/gopheringdj

WORKDIR /go/src/github.com/dring1/gopheringdj

ADD . /go/src/github.com/dring1/gopheringdj

RUN go get github.com/tools/godep

RUN godep restore

RUN go install

ENV PORT 9015

EXPOSE $PORT

ENTRYPOINT ["/go/bin/gopheringdj"]