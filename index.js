var http = require('http')
var ws = require('nodejs-websocket')
var fs = require('fs')

http.createServer(function (req, res) {
	fs.createReadStream('index.html').pipe(res)
}).listen(8080)

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on('text', function(str) {
		if (connection.nickname === null) {
			connection.nickname = str
			broadcast(str + ' connected')
		} else {
			var data = JSON.parse(str)
			data.nickname = connection.nickname
			console.log(data)
			broadcast(JSON.stringify(data), connection.nickname)
			//broadcast("["+connection.nickname+"] "+str)
		}
	})
	connection.on('close', function () {
		broadcast(connection.nickname + ' left')
	})
})
server.listen(8081)

function broadcast(str, id) {
	server.connections.filter(function(connection) {
		return connection.nickname != id
	}).forEach(function (connection) {
		connection.sendText(str)
	})
}
