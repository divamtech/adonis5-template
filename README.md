# webledger-books-server

```sh
docker build . -t wl-books:1.0 --no-cache

dr run -itd --env-file .env -e APP_TYPE=server -p 3333:3333 -p 9999:9999 --name server wl-books:1.0
dr run -itd --env-file .env -e APP_TYPE=worker -p 4444:3333  -p 10000:9999 --name worker wl-books:1.0
```

## Setup

```sh
npm i
npm run db:setup
docker-compose up -d
```

For down the docker services

```sh
docker-compose down
```

## Run

`npm run dev` or `npm run debug`



### Environment:

- Production: https://books-dash.webledger.in
- Staging: https://books-dash-staging.webledger.in
- Development: https://books-dash-dev.webledger.in

```
server_host: https://books-dash.webledger.in
auth_token: <token>
business_id: 1
```

### default user:

```json
{
  "email": "default@example.com",
  "password": "qwerty"
}
```


## Infra v0.1

https://app.diagrams.net/#G1Hit3IcxXlaKigmxZyg-r5PJ26uTL7umO

## - File upload params:

```
  {
    user_profile: { types: ['png', 'jpeg', 'jpg'], publicRead: true },
    business_documents: { types: ['png', 'jpeg', 'jpg', 'pdf'], publicRead: false },
    business_images: { types: ['png', 'jpeg', 'jpg'], publicRead: true }
  }
```
