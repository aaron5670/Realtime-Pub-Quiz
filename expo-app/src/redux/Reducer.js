import {combineReducers} from 'redux';
import {
    CHANGE_SELECTED_TAB_ACTION,
    CHANGE_USER_STATUS_ACTION,
    CHANGE_USERNAME_ACTION,
    CHANGE_USER_ROLE_ACTION,
    GET_RECENT_GAMES
} from "./actionConstants";

export const changeUsernameAction = (username) => ({
    type: CHANGE_USERNAME_ACTION,
    username: username
});

export const changeUserRoleAction = (userRole) => ({
    type: CHANGE_USER_ROLE_ACTION,
    userRole: userRole
});

export const changeUserStatusAction = (userStatus) => ({
    type: CHANGE_USER_STATUS_ACTION,
    userStatus: userStatus
});

export const changeSelectedTabAction = (selectedTab) => ({
    type: CHANGE_SELECTED_TAB_ACTION,
    selectedTab: selectedTab
});

export const changeRecentGamesAction = (recentGames) => ({
    type: GET_RECENT_GAMES,
    data: recentGames
});

const INITIAL_STATE = {
    username: null,
    userRole: null,
    userStatus: null,
    selectedTab: 0,
    recentGames: []
};

const appReducer = (state = INITIAL_STATE, action) => {
    let changes = null;
    switch (action.type) {
        case CHANGE_USERNAME_ACTION:
            changes = {
                username: action.username,
            };
            return {...state, ...changes};

        case CHANGE_USER_ROLE_ACTION:
            changes = {
                userRole: action.userRole,
            };
            return {...state, ...changes};

        case CHANGE_USER_STATUS_ACTION:
            changes = {
                userStatus: action.userStatus,
            };
            return {...state, ...changes};

        case CHANGE_SELECTED_TAB_ACTION:
            changes = {
                selectedTab: action.selectedTab,
            };
            return {...state, ...changes};

        case GET_RECENT_GAMES:
            changes = {
                recentGames: action.recentGames,
            };
            return {...state, ...changes};

        default:
            return state
    }
};

export default combineReducers({
    app: appReducer,
});
