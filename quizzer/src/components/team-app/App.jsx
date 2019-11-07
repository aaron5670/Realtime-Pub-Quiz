import React from "react";
import * as ReactRedux from "react-redux";
import TeamCategorieMelding from "./TeamCategorieMelding";
import TeamVragen from "./TeamVragen";
import {TeamBeantwoordVraag} from "./TeamBeantwoordVraag";
import {TeamAanmaken} from "./TeamAanmaken";
import TeamQuestionClosed from "./TeamVraagGeslotenMelding";
import TeamRondeEindMelding from "./TeamRondeEindMelding";
import TeamGameEnded from "./TeamGameEndeMelding";
import TeamQuizMasterDcMelding from "./TeamQuizMasterDcMelding";

class TeamsAppUI extends React.Component {

    render() {
        if (this.props.currentGameStatus === 'choose_categories' && this.props.teamNameStatus === 'success') {
            return <TeamCategorieMelding/>
        }
        if (this.props.currentGameStatus === 'choose_question' && this.props.teamNameStatus === 'success') {
            return <TeamVragen/>
        }
        if (this.props.currentGameStatus === 'asking_question' && this.props.teamNameStatus === 'success') {
            return <TeamBeantwoordVraag/>
        }
        if (this.props.currentGameStatus === 'question_closed' && this.props.teamNameStatus === 'success') {
            return <TeamQuestionClosed/>
        }
        if (this.props.currentGameStatus === 'round_ended') {
            return <TeamRondeEindMelding/>
        }
        if (this.props.currentGameStatus === 'end_game') {
            return <TeamGameEnded/>
        }
        if (this.props.currentGameStatus === 'quizmaster_left') {
            return <TeamQuizMasterDcMelding/>
        }

        //If no match, return QuizzMasterGameAanmaken Component
        return <TeamAanmaken/>
    }
}

function mapStateToProps(state) {
    return {
        currentGameStatus: state.createGame.currentGameStatus,
        teamNameStatus: state.createTeam.teamNameStatus,
    }
}

export const TeamsApp = ReactRedux.connect(mapStateToProps)(TeamsAppUI);
