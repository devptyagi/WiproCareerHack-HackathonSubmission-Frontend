import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-type':'application/json',
        'Accept':'application/json'
    }
})

export default instance;