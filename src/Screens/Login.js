import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import '../Styles/Login.css'

import axios from '../Util/axios';
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {

  let history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if(token !== null) {
      setIsLoggedIn(true);
    }
  }, []);
  
  
  const saveUserDataInLocalStorage = (userData) => {
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('emailAddress', userData.emailAddress);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('role', userData.role);
    setIsLoggedIn(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      emailAddress: e.target.formBasicEmail.value,
      password: e.target.formBasicPassword.value
    }
    console.log(loginData);
    const loginResponse = await axios.post('/auth/login', loginData);
    const userData = await loginResponse.data;
    saveUserDataInLocalStorage(userData);
  }

  if(isLoggedIn) {
    history.push('/');
  }

  return (
    <div className="login__screen">
      <Form onSubmit={handleSubmit}>
      <h1 className="text-center mb-5">Login</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
