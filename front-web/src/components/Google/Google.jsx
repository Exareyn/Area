import React, { Component } from "react";
import google_logo from "../../image/google.png";
import "../Google/Google.css";

export default class Google extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        };
    }

    componentDidMount = async () => {
        const response = await fetch("http://localhost:8080/auth/google/is_logged_in", {
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
            <div className="google">
                {authenticated ? (
                    <li onClick = {console.log("T'ES DANS LA BOUCLE!")}><google_logo/><img alt="google logo" className="logo" src={google_logo} /> Logout Google</li>
                    ) : (
                    <li onClick = {this._handleLoginClick}> <img alt="google logo" className="logo" src={google_logo} /> Login Google</li>
                )}
            </div>
        );
    }

    _handleLoginClick = () => {
        // Authenticate using via passport api in the backend
        // Open Google login page
        const user_id = sessionStorage.getItem("user_id");
        window.open(`http://localhost:8080/auth/google/callback/${user_id}`, "_self");
    };

    _handleLogoutClick = () => {
        // Logout using Twitter passport api
        // Set authenticated state to false in the HomePage component
        window.open("http://localhost:8080/auth/logout", "_self");
    }
}