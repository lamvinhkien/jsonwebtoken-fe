import axios from "../Setup/axios";

const registerNewUser = (email, phone, username, dateOfBirth, password) => {
    let res = axios.post("/register", { email: email, phone: phone, username: username, dateOfBirth: dateOfBirth, password: password })
    return res;
}

const loginUser = (valueLogin, password) => {
    let res = axios.post("/login", { valueLogin: valueLogin, password: password })
    return res;
}

const logoutUser = () => {
    let res = axios.post("/logout")
    return res;
}

const getAllUser = (page, limit) => {
    let res = axios.get(`/user/show-all?page=${page}&limit=${limit}`)
    return res;
}

const createNewUser = (user) => {
    let res = axios.post(`/user/create`, user)
    return res;
}

const updateUser = (user) => {
    let res = axios.put(`/user/update`, user)
    return res;
}

const deleteUser = (id) => {
    let res = axios.delete("/user/delete", { data: { id: id } })
    return res
}

const getUserAccount = () => {
    let res = axios.get("/user/get-account")
    return res
}

const changeInfor = (id, email, groupId, typeAccount, changeData) => {
    let res = axios.post('/user/change-infor', { id: id, email: email, groupId: groupId, typeAccount: typeAccount, changeData: changeData })
    return res
}

const changePassword = (email, changeData) => {
    let res = axios.post('/user/change-password', { email: email, changeData: changeData })
    return res
}

const sendOTP = (email) => {
    let res = axios.post('/send-otp', { email: email })
    return res
}

const resetPassword = (email, codeOTP, newPassword, confirmPassword) => {
    let res = axios.post('/reset-password', { email: email, codeOTP: codeOTP, newPassword: newPassword, confirmPassword: confirmPassword })
    return res
}

export {
    registerNewUser, loginUser, getAllUser, createNewUser, updateUser,
    deleteUser, getUserAccount, logoutUser, changeInfor, changePassword,
    sendOTP, resetPassword
}