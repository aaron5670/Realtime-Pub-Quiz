import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {Card} from "react-bootstrap";
import {createGameQuestionsAction} from "../../action-reducers/createGame-actionReducer";
import * as ReactRedux from "react-redux";
import {startQuestion} from "../../websocket";
import HeaderTitel from "../HeaderTitel";

class VragenUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            selectedQuestion: null,
        })
    }

    componentDidMount() {
        const url = `http://localhost:3001/api/game/${this.props.gameRoom}/ronde/${this.props.roundNumber}/questions`;
        const options = {
            method: 'GET',
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
                        this.props.doChangeQuestions(data.questions);
                    } else {

                    }
                }
            );
    }

    selectQuestion(questionName) {
        this.setState({
            selectedQuestion: questionName,
        })
    }

    getQuestions() {
        return (
            this.props.questions.map((question, key) => {
                let isSelected;
                if (this.state.selectedQuestion === question) {
                    isSelected = "isSelected";
                }
                return (
                    <Col key={key}
                         md={6}
                         xl={12}
                         className={"pb-3"}
                         onClick={() => {
                             this.selectQuestion(question)
                         }}>
                        <Card className={isSelected}>
                            <Card.Body>
                                <Card.Title className="text-center m-0">
                                    {question.question}
                                </Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                )
            })
        )
    }

    render() {
        let startQuestionButton;
        if (this.state.selectedQuestion) {
            startQuestionButton = (
                <Button variant="danger" type="submit" onClick={() => {
                    startQuestion(this.props.gameRoom, this.props.roundNumber, this.state.selectedQuestion)
                }}>
                    Start vraag
                </Button>
            )
        }
        return (
            <div className="container-fluid px-md-5">
                <Row className="row pb-5 text-white">
                    <HeaderTitel subTitle={"Kies hier  vraag"} />
                </Row>
                <div className="rounded">
                    <Row>
                        <Col lg={4} className={"mb-4 mb-lg-0"}>
                            <div className="nav flex-column bg-white shadow-sm font-italic rounded p-3 text-center">
                                <h3 className={"text-center"}>Quiz info</h3>
                                <hr/>
                                <p><b>Gameroom naam</b><br/>{this.props.gameRoom}</p>
                                <p><b>Huidige ronde</b><br/>{this.props.roundNumber}</p>
                                {startQuestionButton}
                            </div>
                        </Col>

                        <Col lg={8} className={"mb-5"}>
                            <div className="p-5 bg-white d-flex align-items-center shadow-sm rounded h-100">
                                <div className="demo-content">
                                    <p className="lead font-italic"><b>- Vragen</b></p>
                                    <Row>
                                        {this.getQuestions()}
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        gameRoom: state.createGame.gameRoom,
        questions: state.createGame.questions,
        roundNumber: state.createGame.roundNumber,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        doChangeQuestions: (categories) => dispatch(createGameQuestionsAction(categories)),
    }
}

export const QuizzMasterVragen = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(VragenUI);
