import axios from "../Setup/axios";

const getAllTask = (page, limit) => {
    let res = axios.get(`/task/show-all?page=${page}&limit=${limit}`)
    return res;
}

const getTaskByCondition = (page, limit, condition) => {
    let res = axios.post(`/task/show-by-condition?page=${page}&limit=${limit}`, { condition: condition })
    return res;
}

const createTask = (formdata) => {
    let res = axios.post(`/task/create`, formdata)
    return res;
}

const getDocument = (id) => {
    let res = axios.post(`/task/get-document`, { id: id })
    return res;
}

const updateTask = (formdata) => {
    let res = axios.post(`/task/update`, formdata)
    return res;
}

const deleteTask = (id) => {
    let res = axios.post(`/task/delete`, { id: id })
    return res;
}

const getAllReportByManager = (id) => {
    let res = axios.post(`/task/show-all-report-by-manager`, { TaskID: id })
    return res;
}

const getAllReportByEmployee = (data) => {
    let res = axios.post(`/task/show-all-report-by-employee`, { TaskID: data.TaskID, UserID: data.UserID })
    return res;
}

const uploadTaskReport = (formdata) => {
    let res = axios.post(`/task/create-report`, formdata)
    return res;
}

const deleteTaskReport = (id) => {
    let res = axios.post(`/task/delete-report`, { id: id })
    return res;
}

export {
    getAllTask, createTask, updateTask, getDocument, deleteTask, getAllReportByManager, getAllReportByEmployee,
    uploadTaskReport, deleteTaskReport, getTaskByCondition
}