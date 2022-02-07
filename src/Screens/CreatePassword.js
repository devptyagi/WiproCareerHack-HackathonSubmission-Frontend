import '../Styles/CreatePassword.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useLocation } from 'react-router-dom';

import axios from '../Util/axios';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom";

export default function CreatePassword() {

    let history = useHistory();

    const search = useLocation().search;
    const fullName = new URLSearchParams(search).get('fullName');
    const inviteCode = new URLSearchParams(search).get('inviteCode');

    const notify = () => {
        toast.success('Account activated! Loggin in....', {
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

    const saveUserDataInLocalStorage = (userData) => {
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('emailAddress', userData.emailAddress);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('role', userData.role);
        history.push('/');
      }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPassword = e.target.formNewPassword.value;
        const confirmPassword = e.target.formConfirmPassword.value;

        if(newPassword !== confirmPassword) {
            notifyError('Passwords do not match!');
            return;
        }

        const activateUserPutData = {
            invitationCode: inviteCode,
            password: newPassword
        }

        try {
            const createPasswordResponse = await axios.put('/user/activate', activateUserPutData);
            if(createPasswordResponse.status === 200) {
                notify();
                const userData = createPasswordResponse.data;
                console.log(userData);
                saveUserDataInLocalStorage(userData);
            }
        } catch(err) {
            if(err.response && err.response.data) notifyError(err.response.data.message);
            else notifyError('Some error occurred!');
        }
    }

    return (
        <div className='createPassword__screen'>
            <Form onSubmit={handleSubmit}>
            <p className="text-center font-weight-bold">Welcome Onboard {`${fullName}`}!</p>
            <p>Kindly set a password for your account.</p>
                <Form.Group className="mb-3" controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control type="password" placeholder="Re-Enter Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                Submit
                </Button>
            </Form>
        </div>
    )
}