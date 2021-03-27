const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


io.on('connection', (socket) => {  
    console.log("A socket joined");
    
});

io.on('connection', () => { /* … */ });

app.use(express.static("assets"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/assets/index.html");
})



server.listen(8080);