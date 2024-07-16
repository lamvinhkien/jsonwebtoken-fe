import axios from "axios";

const registerNewUser = (email, phone, username, password) => {
    let res = axios.post("http://localhost:8080/api/register", {
        email: email, phone: phone, username: username, password: password
    })
    return res;
}

const loginUser = (valueLogin, password) => {
    let res = axios.post("http://localhost:8080/api/login", {
        valueLogin: valueLogin, password: password
    })
    return res;
}

const getAllUser = (page, limit) => {
    let res = axios.get(`http://localhost:8080/api/user/show-all?page=${page}&limit=${limit}`)
    return res;
}

const deleteUser = (id) => {
    let res = axios.delete("http://localhost:8080/api/user/delete", { data: { id: id } })
    return res
}

const getAllGroup = () => {
    let res = axios.get("http://localhost:8080/api/group/show-all")
    return res
}

export {registerNewUser, loginUser, getAllUser, deleteUser, getAllGroup}