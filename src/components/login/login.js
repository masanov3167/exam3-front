import React, { useRef } from "react";
import { Context } from "../context/context";
import './login.css'
 
const Login = () =>{

    const { setToken, link,  setRole} = React.useContext(Context);

    const name = useRef();
    const pass = useRef();

    const addToken = (e) => {
		e.preventDefault();

        fetch(`${link}/login`,{
        method:'POST',
        headers:{
            'Content-type':'application/json'
        },
        body: JSON.stringify({
                login: name.current.value.trim(),
                pass: pass.current.value.trim()
        })
        })
        .then(res => res.json())
        .then(data => 
            (setToken(data?.access_token),
            setRole(data?.data?.role))
            )
        .catch(err => console.log(err))
        name.current.value = null;
        pass.current.value = null;
	};
    return (
        <>
            <section className="login">
                <div className="login-wrapper">
                    <form className="form" onSubmit={addToken} autoComplete="off" >
                        <label className="form-text" >Log in</label>
                        <input ref={name} name='name' type="text"  placeholder="login *" minLength="4" required/>
                        <input ref={pass} name='password' type="password" placeholder="password *" minLength="5" required />
                        <button className="form-btn" type="submit">Log In</button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login;