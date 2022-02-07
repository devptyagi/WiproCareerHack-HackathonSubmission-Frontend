import "../Styles/CreateUser.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import axios from '../Util/axios';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

export default function CreateUser() {

  let history = useHistory();

  let config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  };

  const notify = () => {
    toast.success('Account created successfully!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const createUserPostData = {
      username: e.target.formGridUsername.value,
      fullName: e.target.formGridFullname.value,
      emailAddress: e.target.formGridEmail.value,
      role: e.target.formGridRole.value
    };
    
    try {
      const createUserResponse = await axios.post('/user/create', createUserPostData, config);
      console.log(createUserResponse.status);
      if(createUserResponse.status === 200) {
        notify();
        history.push('/');
      }
    } catch(err) {
      if(err.response && err.response.data) {
        if(err.response.data.message) notifyError(err.response.data.message);
        else {
          const fields = Object.keys(err.response.data);
          fields.forEach((field, _) => {
            notifyError(err.response.data[field]);
          })
        }
      } else {
        notifyError('Some error occurred!');
      }
    }
  }

  return (
    <div className="createUser__screen">
      <Form onSubmit={handleSubmit}>
        <h1 className="text-center mb-5">Create User</h1>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridFullname">
          <Form.Label>Full Name</Form.Label>
          <Form.Control placeholder="Full Name" />
        </Form.Group>

        <Row className="mb-3">

          <Form.Group as={Col} controlId="formGridRole">
            <Form.Label>Role</Form.Label>
            <Form.Select defaultValue="LEVEL1">
              <option>LEVEL1</option>
              <option>LEVEL2</option>
              <option>LEVEL3</option>
            </Form.Select>
          </Form.Group>

        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
