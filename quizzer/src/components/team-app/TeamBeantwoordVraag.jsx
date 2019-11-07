import React from "react";
import * as ReactRedux from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import HeaderTitel from "../HeaderTitel";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {sendGetQuestionAnswersMSG, sendGetTeamIsAnsweredMSG} from "../../websocket";
import {store} from "react-notifications-component";

class TeamBeantwoordVraagUI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teamAnswer: '',
        };
    }

    onChangeCurrentAnswer = (e) => {
        this.setState({
            teamAnswer: e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();

        const url = `http://localhost:3001/api/game/${this.props.gameRoomName}/ronde/${this.props.roundNumber}/question/${this.props.questionNumber}/team/${this.props.teamName}/answer`;

        let data = {
            teamAnswer: this.state.teamAnswer
        };
        const options = {
            method: 'POST',
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
                        sendGetQuestionAnswersMSG();
                        sendGetTeamIsAnsweredMSG(this.props.teamName,true);
                        store.addNotification({
                            title: 'Quizzer',
                            message: 'Antwoord verstuurd naar de Quiz Master 😉',
                            type: 'success',                         // 'default', 'success', 'info', 'warning'
                            container: 'top-right',                  // where to position the notifications
                            animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                            animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                            dismiss: {
                                duration: 2000
                            }
                        })
                    }
                }
            ).catch(err => console.log(err));
    };

    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel subTitle={"Beantwoord met je team de huidige vraag"}/>
                    <Col md={{span: 10, offset: 1}}>
                        <Card>
                            <Card.Body>
                                <blockquote className="blockquote mb-0">
                                    <p className={"text-center"}>
                                        {this.props.currentQuestion}
                                    </p>
                                    <footer className="blockquote-footer te">
                                        Categorie:
                                        <cite title="Source Title"> <b>{this.props.currentQuestionCategory}</b>
                                            <span className={"float-right"}>{this.props.questionNumber}/12</span>
                                        </cite>
                                    </footer>
                                </blockquote>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={{span: 10, offset: 1}}>
                        <Card bg="dark" border="danger" text="white">
                            <Card.Header>Beantwoord hier de vraag!</Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>
                                            U kunt uw antwoord wijzigen totdat de Quizz Master de vraag sluit!
                                        </Form.Label>
                                        <Form.Control maxlength={50}
                                                      type="text"
                                                      value={this.state.teamAnswer}
                                                      onChange={this.onChangeCurrentAnswer}
                                                      placeholder="Uw antwoord"
                                                      autoComplete="off"
                                                      required/>
                                    </Form.Group>
                                    <Button variant="danger" type="submit">Vraag beantwoorden</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentQuestion: state.createGame.currentQuestion,
        currentQuestionCategory: state.createGame.currentQuestionCategory,
        gameRoomName: state.createTeam.gameRoomName,
        teamName: state.createTeam.teamRoomName,
        roundNumber: state.createGame.roundNumber,
        questionNumber: state.createGame.questionNumber
    }
}

export const TeamBeantwoordVraag = ReactRedux.connect(mapStateToProps)(TeamBeantwoordVraagUI);
