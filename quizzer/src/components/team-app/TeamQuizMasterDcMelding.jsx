import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import HeaderTitel from "../HeaderTitel";

export class TeamQuizMasterDcMelding extends React.Component {
    render() {
        return (
            <Container>
                <Row className="min-vh-100">
                    <HeaderTitel/>
                    <Alert className={"h-25 d-inline-block w-100"} variant="light">
                        <Alert.Heading className={"text-center"}>
                            <span role="img" aria-label="end">😓 </span>
                            Quiz Master heeft het spel verlaten
                            <span role="img" aria-label="success"> 😓</span>
                        </Alert.Heading>
                        <p className={"text-center"}>
                            Bekijk de eindscore op het scorebord.
                        </p>
                    </Alert>
                </Row>
            </Container>
        )
    }
}

export default TeamQuizMasterDcMelding
