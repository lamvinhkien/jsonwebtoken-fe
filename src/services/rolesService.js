import axios from "../Setup/axios";

const getAllRoles = (page, limit) => {
    let res = axios.get(`/role/show-all?page=${page}&limit=${limit}`)
    return res
}

const getAllRolesWithoutPage = () => {
    let res = axios.get(`/role/show-all-for-assign`)
    return res
}


const updateRole = (role) => {
    let res = axios.put('/role/update', role)
    return res
}

export { getAllRoles, updateRole, getAllRolesWithoutPage }