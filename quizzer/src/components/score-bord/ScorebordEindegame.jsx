import React from "react";
import * as ReactRedux from "react-redux";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Card} from "react-bootstrap";
import HeaderTitel from "../HeaderTitel";

class ScorebordEindegameUI extends React.Component {
    getTop3Teams() {
        const allTeams = this.props.currentTeamsScoreboard;

        allTeams.sort((a, b) => (a.team_score < b.team_score) ? 1 : -1);

        let firstPlace = (allTeams[0]) ?
            (
                <div>
                    <h1 className={"display-2 medal-gold"}><span role="img" aria-label="1">🥇</span></h1>
                    <h1 className={"display-2 titel-1"}>{allTeams[0]._id}</h1>
                    <hr/>
                </div>
            )
            : null

        let secondPlace = (allTeams[1]) ?
            (
                <div>
                    <h1 className={"display-2 medal-gold"}><span role="img" aria-label="2">🥈</span></h1>
                    <h1 className={"display-2 titel-1"}>{allTeams[1]._id}</h1>
                    <hr/>
                </div>
            )
            : null

        let thirdPlace = (allTeams[2]) ?
            (
                <div>
                    <h1 className={"display-2 medal-gold"}><span role="img" aria-label="3">🥉</span></h1>
                    <h1 className={"display-2 titel-1"}>{allTeams[2]._id}</h1>
                </div>
            )
            : null

        return (
            <div>
                {firstPlace}
                {secondPlace}
                {thirdPlace}
            </div>
        )
    }

    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel/>
                    <Col md={{span: 12}} className={"text-white text-center"}>
                        <Card text="dark">
                            <Card.Body className={"text-center"}>
                                {this.getTop3Teams()}
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
        currentTeamsScoreboard: state.createScoreboard.currentTeamsScoreboard
    }
}

export const ScorebordEindegame = ReactRedux.connect(mapStateToProps)(ScorebordEindegameUI);
