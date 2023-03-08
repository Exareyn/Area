import logo from '../image/logo-monkey.png';
import googlelogo from '../image/google.png';
import side_bar from '../image/sidebar.png';
import '../components/Form.css';
import React, { useState }  from 'react';

const Login = () => {
  const google = () => {
    const test = window.open("http://localhost:8080/auth/google", "_self");
  }
  const [usr, setUsr] = useState("");
  const [psw, setPsw] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"mail": `${usr}`, "password": `${psw}`})
    };
    fetch('http://localhost:8080/login', requestOptions)
    .then(function(response){ return response.json();})
    .then(function(data) {
      const items = data;
      console.log("items", items);
      if (items.split('"')[3] === "OK") {
        sessionStorage.setItem('user_id', items.split('"')[1]);
        window.location.replace("/dashboard");
      } else {
        alert("Bad username or password");
      }
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-contain">
          <div className="blck_form">
            <p className="title"> Login to your Account</p>
            <div className="form-box">
            <form onSubmit={handleSubmit}>
              <label htmlFor="usr">Email / Username</label>
              <input
                onChange={(e) => setUsr(e.target.value)}
                value={usr}
                placeholder="example@gmail.com">
              </input>
              <label htmlFor="psw">Password</label>
              <input
                onChange={(e) => setPsw(e.target.value)}
                value={psw}
                type="password"
                autoComplete="off"
                placeholder="*************">
              </input>
              <input type="submit" value="Sign in">
              </input>
            </form>
            </div>
            <p className="frgpsw"> <a href="./Forgot_psw">forgot password nique zeubi UwU</a></p>
            <p className="sgn"> Don't have an account ? <a href='./Register'>Sign up</a>.</p>
          </div>
          <div className="blck_sprt">
            <img src={side_bar} className="Sb" alt="sb" />
          </div>
          <div className="blck_gafa">
            <div className="ggle" onClick={google}>
              <img className="icon" alt={"uwu"} src={googlelogo} height ="30" width="30"></img>
              Google
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Login;