import React, { Component } from "react";
import github_logo from "../../image/github.png";
import "../Github/Github.css";

export default class Github extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        };
    }

    componentDidMount = async () => {
        const response = await fetch("http://localhost:8080/auth/github/is_logged_in", {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                user_id: sessionStorage.getItem("user_id")
            })
        });
        const json = await response.json();
        if (json.success === true) {
            this.setState({ authenticated: true });
        } else {
            this.setState({ authenticated: false });
        }
    }

    render() {
        return (
            <div className="github">
                <div onClick = {this._handleLoginClick}> <img alt="github logo" className="logo" src={github_logo} /> Login Github</div>
            </div>
        );
    }

    _handleLoginClick = () => {
        const user_id = sessionStorage.getItem("user_id");
        window.open(`http://localhost:8080/auth/github/redirect/${user_id}`, "_self");
    };
    _handleLogoutClick = () => {
        window.open("http://localhost:8080/auth/logout", "_self");
    }
}