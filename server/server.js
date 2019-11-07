'use strict';
const mongoose = require('mongoose');
const session = require('express-session');
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const dbConfig = require('./config');

const app = express();

// needed to make all requests from client work with this server.
app.use(cors({origin: true, credentials: true}));
app.options("*", cors({
    origin: true,
    credentials: true
}));

// WebSocket server, to give socket-handlers access to the session.
const sessionParser = session({
    saveUninitialized: true,
    secret: 'DFJadslkfjgkf$%dfgjlsdg',
    resave: true
});
app.use(sessionParser);

// Create HTTP server by ourselves, in order to attach websocket server.
const httpServer = http.createServer(app);

// Create the Web socket server.
const websocketServer = new WebSocket.Server({noServer: true});

// Require all RESTFULL API Routes
app.use('/api', require('./routes/api-routes'));

httpServer.on('upgrade', (req, networkSocket, head) => {
    sessionParser(req, {}, () => {
        websocketServer.handleUpgrade(req, networkSocket, head, newWebSocket => {
            websocketServer.emit('connection', newWebSocket, req);
        });
    });
});

var totalPlayers = 0;
var players = {};
websocketServer.on('connection', (socket, req) => {
    const gameRoom = req.session.gameRoomName;
    const quizMaster = req.session.quizMaster;
    const scoreBoard = req.session.scoreBoard;
    const teamName = req.session.teamName;

    totalPlayers = totalPlayers + 1;
    socket.id = totalPlayers;

    //Als er een session is met een gameRoomName zet je de gameRoomName in de socket
    if (gameRoom) {
        players[socket.id] = socket;
        players[socket.id].gameRoomName = gameRoom;
        players[socket.id].teamName = teamName;

        //als diegene de quizmaster is, krijgt hij dat ook in zijn socket
        if (quizMaster) {
            players[socket.id].quizMaster = true;
        }

        //als diegene de scoreboard is, krijgt hij dat ook in zijn socket
        if (scoreBoard) {
            players[socket.id].scoreBoard = true;
        }
    }

    socket.on('message', (message) => {
        req.session.reload((err) => {

            //convert json message to a javascript object
            const data = JSON.parse(message);

            if (err) throw err;

            /*====================================
            | TO: QuizMaster & ScoreBoard
            | Send NEW TEAM msg
            */
            if (data.messageType === 'NEW TEAM') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].quizMaster && players[key].gameRoomName === gameRoom || players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "NEW TEAM",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: Specific Team
            | Send TEAM ACCEPTED msg
            */
            if (data.messageType === 'TEAM ACCEPTED') {
                let data = JSON.parse(message);
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (!players[key].quizMaster && players[key].gameRoomName === gameRoom && players[key].teamName === data.teamName) {
                            players[key].send(JSON.stringify({
                                messageType: "TEAM ACCEPTED",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: Specific Team & ScoreBoard
            | Send TEAM DELETED msg
            */
            if (data.messageType === 'TEAM DELETED') {
                let data = JSON.parse(message);
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (!players[key].quizMaster && players[key].gameRoomName === gameRoom && players[key].teamName === data.teamName || players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "TEAM DELETED",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: All teams in a gameRoom AND QuizMaster
            | Send message that the QuizMaster is choosing categories
            */
            if (data.messageType === 'CHOOSE CATEGORIES') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "CHOOSE CATEGORIES",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: All teams in a gameRoom, QuizMaster AND scoreboard
            | Send message that the QuizMaster is choosing a question
            */
            if (data.messageType === 'CHOOSE QUESTION') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "CHOOSE QUESTION",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: All teams in a gameRoom, QuizMaster AND ScoreBoard
            | Send message that the QuizMaster is asking a question
            */
            if (data.messageType === 'ASKING QUESTION') {
                let data = JSON.parse(message);
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].gameRoomName === gameRoom || players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "ASKING QUESTION",
                                question: data.question,
                                category: data.category
                            }));
                        }
                    }
                }

                //For QuizMaster & ScoreBoard
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if ((players[key].quizMaster || players[key].scoreBoard) && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "CORRECT QUESTION ANSWER",
                                answer: data.answer
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: QuizMaster
            | Send GET QUESTION ANSWERS msg
            */
            if (data.messageType === 'GET QUESTION ANSWERS') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].quizMaster && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "GET QUESTION ANSWERS",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: ScoreBoard
            | Send SCOREBOARD TEAM ANSWERED msg
            */
            if (data.messageType === 'SCOREBOARD TEAM ANSWERED') {
                for (var key in players) {
                    let data = JSON.parse(message);

                    if (players.hasOwnProperty(key)) {
                        if (players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "SCOREBOARD TEAM ANSWERED",
                                teamName: data.teamName,
                                scoreBoardData: [{
                                    teamName: data.teamName,
                                }]
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: ScoreBoard
            | Send SCOREBOARD TEAM ANSWERED msg
            */
            if (data.messageType === 'SEND ANSWERS TO SCOREBOARD') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "SEND ANSWERS TO SCOREBOARD",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: All teams in a gameRoom, QuizMaster AND ScoreBoard
            | Send message that the QuizMaster has closed the current question
            */
            if (data.messageType === 'QUESTION CLOSED') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].gameRoomName === gameRoom || players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "QUESTION CLOSED",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: All teams in a gameRoom, QuizMaster AND ScoreBoard
            | Send message that the QuizMaster has closed the current question
            */
            if (data.messageType === 'END ROUND') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if (players[key].gameRoomName === gameRoom || players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "END ROUND",
                            }));
                        }
                    }
                }
            }

            /*====================================
            | TO: All teams in a gameRoom, QuizMaster AND ScoreBoard
            | Send message that the QuizMaster has ended the game
            */
            if (data.messageType === 'END GAME') {
                for (var key in players) {
                    if (players.hasOwnProperty(key)) {
                        if ((players[key].gameRoomName === gameRoom || players[key].scoreBoard) && players[key].gameRoomName === gameRoom) {
                            players[key].send(JSON.stringify({
                                messageType: "END GAME",
                            }));
                        }
                    }
                }
            }
            req.session.save()
        })
    });

    socket.on('close', function close() {
        if (quizMaster) {
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    if (!players[key].scoreBoard && players[key].gameRoomName === gameRoom) {
                        players[key].send(JSON.stringify({
                            messageType: "QUIZ MASTER LEFT GAME",
                        }));
                    }
                }
            }
        }

        console.log('Player disconnected');
    });
});

// Start the server.
const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    mongoose.connect(`mongodb://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log(`game server started on port http://localhost:${port}`);
    });
});
