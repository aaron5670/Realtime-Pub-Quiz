import {theStore} from './index'
import {
    createCurrentCategoryAction, createCurrentQuestionAction, createCurrentQuestionAnswerAction,
    getGameRoomTeamsAction,
    increaseGameRoundNumberAction, increaseQuestionNumberAction
} from "./action-reducers/createGame-actionReducer";
import {createTeamNameStatusAction} from "./action-reducers/createTeam-actionReducer"
import {createCurrentGameStatusAction, addTeamQuestionAnswerAction} from "./action-reducers/createGame-actionReducer";
import {
    addTeamQuestionAnswersScoreboardAction,
    createAddCurrentTeamsScoreboardAction, createIsAnsweredScoreboardAction,
} from "./action-reducers/createScorebord-actionReducer";

const port = 3001;
const serverHostname = `${window.location.hostname}:${port}`;
let theSocket;

export function openWebSocket() {
    if (theSocket) {
        theSocket.onerror = null;
        theSocket.onopen = null;
        theSocket.onclose = null;
        theSocket.close();
    }
    theSocket = new WebSocket(`ws://${serverHostname}`);

    // this method is not in the official API, but it's very useful.
    theSocket.sendJSON = function (data) {
        this.send(JSON.stringify(data));
    };

    theSocket.onmessage = function (eventInfo) {
        var message = JSON.parse(eventInfo.data);

        switch (message.messageType) {
            case "NEW TEAM":
                getTeams();
                console.log('NEW TEAM');
                break;

            case "TEAM DELETED":
                getTeams();
                theStore.dispatch(createTeamNameStatusAction('deleted'));
                console.log('TEAM DELETED');
                break;

            case "TEAM ACCEPTED":
                theStore.dispatch(createTeamNameStatusAction('success'));
                console.log('TEAM ACCEPTED');
                break;

            case "CHOOSE CATEGORIES":
                theStore.dispatch(createCurrentGameStatusAction('choose_categories'));
                if (theStore.getState().createGame.roundNumber) {
                    theStore.dispatch(increaseGameRoundNumberAction(theStore.getState().createGame.roundNumber + 1))
                    theStore.dispatch(increaseQuestionNumberAction(0));
                    console.log(theStore.getState().createGame.questionNumber)
                } else {
                    theStore.dispatch(increaseGameRoundNumberAction(1));
                }
                console.log('CHOOSE CATEGORIES');
                break;

            case "CHOOSE QUESTION":
                theStore.dispatch(createCurrentGameStatusAction('choose_question'));
                //Get current teams
                getTeams();
                console.log('CHOOSE QUESTION');
                break;

            case "ASKING QUESTION":
                theStore.dispatch(createCurrentGameStatusAction('asking_question'));
                theStore.dispatch(createCurrentQuestionAction(message.question));
                theStore.dispatch(createCurrentCategoryAction(message.category));

                //Leeg alle eventuel gegeven antwoorden van vorige vragen
                theStore.dispatch(addTeamQuestionAnswerAction([]));
                theStore.dispatch(createIsAnsweredScoreboardAction(null));

                //Get current teams
                getTeams();

                if (theStore.getState().createGame.questionNumber) {
                    theStore.dispatch(increaseQuestionNumberAction((theStore.getState().createGame.questionNumber + 1)));
                } else {
                    theStore.dispatch(increaseQuestionNumberAction(1));
                }

                console.log('ASKING QUESTION');
                break;

            case "CORRECT QUESTION ANSWER":
                theStore.dispatch(createCurrentQuestionAnswerAction(message.answer));
                console.log('CORRECT QUESTION ANSWER');
                break;

            case "GET QUESTION ANSWERS":
                getQuestionAnswers();
                console.log("GET QUESTION ANSWERS");
                break;

            case "SCOREBOARD TEAM ANSWERED":
                console.log("SCOREBOARD TEAM ANSWERED");
                theStore.dispatch(createIsAnsweredScoreboardAction(message.scoreBoardData));
                break;

            case "QUESTION CLOSED":
                getQuestionAnswers();
                theStore.dispatch(createCurrentGameStatusAction('question_closed'));
                console.log("QUESTION CLOSED");
                break;

            case "SEND ANSWERS TO SCOREBOARD":
                getQuestionAnswers();
                console.log("SEND ANSWERS TO SCOREBOARD");
                break;

            case "END ROUND":
                theStore.dispatch(createCurrentGameStatusAction('round_ended'));
                getTeams();
                console.log("END ROUND");
                break;

            case "END GAME":
                theStore.dispatch(createCurrentGameStatusAction('end_game'));
                theStore.dispatch(increaseGameRoundNumberAction(null));
                theStore.dispatch(increaseQuestionNumberAction(null));
                theStore.dispatch(getGameRoomTeamsAction([]));

                console.log("END GAME");
                break;

            case "QUIZ MASTER LEFT GAME":
                theStore.dispatch(createCurrentGameStatusAction('quizmaster_left'));
                console.log("QUIZ MASTER LEFT GAME");
                break;

            default:
                console.log("Unknown messageType:", message);
        }
    };

    return theSocket;
}

