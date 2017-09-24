const express = require('express'); const bodyParser = require('body-parser'); const fs = require('fs'); const querystring = require('querystring');

const formatGraph = require(__dirname+'/test.js'); 

const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(__dirname+'/test.db', (err) => {
    if (err) {
        return console.err(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});

const app = require('express')(); const server = require('http').createServer(app); const io = require('socket.io')(server);

const hostname = "127.0.0.2"; const port = 3000;
	
const http = require('http').Server(app);
//setup of the super basics
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
	app.use(express.static(__dirname));
	res.render(__dirname + '/pages/pageMain/main.ejs');
});

app.get('/datatable', function(req, res) {
    app.use(express.static(__dirname));
    res.render(__dirname + '/pages/datatable/main.ejs');
});

app.get('/whoami', function(req, res) {
    app.use(express.static(__dirname));
    res.render(__dirname + '/pages/whoami/main.ejs');
});

formatGraph.formatList();

fs.watch(__dirname + '/list.txt', {encoding: 'utf8'}, function(eventType, filename) {
	if (eventType === 'change') {
		console.log('list.txt was changed');
		formatList();
		
	} 
});

function repeatRead() {
	fs.readFile(__dirname + '/data.json', 'utf8', function(err, data) {
		socket.emit('data', data);
	})
}

fs.watch(__dirname +'/changes.json', function(eventType, filename) {
	// weird things happen is list.txt has a empty newLine
	if (eventType === 'change') {
		fs.readFile(__dirname + '/changes.json', 'utf8', function(err, fdata) {
			io.emit('data', fdata);
			var fdata = JSON.parse(fdata);
			fs.readFile(__dirname + '/data.json', 'utf8', function(err, data) {
				if (data.length === 0) {
					data = new Object; data.nodes = []; data.edges = [];
					data = JSON.stringify(data);
				}

				var data = JSON.parse(data);
				var cdata = new Object; cdata.nodes = []; cdata.edges = [];
				cdata.nodes = fdata.nodes.concat(data.nodes);
				cdata.edges = fdata.edges.concat(data.edges);
				cdata = JSON.stringify(cdata);
				fs.writeFile(__dirname + '/data.json', cdata, 'utf8', function(err) {
					if (err) {
						return console.log(err);
					}
				});
			})

		});
	}
});
	//Note: everytime the server restarts the connection request is thrown to the page (again)
io.on('connection', function(socket) {
	if (fs.existsSync('list.txt')) {
    	io.emit('fileFound');
    }
    fs.readFile(__dirname + '/data.json', 'utf8', function(err, data) {
	    	if (data.length === 0) {
				//data.json file is empty
				console.log('data.json is empty')
	    	} else {
	    		socket.emit('data', data);
	    	}
	    //for now changing this watch to test.json -- It should be list.txt
		console.log('a user connected'); 
		socket.on('disconnect', function() {
			console.log('user disconnected');
		});
	});
});

server.listen(port, hostname, () => {
	console.log(`I need coffee, probably not on http://${hostname}:${port}, but check anyways...`);
});

