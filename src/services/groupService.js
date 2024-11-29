import axios from "../Setup/axios";

const getAllGroup = () => {
    let res = axios.get("/group/show-all")
    return res
}

const getGroupWithPagination = (page, limit) => {
    let res = axios.get(`/group/show-all-with-pagination?page=${page}&limit=${limit}`)
    return res
}


const getGroupWithRoles = (id) => {
    let res = axios.post("/group/get-group-with-roles", { id: id })
    return res
}

const assignRoleForGroup = (data) => {
    let res = axios.post("/group/assign-role-for-group", data)
    return res
}

const createGroups = (groups) => {
    let res = axios.post('/group/create', groups)
    return res
}

const deleteGroup = (id) => {
    let res = axios.delete('/group/delete', { data: { id: id } })
    return res
}

const updateGroup = (group) => {
    let res = axios.put('/group/update', group)
    return res
}

export { getAllGroup, getGroupWithRoles, assignRoleForGroup, createGroups, deleteGroup, updateGroup, getGroupWithPagination }