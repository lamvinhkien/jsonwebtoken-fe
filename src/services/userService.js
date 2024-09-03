import axios from "../Setup/axios";

const registerNewUser = (email, phone, username, password) => {
    let res = axios.post("/api/register", { email: email, phone: phone, username: username, password: password })
    return res;
}

const loginUser = (valueLogin, password) => {
    let res = axios.post("/api/login", { valueLogin: valueLogin, password: password })
    return res;
}

const logoutUser = () => {
    let res = axios.post("/api/logout")
    return res;
}

const getAllUser = (page, limit) => {
    let res = axios.get(`/api/user/show-all?page=${page}&limit=${limit}`)
    return res;
}

const createNewUser = (user) => {
    let res = axios.post(`/api/user/create`, user)
    return res;
}

const updateUser = (user) => {
    let res = axios.put(`/api/user/update`, user)
    return res;
}

const deleteUser = (id) => {
    let res = axios.delete("/api/user/delete", { data: { id: id } })
    return res
}

const getUserAccount = () => {
    let res = axios.get("/api/user/get-account")
    return res
}

const changeInfor = (id, email, groupId, typeAccount, changeData) => {
    let res = axios.post('/api/user/change-infor', { id: id, email: email, groupId: groupId, typeAccount: typeAccount, changeData: changeData })
    return res
}

const changePassword = (email, changeData) => {
    let res = axios.post('/api/user/change-password', { email: email, changeData: changeData })
    return res
}

const sendOTP = (email) => {
    let res = axios.post('/api/send-otp', { email: email })
    return res
}

const resetPassword = (email, codeOTP, newPassword, confirmPassword) => {
    let res = axios.post('/api/reset-password', { email: email, codeOTP: codeOTP, newPassword: newPassword, confirmPassword: confirmPassword })
    return res
}

export {
    registerNewUser, loginUser, getAllUser, createNewUser, updateUser,
    deleteUser, getUserAccount, logoutUser, changeInfor, changePassword,
    sendOTP, resetPassword
}