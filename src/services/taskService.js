import axios from "../Setup/axios";

const getAllTask = () => {
    let res = axios.get(`/api/task/show-all`)
    return res;
}

const createTask = (formdata) => {
    let res = axios.post(`/api/task/create`, formdata)
    return res;
}

const getDocument = (id) => {
    let res = axios.post(`/api/task/get-document`, { id: id })
    return res;
}

const updateTask = (formdata) => {
    let res = axios.post(`/api/task/update`, formdata)
    return res;
}

const deleteTask = (id) => {
    let res = axios.post(`/api/task/delete`, { id: id })
    return res;
}

export {
    getAllTask, createTask, updateTask, getDocument, deleteTask
}