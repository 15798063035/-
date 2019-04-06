const fs = require('fs')
module.exports = function (app) {
	app.get('/',function(req,res){
		fs.readFile('./database/menu.json',function(err,data){
			let menu = JSON.parse(data);
			res.render('index.html',{menu});
		});
	});

	app.use('/article', require('./article'));
	app.use('/menu', require('./menu'));
	app.use('/word', require('./word'))
	// 404 page
	app.use(function (req, res) {
	  res.render('404.html')
	});
}  