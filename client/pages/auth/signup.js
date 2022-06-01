import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {doRequest, errors} = useRequest({
    method: 'post',
    url: '/api/users/signup',
    body: {
      email, password
    },
    onSuccess: ()=> Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();
    Router.push('/')
    doRequest();

  }


  return (
    <form onSubmit={onSubmit}> 
    <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email</label>
        <input 
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
      <label>Password</label>
        <input 
          className="form-control"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary"> Submit</button>

    </form>
  );

}

export default SignUp;