var express = require('express');
var app = express();

var fs = require('fs');
const port = process.env.PORT|| 3000;
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded(
	{extended: true}
	));
app.use('/',express.static('public'));

var jsonfile = require('jsonfile');
app.use(function (req, res, next) {
    "use strict";
    // https://www.w3.org/TR/cors/#access-control-allow-origin-response-header
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//app.use(express.static(path.join(__dirname, 'public')));

// 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
app.get('/listBooks', 
	function(req,res) {
		fs.readFile(	__dirname+'/'+'book.json', 
				'utf8',
				function(err,data) {
					if(!err) {
						res.end(data);
					} else {
						res.end(err);
					}
				}
		);	
	} 
);
app.get('/books', 
	function(req,res) {
		fs.readFile(	__dirname+'/'+'books.html', 
				'utf8',
				function(err,data) {
					if(!err) {
						res.end(data);
					} else {
						res.end(err);
					}
				}
		);	
	} 
);

app.get('/', function(req, res){
	fs.readFile(__dirname+"/"+"index.html",'utf8', function (err,data){
		res.end(data);
	})
}
);

app.post('/advancedSearch', function (req,res){
	var name =req.body.name; //name is the name if input tag from form
	"use strict";
	var filePath = __dirname +"/"+ "book.json";
	console.log (filePath);
	//check 
	var returnValue;
	var i;
	var array = [];
	var found = false;
		if (name.length === 0) {
			returnValue = { "HttpStatus" : "400", 
							"message": " 400 : You enter empty search"
						};
			res.writeHead(Number(returnValue.HttpStatus), { 'Content-Type': 'text/plain' });
			res.end(returnValue.message);
		} else {
				jsonfile.readFile(filePath, function (err, object){
				array = object;
				for ( i = 0; i < array.length; i++){
					if (array[i].name == name || array[i].author == name || array[i].topic == name ) {
						found = true; 
						returnValue = {
							"HttpStatus" : "200",
							"message" : " ok to see data",
							"data" : {
								"id" : array[i].id, 
								"name": array[i].name, 
								"img" : array[i].img,
								"author" : array[i].author,
								"pages" : array[i].pages, 
								"price" : array[i].price,
								"topic" : array[i].topic
							}

						};

					} 
				} // end for
		if (found){
			app.get('/books', function(req, res){
  				res.send('/id: ' + req.query.id);
				});
			//res.writeHead(Number(returnValue.HttpStatus),{ 'Content-Type': 'text/plain' });
			//res.end(JSON.stringify(returnValue.data));
			//res.send('http://localhost:3000/books.html#/books/'+array[i].id);
		} else {
			
            returnValue = { "HttpStatus" : "404", 
							"message": " 404 not found "
						};
			res.writeHead(Number(returnValue.HttpStatus), { 'Content-Type': 'text/plain' });
			res.end(returnValue.message);
			
				   }
        });
    }
});





var server = app.listen(port, function() {
	 console.log("Example app listening at http://localhost:"+ port);
} 
);
