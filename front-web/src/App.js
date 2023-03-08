import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
} from "react-router-dom";
import React from 'react';

import Login from "./components/Login";
import Register from "./components/Register";
import ResetPsw from "./components/ResetPsw";
import ForgotPsw from "./components/ForgotPsw";
import Dashboard from "./components/Dashboard";

function App() {
return (
	<>
	<Router>
		<Routes>
			<Route path="/dashboard" element={<Dashboard/>} />
    		<Route path="/register" element={<Register/>} />
    		<Route path="/login" element={<Login/>} />
    		<Route path="/forgot_psw" element={<ForgotPsw/>} />
    		<Route path="/reset_psw" element={<ResetPsw/>} />
    		<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	</Router>
	</>
);
}

export default App;
