import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDesktop, faUser, faUsers} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

export class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuClass: '',
        };
    }

    toggleClass() {
        if (this.state.menuClass === 'close') {
            return this.setState({
                menuClass: ''
            })
        } else {
            return this.setState({
                menuClass: 'close'
            })
        }
    };

    render() {
        return (
            <div className={`base ${this.state.menuClass}`} onClick={() => {
                this.toggleClass()
            }}>
                <div className="menu">
                    <div className="icon">
                        <div className="bar"/>
                    </div>
                </div>
                <div className="icons">
                    <FontAwesomeIcon icon={faUser} aria-hidden="true"/>
                    <FontAwesomeIcon icon={faUsers} aria-hidden="true"/>
                    <FontAwesomeIcon icon={faDesktop} aria-hidden="true"/>
                </div>
                <div className="section">
                    <div className="cover1">
                        <div className="cover2">
                            <Link to="/team" className="content"/>
                        </div>
                    </div>
                </div>
                <Link to="/quiz-master" className="section-static top"/>
                <Link to="/scoreboard" className="section-static bottom"/>
            </div>
        )
    }
}

export default Menu
