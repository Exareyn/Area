import React, { Component } from "react";
import facebook_logo from "../../image/facebook.png";
import "../Facebook/Facebook.css";

export default class Facebook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        };
    }

    componentDidMount = async () => {
        const response = await fetch("http://localhost:8080/auth/facebook/is_logged_in", {
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
            <div className="facebook">
                <div onClick = {this._handleLoginClick}> <img alt="facebook logo" className="logo" src={facebook_logo} /> Login Facebook</div>
            </div>
        );
    }

    _handleLoginClick = () => {
        const user_id = sessionStorage.getItem("user_id");
        window.open(`http://localhost:8080/auth/facebook/redirect/${user_id}`, "_self");
    };
    _handleLogoutClick = () => {
        window.open("http://localhost:8080/auth/logout", "_self");
    }
}