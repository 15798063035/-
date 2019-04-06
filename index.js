const express = require('express');
const router = require('./router');
const bodyParser = require('body-parser');

const app = express();

// 引入模板引擎 art-template
app.engine('html', require('express-art-template'));

// 开放静态资源
app.use('/public/',express.static('./public/'));

// 配置 body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 挂在路由
router(app);

// 监听端口
app.listen('3000',function(){
	console.log('running 3000');
})