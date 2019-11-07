import React from "react";
import * as ReactRedux from "react-redux";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Card} from "react-bootstrap";
import HeaderTitel from "../HeaderTitel";

class ScorebordBeoordelingUI extends React.Component {

    getTeams() {
        return (
            this.props.teamAnswers.map(teamName => {
                let correctOrWrong = "";
                if (teamName.correct) {
                    correctOrWrong = (
                        <span className={"text-center"} style={{color: '#28a745'}}>
                            <i>
                                <strong>Antwoord goedgekeurd door Quiz Master</strong>
                            </i>
                        </span>
                    )
                } else if (teamName.correct === null) {
                    correctOrWrong = ""
                } else if (!teamName.correct) {
                    correctOrWrong = (
                        <span className={"text-center"} style={{color: '#dc3545'}}>
                            <i>
                                <strong>Antwoord afgewezen door Quiz Master</strong>
                            </i>
                        </span>
                    )
                }
                return (
                    <Col md={{span: 4}} key={teamName._id}>
                        <Card>
                            <Card.Body>
                                <Card.Title className={"text-center display-4"}>{teamName.team_naam}</Card.Title>
                                <Card.Text
                                    className={"text-center success"}><strong>{teamName.gegeven_antwoord}</strong></Card.Text>
                                <Card.Text
                                    className={"text-center success"}>{correctOrWrong}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            })
        )
    }

    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel/>
                    <Col md={{span: 6, offset: 3}}>
                        <Card>
                            <Card.Body>
                                <Card.Title className={"text-center display-4"}>
                                    {this.props.currentQuestionCategory}
                                </Card.Title>
                                <Card.Title className={"text-center"}>
                                    {this.props.currentQuestion}
                                </Card.Title>
                                <Card.Title className={"text-center"}>
                                    <b>Correcte antwoord:</b>
                                    <br/>
                                    <i>{this.props.currentQuestionAnswer}</i>
                                </Card.Title>
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
        currentQuestionAnswer: state.createGame.currentQuestionAnswer,
        currentTeamsScoreboard: state.createScoreboard.currentTeamsScoreboard,
        teamAnswers: state.createScoreboard.teamAnswers
    }
}

export const ScorebordBeoordeling = ReactRedux.connect(mapStateToProps)(ScorebordBeoordelingUI);
