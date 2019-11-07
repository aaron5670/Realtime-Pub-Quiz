import React from "react";
import * as ReactRedux from "react-redux";
import {ScorebordJoinTeam} from "./ScorebordJoinTeam";
import {ScorebordOverzichtScore} from "./ScorebordOverzichtScore";
import {ScorebordAntwoorden} from "./ScorebordAntwoorden";
import {ScorebordBeoordeling} from "./ScorebordBeoordeling";
import {ScorebordEindegame} from "./ScorebordEindegame";

class ScoreboardAppUI extends React.Component {

    render() {
        const showScoreboard = this.props.currentGameStatus === 'show_scoreboard';
        const chooseCategories = this.props.currentGameStatus === 'choose_categories';
        const chooseQuestion = this.props.currentGameStatus === 'choose_question';
        const askingQuestion = this.props.currentGameStatus === 'asking_question';
        const questionClosed = this.props.currentGameStatus === 'question_closed';
        const roundEnded = this.props.currentGameStatus === 'round_ended';
        const gameClosed = this.props.currentGameStatus === 'end_game';

        if (showScoreboard || chooseCategories || chooseQuestion || roundEnded) {
            return <ScorebordOverzichtScore/>
        }
        if (askingQuestion) {
            return <ScorebordAntwoorden/>
        }
        if (questionClosed) {
            return <ScorebordBeoordeling/>
        }
        if (gameClosed) {
            return <ScorebordEindegame/>
        }
        //If no match, return ScorebordJoinTeam Component
        return <ScorebordJoinTeam/>
    }
}

function mapStateToProps(state) {
    return {
        formValidationScoreboard: state.createScoreboard.formValidationScoreboard,
        currentGameStatus: state.createGame.currentGameStatus
    }
}

export const ScoreboardApp = ReactRedux.connect(mapStateToProps)(ScoreboardAppUI);
