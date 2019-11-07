import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import HeaderTitel from "../HeaderTitel";

export class TeamQuestions extends React.Component {
    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel/>
                    <Alert className={"h-25 d-inline-block w-100"} variant="light">
                        <Alert.Heading className={"text-center"}><span role="img" aria-label="luck">🍀</span> Vraag
                            gesloten <span role="img" aria-label="luck">🍀</span></Alert.Heading>
                        <p className={"text-center"}>
                            Bekijk op het scorebord of je antwoord is goedgekeurd.
                        </p>
                    </Alert>
                </Row>
            </Container>
        )
    }
}

export default TeamQuestions
