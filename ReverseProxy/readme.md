## Before Building
check that the url in /src/config.json is correkt


## How to make changes
```
sudo docker cp nginx-base:/etc/nginx/conf.d/default.conf /home/alex/Programming/AmazonReleaseDateTrackerAll/ReverseProxy/default.conf
Make changes
sudo docker cp /home/alex/Programming/AmazonReleaseDateTrackerAll/ReverseProxy/default.conf nginx-base:/etc/nginx/conf.d/
```
Apply Configuration:
```
sudo docker exec nginx-base nginx -t
sudo docker exec nginx-base nginx -s reload
```

From Dockerfile:
```
sudo docker build -t nginx-reverse-proxy .
```

Start:
```
docker start nginx-reverse-proxy
```
