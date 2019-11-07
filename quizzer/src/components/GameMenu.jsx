import React from "react";
import Menu from "./Menu";

class GameMenu extends React.Component {
    render() {
        return (
            <div>
                <Menu/>
                <div className="h-100 row align-items-center vh-100">
                    <h1 className="col-12 text-center display-2" style={{color: "white"}}>
                        <b>Pub Game</b>
                        <br/>
                        <span className="display-3">Quizzer Night</span>
                    </h1>
                </div>
            </div>
        )
    }
}

export default GameMenu
