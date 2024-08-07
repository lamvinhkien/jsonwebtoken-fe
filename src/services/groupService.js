import axios from "../Setup/axios";

const getAllGroup = () => {
    let res = axios.get("/api/group/show-all")
    return res
}

const getGroupWithRoles = (id) => {
    let res = axios.post("/api/group/get-group-with-roles", { id: id })
    return res
}

const assignRoleForGroup = (data) => {
    let res = axios.post("/api/group/assign-role-for-group", data)
    return res
}

export { getAllGroup, getGroupWithRoles, assignRoleForGroup }