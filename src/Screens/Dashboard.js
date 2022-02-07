import "../Styles/Dashboard.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import axios from "../Util/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Dashboard() {
  let history = useHistory();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [createUserAllowed, setCreateUserAllowed] = useState(false);
  const [deleteAllowed, setDeleteAllowed] = useState(false);
  const [users, setUsers] = useState([]);
  const [isDescending, setIsDescending] = useState(false);
  const [sortingOn, setSortingOn] = useState('fullName');

  const notify = () => {
    toast.success("User deleted!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

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
  };

  const checkPermissions = () => {
    const role = localStorage.getItem("role");
    if (role === "LEVEL3") {
      setDeleteAllowed(true);
    }
    if (role === "LEVEL2" || role === "LEVEL3") {
      setCreateUserAllowed(true);
    }
  };

  const deleteUser = async (e) => {
    const userId = e.target.id;
    try {
      await axios.delete(`/user/delete/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });
      notify();
      const filteredData = users.filter((user) => user.userId !== userId);
      setUsers(filteredData);
    } catch (err) {
      if (err.response && err.response.data)
        notifyError(err.response.data.message);
      else notifyError("Some error occurred!");
    }
  };

  const getAllUsers = async (sortBy = 'fullName', order = 'asc') => {
    console.log('Sort Order in GetAll: ' + order);
    const getAllUsersResponse = await axios.get(`/user/all?sort=${sortBy}&order=${order}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    });
    const usersData = await getAllUsersResponse.data;
    setUsers(usersData);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token === null) {
      setIsLoggedIn(false);
    }
    checkPermissions();
    getAllUsers();
  }, []);

  useEffect(() => {
    getAllUsers(sortingOn, isDescending ? 'desc' : 'asc');
  }, [sortingOn, isDescending]);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const handleSort = (sortBy) => {
    setSortingOn(sortBy);
    setIsDescending(!isDescending);
  } 

  if (!isLoggedIn) {
    history.push("/login");
  }

  return (
    <div className="dashboard__screen">
      <div className="dashboard__header">
        <h2>Dashboard</h2>
        <div className="dashboardHeader__buttons">
          {createUserAllowed ? (
            <Link to="/create-user">
              <Button variant="primary">Create User</Button>
            </Link>
          ) : (
            ""
          )}
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="dashboard__body">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th onClick={() => handleSort('fullName')}>
                Full Name
                {sortingOn === 'fullName' ? (
                   <i  class={`bi ${isDescending ? "bi-arrow-up" : "bi-arrow-down"}`}/>
                ) : ''}
              </th>
              <th onClick={() => handleSort('username')}>
                Username
                {sortingOn === 'username' ? (
                   <i  class={`bi ${isDescending ? "bi-arrow-up" : "bi-arrow-down"}`}/>
                ) : ''}
                </th>
              <th onClick={() => handleSort('emailAddress')}>
                Email
                {sortingOn === 'emailAddress' ? (
                   <i  class={`bi ${isDescending ? "bi-arrow-up" : "bi-arrow-down"}`}/>
                ) : ''}
                </th>
              <th onClick={() => handleSort('status')}>
                Satus
                {sortingOn === 'status' ? (
                   <i  class={`bi ${isDescending ? "bi-arrow-up" : "bi-arrow-down"}`}/>
                ) : ''}
                </th>
              <th onClick={() => handleSort('role')}>
                Role
                {sortingOn === 'role' ? (
                   <i  class={`bi ${isDescending ? "bi-arrow-up" : "bi-arrow-down"}`}/>
                ) : ''}
                </th>
              {deleteAllowed ? <th>
                Delete User
                </th> : ""}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr>
                <td>{user.userId}</td>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>{user.emailAddress}</td>
                <td>{user.status}</td>
                <td>{user.role}</td>
                {deleteAllowed ? (
                  <td className="deleteBtn">
                    <i
                      id={user.userId}
                      class="bi bi-x-circle-fill delete-icon"
                      onClick={deleteUser}
                    ></i>
                  </td>
                ) : (
                  ""
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
