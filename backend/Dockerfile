FROM golang:1.21-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /usr/local/bin/backend ./main.go

FROM alpine:3.18
WORKDIR /app
COPY --from=builder /usr/local/bin/backend /usr/local/bin/backend
COPY . .
EXPOSE 8080
CMD ["/usr/local/bin/backend"]
