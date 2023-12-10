
## How to make changes
```
sudo docker cp nginx-base:/etc/nginx/conf.d/default.conf /home/alexeineder/Programming/GitProjects/AmazonReleaseDateTracker/Server/default.conf
Make changes
sudo docker cp /home/alexeineder/Programming/GitProjects/AmazonReleaseDateTracker/Server/default.conf nginx-base:/etc/nginx/conf.d/
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
