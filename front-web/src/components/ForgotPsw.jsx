import logo from '../image/logo-monkey.png';
import '../components/Psw.css';
import React, { useState }  from 'react';
  
const Login = () => {
  const [usr, setUsr] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.replace("/reset_psw");
}
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-contain">
          <div className="blck_gafa">
            <p className="title"> Forgot password ?</p>
            <p> Enter your register email below to receive password reset instruction</p>
            <div className="form-box">
            <form onSubmit={handleSubmit}>
              <label for="usr">Email</label>
              <input
                onChange={(e) => setUsr(e.target.value)} 
                value={usr} 
                placeholder="example@gmail.com">
              </input>
              <input type="submit" value="Send">
              </input>
            </form>
            </div>
            <p className="sgn"> Don't have an account ? <a href='./Register'>Sign up</a>.</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Login;