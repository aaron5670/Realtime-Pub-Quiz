import React from "react";
import * as ReactRedux from 'react-redux';
import {
    createGameRoomAction,
    createGameFormValidationAction, createCurrentGameStatusAction
} from '../../action-reducers/createGame-actionReducer';
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import {QuizzMasterTeamsBeheren} from "./QuizzMasterTeamsBeheren";
import {openWebSocket} from "../../websocket";
import Card from "react-bootstrap/Card";
import Menu from "../Menu";
import HeaderTitel from "../HeaderTitel";

class GameAanmakenUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameRoomName: '',
        };
    }

    onChangeGameRoomName = (e) => {
        this.setState({
            gameRoomName: e.target.value
        })
    };

    handleSubmit = e => {
        e.preventDefault();

        const url = 'http://localhost:3001/api/game';
        let data = {
            gameRoomName: this.state.gameRoomName
        };
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors'
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                    if (data.gameRoomNameAccepted === true) {
                        this.props.doChangeGameFormValidation("success");
                        this.props.doChangeGameRoom(data.gameRoomName);
                        this.props.doChangeGameStatus('in_lobby');
                        openWebSocket();
                    } else if (data.gameRoomNameAccepted === false) {
                        this.props.doChangeGameFormValidation("error");
                    }
                }
            ).catch(err => console.log(err));
    };

    errorMessage() {
        if (this.props.formValidation === "error") {
            return "is-invalid"
        }
    }

    createGameForm() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel/>
                    <Col md={{span: 8, offset: 2}} className="h-100">
                        <Form onSubmit={this.handleSubmit}>
                            <Card bg="dark" border="danger" text="white">
                                <Card.Header>Maak een nieuwe Quizzer aan</Card.Header>
                                <Card.Body>
                                    <Form.Group>
                                        <Form.Label>Vul hier de game room naam in</Form.Label>
                                        <Form.Control value={this.state.gameRoomName}
                                                      onChange={this.onChangeGameRoomName}
                                                      type="text"
                                                      placeholder="Game room naam"
                                                      className={this.errorMessage()}
                                                      autoComplete="off"
                                                      required/>
                                        <div className="invalid-feedback">Deze game room naam is al bezet <span
                                            role={"img"} aria-label={""}>😢</span></div>
                                    </Form.Group>
                                    <Button variant="danger" type="submit">
                                        Spel aanmaken
                                    </Button>
                                    <Link to="/" className="btn btn-link">Annuleren</Link>
                                </Card.Body>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }

    render() {
        if (this.props.formValidation === "success" && this.props.currentGameStatus !== 'end_game') {
            return (
                <div>
                    <Menu/>
                    <QuizzMasterTeamsBeheren/>
                </div>
            )
        } else {
            return (
                <div>
                    <Menu/>
                    {this.createGameForm()}
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        formValidation: state.createGame.formValidation,
        gameRoom: state.createGame.gameRoom,
        currentGameStatus: state.createGame.currentGameStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doChangeGameFormValidation: (formValidation) => dispatch(createGameFormValidationAction(formValidation)),
        doChangeGameRoom: (gameRoom) => dispatch(createGameRoomAction(gameRoom)),
        doChangeGameStatus: (currentGameStatus) => dispatch(createCurrentGameStatusAction(currentGameStatus))
    }
}

export const QuizzMasterGameAanmaken = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GameAanmakenUI);
