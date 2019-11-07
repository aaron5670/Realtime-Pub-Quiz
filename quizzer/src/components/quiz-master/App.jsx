import React from "react";
import * as ReactRedux from "react-redux";
import {QuizzMasterCategorieen} from "./QuizzMasterCategorieen";
import {QuizzMasterVragen} from "./QuizzMasterVragen";
import {QuizzMasterVragenBeheren} from "./QuizzMasterVragenBeheren";
import {QuizzMasterGameAanmaken} from "./QuizzMasterGameAanmaken";
import {QuizzMasterTeamsBeheren} from "./QuizzMasterTeamsBeheren";
import {QuizzMasterEindRonde} from "./QuizzMasterEindRonde";

class QuizMasterAppUI extends React.Component {

    render() {
        if (this.props.currentGameStatus === 'in_lobby') {
            return <QuizzMasterTeamsBeheren/>
        }
        if (this.props.currentGameStatus === 'choose_categories') {
            return <QuizzMasterCategorieen/>
        }
        if (this.props.currentGameStatus === 'choose_question') {
            return <QuizzMasterVragen/>
        }
        if (this.props.currentGameStatus === 'asking_question' || this.props.currentGameStatus === 'question_closed') {
            return <QuizzMasterVragenBeheren/>
        }
        if (this.props.currentGameStatus === 'round_ended') {
            return <QuizzMasterEindRonde/>
        }
        if (this.props.currentGameStatus === 'end_game') {
            return <QuizzMasterGameAanmaken/>
        }

        //If no match, return QuizzMasterGameAanmaken Component
        return <QuizzMasterGameAanmaken/>
    }
}

function mapStateToProps(state) {
    return {
        currentGameStatus: state.createGame.currentGameStatus
    }
}

export const QuizMasterApp = ReactRedux.connect(mapStateToProps)(QuizMasterAppUI);
