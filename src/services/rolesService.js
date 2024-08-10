import axios from "../Setup/axios";

const getAllRoles = (page, limit) => {
    let res = axios.get(`/api/role/show-all?page=${page}&limit=${limit}`)
    return res
}

const getAllRolesWithoutPage = () => {
    let res = axios.get(`/api/role/get-all`)
    return res
}


const updateRole = (role) => {
    let res = axios.put('/api/role/update', role)
    return res
}

export { getAllRoles, updateRole, getAllRolesWithoutPage }