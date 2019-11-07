//=====================================================================
//    State management for the createTeam
//---------------------------------------------------------------------

// Action creators:
export function createGameRoomStatusAction(status) {
    return {
        type: "createGameRoomStatusAction",
        status: status
    };
}

export function createTeamNameStatusAction(status) {
    return {
        type: "createTeamNameStatusAction",
        status: status
    };
}

export function getTeamNameAction(getTeamName) {
    return {
        type: "getTeamNameAction",
        getTeamName: getTeamName
    };
}

export function getGameNameAction(getGameName) {
    return {
        type: "getGameNameAction",
        getGameName: getGameName
    };
}



// Reducer:
const initialCreateTeamState = {
    gameRoomAccepted: null,
    teamNameStatus: false,
    teamRoomName: null,
    gameRoomName: null
};

export function createTeamReducer(state = initialCreateTeamState, action) {
    let changes = null;
    switch (action.type) {
        case 'createGameRoomStatusAction':
            changes = {
                gameRoomAccepted: action.status,
            };
            return {...state, ...changes};

        case 'createTeamNameStatusAction':
            changes = {
                teamNameStatus: action.status,
            };
            return {...state, ...changes};

        case 'getTeamNameAction':
            changes = {
                teamRoomName: action.getTeamName,
            };
            return {...state, ...changes};

        case 'getGameNameAction':
            changes = {
                gameRoomName: action.getGameName,
            };
            return {...state, ...changes};

        default:
            return state;
    }
}
