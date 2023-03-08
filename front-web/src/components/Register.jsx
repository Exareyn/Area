import logo from '../image/logo-monkey.png';
import googlelogo from '../image/google.png';
import side_bar from '../image/sidebar.png';
import '../components/Form.css';
import React, { useState }  from 'react';

const Register = () => {
  const google = ()=>{
    window.open("http://localhost:8080/auth/google", "_self")
  }
  const [usr, setUsr] = useState("");
  const [email, setEmail] = useState("");
  const [psw, setPsw] = useState("");
  const [confpsw, setConfPsw] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if(psw === confpsw) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"username": `${usr}`, "mail": `${email}`, "password": `${psw}`})
      };
      fetch('http://localhost:8080/register', requestOptions)
      .then(function(response){ return response.json(); })
      .then(function(data) {
          const items = data;
          if (items.split('"')[5] === "KO") {
            alert("fuck you");
          } else {
            console.log(items.split('"'))
            sessionStorage.setItem('user_id', items.split('"')[1]);
            window.location.replace("/dashboard");
          }
      });
    }
     else
       alert(`psw et confirme pas pareil psw = ${psw} confirme = ${confpsw}`)
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-contain">
          <div className="blck_form">
            <p className="title"> Create an Account</p>
            <div className="form-box">
            <form onSubmit={handleSubmit}>
              <label htmlFor="usr">Username</label>
              <input
                onChange={(e) => setUsr(e.target.value)}
                value={usr}
                placeholder="username">
              </input>
              <label htmlFor="usr">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
              <label htmlFor="psw">Confirme Password</label>
              <input
                onChange={(e) => setConfPsw(e.target.value)}
                value={confpsw}
                type="password"
                autoComplete="off"
                placeholder="*************">
              </input>
              <input type="submit" value="Register">
              </input>
            </form>
            </div>
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
export default Register;