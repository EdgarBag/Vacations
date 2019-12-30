const express = require("express");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const dataOfFollowers = require("./controllers/followers-controller");
const cors = require("cors");
const server = express();
const http = require('http');
const socketIO = require('socket.io');
const userLog = require('./bll/users-logic');
const vacLog = require('./bll/vacation-logic');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({
    dest: __dirname + "\\assets\\images"
});


server.use(cors());
server.use(express.json());

server.use("/api/users", usersController);
server.use("/api/vacations", vacationsController);
server.use("/api/followers", dataOfFollowers);

const httpServer = http.createServer(server).listen(3001, () => console.log('socketing....'));
const socketServer = socketIO.listen(httpServer);
const allSockets = [];

server.use(express.static(__dirname));

socketServer.sockets.on('connection', async socket => {
    allSockets.push(socket);
    socket.on('user-availability-check', async user => {
        let isAvailable = '';
        isAvailable = await userLog.getOneUser(user);
        socketServer.sockets.emit('user-availability-check', isAvailable < 1 ? false : true);
    });

    socket.on('admin-made-changes', async () => {
        socketServer.sockets.emit('admin-made-changes', await vacLog.getAllVacations());
    });



    socket.on('disconnect', () => {
        allSockets.splice(allSockets.indexOf(socket), 1);
    })

});


server.listen(3002, () => console.log("listenning to 3002 for upload file...."));