import React, { Component } from "react";
import twitter_logo from "../../image/discord.png";
import "../Discord/Discord.css";

export default class Discord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        };
    }

    componentDidMount = async () => {
        const response = await fetch("http://localhost:8080/auth/discord/is_logged_in", {
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
        const { authenticated } = this.state;
        return (
            <div className="twitter">
                {authenticated ? (
                    <li onClick = {console.log("T'ES DANS LA BOUCLE!")}><twitter_logo/><img alt="twitter logo" className="logo" src={twitter_logo} /> Logout Discord</li>
                    ) : (
                    <li onClick = {this._handleLoginClick}> <img alt="twitter logo" className="logo" src={twitter_logo} /> Login Discord</li>
                )}
            </div>
        );
    }

    _handleLoginClick = () => {
        // Authenticate using via passport api in the backend
        // Open Twitter login page
        const user_id = sessionStorage.getItem("user_id");
        window.open(`http://localhost:8080/auth/discord/redirect/${user_id}`, "_self");
    };

    _handleLogoutClick = () => {
        // Logout using Twitter passport api
        // Set authenticated state to false in the HomePage component
        window.open("http://localhost:8080/auth/logout", "_self");
    }
}