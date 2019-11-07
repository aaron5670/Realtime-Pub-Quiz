//=====================================================================
//    State management for the scorebord
//---------------------------------------------------------------------

// Action Creators:
export function createScorebordStatusAction(formValidationScoreboard) {
    return {
        type: "createScorebordStatusAction",
        formValidationScoreboard: formValidationScoreboard
    };
}

export function createAddCurrentTeamsScoreboardAction(currentTeamsScoreboard) {
    return {
        type: "createAddCurrentTeamsScoreboardAction",
        currentTeamsScoreboard: currentTeamsScoreboard
    };
}

export function getGameRoomTeamsScoreboardAction(gameRoomScoreboard) {
    return {
        type: "getGameRoomTeamsScoreboardAction",
        gameRoomScoreboard: gameRoomScoreboard
    };
}

export function createIsAnsweredScoreboardAction(isAnswered) {
    return {
        type: "createIsAnsweredScoreboardAction",
        isAnswered: isAnswered
    };
}

export function addTeamQuestionAnswersScoreboardAction(teamAnswers) {
    return {
        type: "addTeamQuestionAnswersScoreboardAction",
        teamAnswers: teamAnswers
    };
}

// Reducer:
const initialCreateScorebordState = {
    formValidationScoreboard: false,
    currentTeamsScoreboard: [],
    gameRoomScoreboard: null,
    isAnswered: [],
    teamAnswers: []
};

export function createScorebordReducer(state = initialCreateScorebordState, action) {
    let changes = null;
    switch (action.type) {
        case 'createScorebordStatusAction':
            changes = {
                formValidationScoreboard: action.formValidationScoreboard,
            };
            return {...state, ...changes};

        case 'createAddCurrentTeamsScoreboardAction':
            changes = {
                currentTeamsScoreboard: action.currentTeamsScoreboard,
            };
            return {...state, ...changes};

        case 'getGameRoomTeamsScoreboardAction':
            changes = {
                gameRoomScoreboard: action.gameRoomScoreboard,
            };
            return {...state, ...changes};

        case 'createIsAnsweredScoreboardAction':
            if (action.isAnswered !== null) {
                changes = {
                    isAnswered: [...state.isAnswered, ...action.isAnswered],
                };
            } else {
                changes = {
                    isAnswered: [],
                };
            }
            return {...state, ...changes};

        case 'addTeamQuestionAnswersScoreboardAction':
            changes = {
                teamAnswers: action.teamAnswers,
            };
            return {...state, ...changes};

        default:
            return state;
    }
}
