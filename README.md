# reddit-hack

Small util for deleting old reddit comments. Not really useful.

If you want to use it...

Create .env.json file with:

```
{
  "username": ...,
  "password": ...,
  "clientId": ...,
  "clientSecret": ...
}
```

_Can get client id and secret here: https://www.reddit.com/prefs/apps_

Install, build, run:

```
$ npm install
$ npm run build
$ node ./dist/indexjs
```

_Note: edit `src/should-delete.ts` to desired logic_
