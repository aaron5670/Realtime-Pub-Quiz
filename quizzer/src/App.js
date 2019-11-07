import React from 'react';
import './App.css';
import GameMenu from "./components/GameMenu";
import {QuizMasterApp} from "./components/quiz-master/App"
import {Switch, Route} from "react-router-dom";
import ReactNotification from "react-notifications-component";
import {TeamsApp} from "./components/team-app/App";
import {ScoreboardApp} from "./components/score-bord/App";
//============================================================================
//  The React component that renders the UI for the entire App.
//----------------------------------------------------------------------------

class App extends React.Component {
    render() {
        return (
            <div>
                <ReactNotification/>
                <Switch>
                    <Route exact path="/">
                        <GameMenu/>
                    </Route>
                    <Route path="/quiz-master">
                        <QuizMasterApp/>
                    </Route>
                    <Route path="/team">
                        <TeamsApp/>
                    </Route>
                    <Route path="/scoreboard">
                        <ScoreboardApp/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default App
