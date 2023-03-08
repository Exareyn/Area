import logo from '../image/logo-monkey.png';
import '../components/Psw.css';
import React, { useState }  from 'react';

const Login = () => {
  const [psw, setPsw] = useState("");
  const [confpsw, setConfPsw] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if(psw === confpsw)
      alert(`psw = ${psw}`)
    else
      alert(`psw et confirme pas pareil psw = ${psw} confirme = ${confpsw}`)
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-contain">
          <div className="blck_gafa">
            <p className="title"> Reset password</p>
            <p> Enter a new password for account: email@adress.com</p>
            <div className="form-box">
            <form onSubmit={handleSubmit}>
              <label for="psw">Password</label>
              <input
                onChange={(e) => setPsw(e.target.value)}
                value={psw}
                type="password"
                autocomplete="off"
                placeholder="*************">
              </input>
              <label for="psw">Confirme Password</label>
              <input
                onChange={(e) => setConfPsw(e.target.value)}
                value={confpsw}
                type="password"
                autocomplete="off"
                placeholder="*************">
              </input>
              <input type="submit" value="Register">
              </input>
            </form>            </div>
            <p className="sgn"> Don't have an account ? <a href='./Register'>Sign up</a>.</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Login;