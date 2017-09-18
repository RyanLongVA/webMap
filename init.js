var express = require('express'); var bodyParser = require('body-parser'); var fs = require('fs'); var querystring = require('querystring');

var app = require('express')(); var server = require('http').createServer(app); var io = require('socket.io')(server);

var hostname = "127.0.0.2"; var port = 3000;
	
var http = require('http').Server(app);
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

function formatList() {
	//initializing fdata 
 	var fdata = new Object; fdata.nodes = new Object; fdata.edges = new Object; fdata.nodes = []; fdata.edges = [];
	fs.readFile(__dirname + '/list.txt', 'utf8', function(err, data) {
		if (err) {
			console.log('Error reading2 list.txt, while formatting...')
		}
		else {
			function writeChange(data) {
				fs.writeFile(__dirname + '/changes.json', data, 'utf8', function(err) {
					if (err) { 
						return console.log(err);
					}
					console.log("--changes.json was saved--");
				});
			}

			function removeSpace(array) {
			//directly effects array when called
			cleanArray = array;
				for (var a = 0; array.length > a; a++) {
					if (array[a].length === 0) {
						cleanArray.splice(a, 1);
					}
				}
				return cleanArray;
			}
			function httpsTest(array) {
				var https = true;
				array.forEach(function(item) {
					if (!(item.startsWith("https://"))) {
						https = false;
					}
				})
				return https; 
			}

			function httpTest(array) {
				var http = true;
				array.forEach(function(item) {
					if (!(item.startsWith("http://"))) {
						http = false;
					}
				})
				return http;
			}

			function removeProtocol(array) {
				if (httpsTest(array)) {
					array.forEach(function(url, index) {
						array[index] = url.replace('https://', '');
						return url;
					}) 
					console.log('https:// removed');
				} else if (httpTest(array)) {
					array.forEach(function(url, index) {
						array[index] = url.replace('http://', '');
						return url;
					})
					console.log('http:// removed');
				}
				else if ((httpTest(array) === false) && ((httpTest(array) == false))) { 
					console.log('It seems the protocol is inconsistent');
				}
				return array;
			}

			function returnLabel(string) {
				var array = string.split('/');
				for (var a = 0; array.length > a; a++) {
						if (array[a].length === 0) {
							array.splice(a, 1);
							a += -1
						}
					}
				return array[array.length-1];;
			}

			function arrayUniqueEdge(array) {
		    	var a = array.concat();
		    	for(var i=0; i<a.length; ++i) {
		        	for(var j=i+1; j<a.length; ++j) {
		            	if(a[i].to === a[j].to && a[i].to === a[j].from)
		                	a.splice(j--, 1);
		        	}
			    }
			    return a;
			}

			function arrayUniqueNode(array) {
			    var a = array.concat();
			    for(var i=0; i<a.length; ++i) {
			        for(var j=i+1; j<a.length; ++j) {
			            if(a[i].id === a[j].id)
			                a.splice(j--, 1);
			        }
			    }
			    return a;
			}

			function objectCreator(array) {
				var rendered = fs.readFileSync(__dirname + '/data.json', 'utf8', function(err, data) {
					if (err) {
						console.log('something with wrong with reading data.json');
					}	
					else {
						rendered = data
						//pretty sure this should be return statement of data but :shrug: worked so far
						
					}
						
				});
				if (rendered.length === 0) {
					console.log('data.json is empty')
						var rendered = new Object; rendered.nodes = []; rendered.edges = [];
				} else {
					rendered = JSON.parse(rendered);
				}
				for (var i=0; i < array.length; i++) {
					function checkNode(location) {
						var dup = false;
						for (var x = 0; rendered.nodes.length > x; x++) {
							if (rendered.nodes[x].id === location) {
								dup = true;
							}
						}
						for (var x = 0; fdata.nodes.length > x; x++) {
							if (fdata.nodes[x].id === location) {
								dup = true;
							}
						} 	
						return dup; 
					}
					function nodeParExists() {
						fdata.nodes.push(Object.create(fdata, {'id': {value: cID, enumerable: true}, 'label': {value: cLabel, enumerable:true}}));
						fdata.edges.push(Object.create(fdata, {'from': {value: pID, enumerable:true}, 'to': {value: cID, enumerable: true}}));
					}
					function customParentNode(url) {
						//this was some shady scripting... something may need to change
						var maxCounter = url.split('/');
						maxCounter = maxCounter.length;
						var ogUrl = url.split('/');
						for (var counter = 0; maxCounter > counter; counter++) {
							ogUrl.splice(ogUrl.length-1); 
							ogUrl = ogUrl.join('/'); 
							var lf = ogUrl;
							if (maxCounter === counter) {
								//max count
								return ogUrl;
							} else if (!(checkNode(lf))) {
								//node still doesn't exist
								ogUrl = ogUrl.split('/');
							} else {
								//it's assumed --- node exists
								ogUrl = ogUrl.split('/');
								break;
							}
						}
						var start = ogUrl.join('/'); start = (start.split('/').length-1);
						var end = url.split('/');
						for (; end.length > start; start++) {	
							var cArray = url.split('/');
							if (cArray.length === 1) {

								break;
							}
							cArray.splice(start+1);
							var cLabel = cArray[cArray.length-1];
							var cNodeID = cArray.join('/');

							if (cNodeID.split('/').length === 1) {
								console.log('-163- found a nonexistent domain');
								fdata.nodes.push(Object.create(fdata, {'id': {value: cNodeID, enumerable: true}, 'label': {value: cLabel, enumerable:true}}));
							} else {
								cArray.splice(start);
								var pNodeID = cArray.join('/');
								fdata.nodes.push(Object.create(fdata, {'id': {value: cNodeID, enumerable: true}, 'label': {value: cLabel, enumerable:true}}));
								fdata.edges.push(Object.create(fdata, {'from': {value: pNodeID, enumerable:true}, 'to': {value: cNodeID, enumerable: true}}));
							}
						}
					}

				
					function foundDomain() {
						console.log('--Domain Found in the provided list--');
						if (checkNode(cID)) {
							console.log('--Domain provided is in the data.json');
							//first node already exists
						}
						else {
							fdata.nodes.push(Object.create(fdata, { 'id': {value: cID, enumerable: true}, 'label': {value: returnLabel(array[i]), enumerable: true} }));
						}
					}
					 	
					var cID = array[i];
					var cLabel = cID.split('/'); cLabel = cLabel[cLabel.length-1];
					var pID = array[i].split('/'); pID.splice(pID.length-1); pID = pID.join('/');
					var pLabel = pID.split('/'); pLabel = pLabel[pLabel.length-1];
					var cLength = array[i].split('/');
					if (cLength.length === 1) {
						foundDomain();
						console.log('found a length of 1');	
					} else if (checkNode(cID)){
						//already exists
					} else if (checkNode(pID)) {
						nodeParExists();
					} else {
						//find where the last parent node exists, and work back up
						customParentNode(cID);				
					}


					//Really just a double check... when files starts switching around it gets sort of crazy
					
				
				}

				fdata.nodes = arrayUniqueNode(fdata.nodes);
				fdata.edges = arrayUniqueEdge(fdata.edges);
				fdata = JSON.stringify(fdata);
			}
			var list = data
			//split by newline
			list = list.split('\n'); removeSpace(list);
			var flist = list.filter(function(elem, pos) { return list.indexOf(elem) == pos; });
			flist = removeProtocol(flist);
			flist.forEach(function(currentValue, index) {
				if (currentValue.endsWith('/')) {
					flist[index] = currentValue.substring(0, currentValue.length - 1);
				}
			});
			objectCreator(flist);
			writeChange(fdata);
		}
	});
}
formatList();

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

