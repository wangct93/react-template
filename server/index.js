

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const config = require('./config/server');
const app = express();
const resolve = (...paths) => path.resolve(process.cwd(),...paths);
const {port = 8000,assets = []} = config;

assets.forEach(item => {
  app.use('/assets',express.static(resolve(item)));
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret:'wangct',
  name:'ssid',
  cookie:{},
  resave:false,
  saveUninitialized:true
}));
app.use((req,res,next) => {
  console.log('请求地址：' + req.url);
  next();
});

app.listen(port,'0.0.0.0',() => {
    console.log(`the server is started on port ${port}!`);
});

const routerList = fs.readdirSync('server/router');
routerList.forEach(routerName => {
  const router = require('./router/' + routerName);
  const pathName = router.pathName || path.basename(routerName,path.extname(routerName));
  app.use('/' + pathName,router);
});

app.use((req,res) => {
  res.sendFile(resolve('dist/index.html'));
});
