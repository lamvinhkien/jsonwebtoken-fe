import axios from "../Setup/axios";

const createRoles = (roles) => {
    let res = axios.post('/api/role/create', roles)
    return res
}

const getAllRoles = (page, limit) => {
    let res = axios.get(`/api/role/show-all?page=${page}&limit=${limit}`)
    return res
}

const deleteRole = (id) => {
    let res = axios.delete('/api/role/delete', { data: { id: id } })
    return res
}

const updateRole = (role) => {
    let res = axios.put('/api/role/update', role)
    return res
}

export { createRoles, getAllRoles, deleteRole, updateRole }