/*========================================
| Websocket send NEW TEAM
*/
export function sendNewTeamMSG() {
    theSocket.onopen = function (eventInfo) {
        let message = {
            messageType: "NEW TEAM",
        };

        theSocket.sendJSON(message);
    };
}

/*========================================
| delete Team from a Gameroom (for Quizmaster)
*/
export function deleteTeam(gameRoom, teamName) {
    if (gameRoom && teamName) {
        const url = `http://localhost:3001/api/games/${gameRoom}/team/${teamName}`;

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success) {
                    getTeams().then(r => sendTeamDeletedMSG(teamName));

                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send TEAM DELETED
*/
function sendTeamDeletedMSG(teamName) {
    let message = {
        messageType: "TEAM DELETED",
        teamName: teamName
    };

    theSocket.sendJSON(message);
}

/*========================================
| Get all current teams from a Gameroom (For quizmaster)
*/
function getTeams() {
    const store = theStore.getState();

    let gameRoom; //if storeGameRoom is empty check store gameRoom from scoreboard

    if (store.createGame.gameRoom) {
        gameRoom = store.createGame.gameRoom;
    } else if (store.createScoreboard.gameRoomScoreboard) {
        gameRoom = store.createScoreboard.gameRoomScoreboard
    }

    if (gameRoom) {
        const url = `http://localhost:3001/api/games/${gameRoom}/teams`;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        return fetch(url, options).then(response => {
            if (response.status !== 200) {
                console.log("Er gaat iets fout" + response.status);
            }
            response.json().then(data => {
                if (data.success) {
                    if (store.createGame.gameRoom) {
                        theStore.dispatch(getGameRoomTeamsAction(data.teams));
                    } else if (store.createScoreboard.gameRoomScoreboard) {
                        theStore.dispatch(createAddCurrentTeamsScoreboardAction(data.teams));
                    }
                }
            });
        }).catch(err => {
            console.log(err);
        })
    }
}

/*========================================
| Accept a team in a Gameroom (for Quizmaster)
*/
export function acceptTeam(gameRoom, teamName) {
    if (gameRoom && teamName) {
        const url = `http://localhost:3001/api/games/${gameRoom}/team/${teamName}`;

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success) {
                    getTeams().then(r => sendTeamAcceptMSG(teamName));
                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send TEAM ACCEPT
*/
function sendTeamAcceptMSG(teamName) {
    let message = {
        messageType: "TEAM ACCEPTED",
        teamName: teamName
    };

    theSocket.sendJSON(message);
}

/*========================================
| Starting a NEW game (for Quizmaster)
*/
export function startGame(gameRoom) {
    if (gameRoom) {
        const url = `http://localhost:3001/api/games/${gameRoom}`;

        let data = {
            gameStatus: 'choose_category'
        };
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success && data.gameStatus === 'choose_category') {
                    sendChooseCategoriesMSG()
                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send TEAM ACCEPT
*/
function sendChooseCategoriesMSG() {
    let message = {
        messageType: "CHOOSE CATEGORIES",
    };

    theSocket.sendJSON(message);
}

/*========================================
| Starting a NEW round (for Quizmaster)
*/
export function startRound(gameRoom, categories) {
    if (gameRoom) {

        const url = `http://localhost:3001/api/games/${gameRoom}/ronde`;

        let options;
        if (categories) {
            let data = {
                roundCategories: categories
            };
            options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            };
        } else {
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            };
        }

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success) {
                    if (data.chooseCategories) {
                        sendChooseCategoriesMSG();
                    } else {
                        sendChooseQuestionsMSG();
                    }
                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send CHOOSE QUESTION
*/
function sendChooseQuestionsMSG() {
    let message = {
        messageType: "CHOOSE QUESTION",
    };

    theSocket.sendJSON(message);
}

/*========================================
| Starting a NEW question (for Quizmaster)
*/
export function startQuestion(gameRoom, rondeID, question) {
    if (gameRoom) {
        const url = `http://localhost:3001/api/game/${gameRoom}/ronde/${rondeID}/question`;

        let options;
        if (question) {
            let data = {
                question: question
            };
            options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            };
        } else {
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            };
        }

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success && data.show_questions && data.round_ended === false) {
                    sendChooseQuestionsMSG();
                } else if (data.success && data.show_questions === false && data.round_ended === false) {
                    sendAskingQuestionsMSG(data.question, data.category, data.answer);
                } else if (data.success && data.round_ended === true) {
                    sendRoundEndMSG();
                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send ASKING QUESTION
*/
function sendAskingQuestionsMSG(question, category, answer) {
    let message = {
        messageType: "ASKING QUESTION",
        question: question,
        category: category,
        answer: answer
    };

    theSocket.sendJSON(message);
}

/*========================================
| Websocket send END ROUND
*/
function sendRoundEndMSG() {
    let message = {
        messageType: "END ROUND",
    };

    theSocket.sendJSON(message);
}

/*========================================
| Get all answers from a question (for Quizmaster)
*/
export function getQuestionAnswers() {
    const store = theStore.getState();

    let gameRoom = store.createGame.gameRoom;
    const roundNumber = store.createGame.roundNumber;
    const question = store.createGame.questionNumber;

    if (gameRoom === null) {
        gameRoom = store.createScoreboard.gameRoomScoreboard;
    }

    if (gameRoom && roundNumber && question) {

        const url = `http://localhost:3001/api/game/${gameRoom}/ronde/${roundNumber}/question/${question}/answers`;
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success) {
                    theStore.dispatch(addTeamQuestionAnswersScoreboardAction(data.answers));
                    theStore.dispatch(addTeamQuestionAnswerAction(data.answers));
                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send GET QUESTION ANSWERS
*/
export function sendGetQuestionAnswersMSG() {
    let message = {
        messageType: "GET QUESTION ANSWERS",
    };

    theSocket.sendJSON(message);
}

/*========================================
| Websocket send SCOREBOARD TEAM ANSWERED
*/
export function sendGetTeamIsAnsweredMSG(teamName, isAnswered) {
    let message = {
        messageType: "SCOREBOARD TEAM ANSWERED",
        teamName: teamName,
        isAnswered: isAnswered,
    };

    theSocket.sendJSON(message);
}

/*========================================
| Change a team answer to correct or incorrect (for Quizmaster)
*/
export function teamAnswerIsCorrect(gameRoomName, roundNumber, questionNumber, teamName, isCorrect) {
    const url = `http://localhost:3001/api/game/${gameRoomName}/ronde/${roundNumber}/question/${questionNumber}/team/${teamName}/answer`;

    let data = {
        isCorrect: isCorrect
    };
    const options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
                if (data.success === true) {
                    theStore.dispatch(addTeamQuestionAnswerAction(data.answers));
                    sendSendAnswersToScoreboardMSG();
                }
            }
        ).catch(err => console.log(err));
}

/*========================================
| Websocket send SEND ANSWERS TO SCOREBOARD
*/
export function sendSendAnswersToScoreboardMSG() {
    let message = {
        messageType: "SEND ANSWERS TO SCOREBOARD",
    };

    theSocket.sendJSON(message);
}

/*========================================
| Change game status to QUESTION CLOSED
*/
export function closeCurrentQuestion(gameRoomName, roundNumber) {
    const url = `http://localhost:3001/api/game/${gameRoomName}/ronde/${roundNumber}/question`;

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        mode: 'cors'
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
                if (data.success === true) {
                    sendQuestionClosedMSG();
                    sendGetQuestionAnswersMSG();
                }
            }
        ).catch(err => console.log(err));
}

/*========================================
| Websocket send QUESTION CLOSED
*/
function sendQuestionClosedMSG() {
    let message = {
        messageType: "QUESTION CLOSED",
    };

    theSocket.sendJSON(message);
}

/*========================================
| Starting a NEW game (for EndGame)
*/
export function endGame(gameRoom) {
    if (gameRoom) {
        const url = `http://localhost:3001/api/games/${gameRoom}`;

        let data = {
            gameStatus: 'end_game'
        };
        const options = {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };

        return fetch(url, options).then(response => {
            if (response.status !== 200) console.log("Er gaat iets fout" + response.status);
            response.json().then(data => {
                if (data.success && data.gameStatus === 'end_game') {
                    sendEndGameMSG()
                }
            });
        }).catch(err => console.log(err))
    }
}

/*========================================
| Websocket send END GAME
*/
function sendEndGameMSG() {
    let message = {
        messageType: "END GAME",
    };

    theSocket.sendJSON(message);
}
