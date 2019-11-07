import React from "react";
import * as ReactRedux from "react-redux";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import HeaderTitel from "../HeaderTitel";
import {endGame, startRound} from "../../websocket";
import Card from "react-bootstrap/Card";

class EindRondeUI extends React.Component {
    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel subTitle={"Einde van de huidige ronde"}/>
                    <Col md={{span: 12}} className={"text-white text-center"}>
                        <Card text="dark">
                            <Card.Body className={"text-center"}>
                                <h1 className={"py-4"}>Wat is de bedoeling?</h1>
                                <Button className={"float-left"} variant="danger" type="submit" onClick={() => {
                                    endGame(this.props.gameRoom)
                                }}>
                                    Quizzer afsluiten
                                </Button>

                                <Button className={"float-right"} variant="success" type="submit" onClick={() => {
                                    startRound(this.props.gameRoom)
                                }}>
                                    Nog een ronde spelen
                                </Button>
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
        gameRoom: state.createGame.gameRoom,
    }
}

export const QuizzMasterEindRonde = ReactRedux.connect(mapStateToProps)(EindRondeUI);
