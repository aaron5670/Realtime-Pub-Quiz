import React from "react";
import * as ReactRedux from "react-redux";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Card} from "react-bootstrap";
import HeaderTitel from "../HeaderTitel";

class ScorebordAntwoordUI extends React.Component {

    getTeams() {
        let currentTeamsScoreboard = this.props.currentTeamsScoreboard;

        currentTeamsScoreboard.map((teamName, key) => {
            this.props.isAnswered.map((teamAnswer) => {
                if (teamName._id === teamAnswer.teamName) {
                    currentTeamsScoreboard[key].isAnswered = true;
                }
            })
        });

        return currentTeamsScoreboard.map((teamName) => {
            let isAnswered = teamName.isAnswered ? <b style={{color: '#28a745'}}>Vraag beantwoord</b> : <b style={{color: '#dc3545'}}>Nog geen antwoord gegeven</b>;
            return (
                <Col md={{span: 4}} key={teamName._id}>
                    <Card>
                        <Card.Body>
                            <Card.Title className={"text-center display-4"}>{teamName._id}</Card.Title>
                            <Card.Text className={"text-center success"}>{isAnswered}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )
        });
    }

    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel/>
                    <Col md={{span: 6, offset: 3}}>
                        <Card>
                            <Card.Body>
                                <Card.Title
                                    className={"text-center display-4"}>{this.props.currentQuestionCategory}</Card.Title>
                                <Card.Title className={"text-center"}>{this.props.currentQuestion}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                    {this.getTeams()}
                </Row>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentQuestion: state.createGame.currentQuestion,
        currentQuestionCategory: state.createGame.currentQuestionCategory,
        currentTeamsScoreboard: state.createScoreboard.currentTeamsScoreboard,
        isAnswered: state.createScoreboard.isAnswered,
        gameRoomTeams: state.createGame.gameRoomTeams,
    }
}

export const ScorebordAntwoorden = ReactRedux.connect(mapStateToProps)(ScorebordAntwoordUI);
