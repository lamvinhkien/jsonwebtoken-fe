import { useEffect, useState, useContext } from "react";
import { getAllUser, deleteUser } from "../../services/userService";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import ModalUser from "./ModalUser";
import ModalDelete from "./ModalDelete";
import { UserContext } from "../Context/Context";

const User = (props) => {
    // Data
    const [listUser, setListUser] = useState([])

    // Pagination
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(8)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // Confirm Delete
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false)
    const [dataModalDelete, setDataModal] = useState({})

    // Confirm Create and Update
    const [isShowCreate, setisShowCreate] = useState(false)
    const [isShowModal, setIsShowModal] = useState("UPDATE")
    const [dataModalUpdate, setDataModalUpdate] = useState({})

    const { user } = useContext(UserContext)

    const fetchData = async () => {
        let res = await getAllUser(page, limit)
        if (res.EC === "1") {
            setTotalPage(res.DT.totalPage)
            setOffset(res.DT.offset)
            setListUser(res.DT.users)
        } else {
            toast.error(res.EM)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, limit])


    // Handle paginations
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }

    const handleSetLimit = (event) => {
        setLimit(event)
        setPage(1)
    }


    // Delete
    const showConfirmDelete = (user) => {
        setIsShowConfirmDelete(true)
        setDataModal(user)
    }

    const hideConfirmDelete = () => {
        setIsShowConfirmDelete(false)
        setDataModal({})
    }

    const handleDeleteUser = async () => {
        if (dataModalDelete) {
            let res = await deleteUser(dataModalDelete.id)
            if (res.EC === "1") {
                setIsShowConfirmDelete(false)
                await fetchData()
                toast.success("Delete user successfully!")
            } else {
                setIsShowConfirmDelete(false)
                toast.error(res.EM)
            }

        } else {
            setIsShowConfirmDelete(false)
            await fetchData()
            toast.error("Can't delete user, please try again!")
        }
    }


    // Create
    const showCreate = () => {
        setisShowCreate(true)
        setIsShowModal("CREATE")
    }

    const hideCreate = () => {
        setDataModalUpdate({
            email: "",
            password: "",
            phone: "",
            username: "",
            address: "",
            gender: "Male",
            group: ""
        })
        setisShowCreate(false)
    }


    //Update
    const showUpdate = (user) => {
        setDataModalUpdate(user)
        setIsShowModal("UPDATE")
        setisShowCreate(true)
    }

    const handleRefresh = async () => {
        await fetchData()
    }


    return (
        <>
            <div className="User container">
                <div className="user-header row mt-3">
                    <div className="title col-9">
                        <span className="fs-2 fw-medium"><i className="fa fa-users"></i> Users List</span>
                    </div>
                    <div className="action col-3">
                        <button className="btn btn-success" onClick={() => { showCreate() }}><i className="fa fa-plus-circle"></i> Add new user</button>
                        <button className="btn btn-primary mx-2" onClick={() => handleRefresh()}><i className="fa fa-refresh"></i> Refresh</button>
                    </div>
                </div>

                <div className="user-body mt-3 row">
                    <table className="table table-striped table-hover">
                        <thead className="">
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Username</th>
                                <th scope="col">Group</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {listUser && listUser.length > 0 ? listUser.map((item, index) => {
                                    return (
                                        <tr key={"row" + index}>
                                            <td className={ user.email === item.email ? 'text-primary fw-medium' : '' }>{index + 1 + offset}</td>
                                            <td className={ user.email === item.email ? 'text-primary fw-medium' : '' }>{item.email}</td>
                                            <td className={ user.email === item.email ? 'text-primary fw-medium' : '' }>{item.phone}</td>
                                            <td className={ user.email === item.email ? 'text-primary fw-medium' : '' }>{item.username}</td>
                                            <td className={ user.email === item.email ? 'text-primary fw-medium' : '' }>{item.Group ? item.Group.name : ""}</td>
                                            <td>
                                                {
                                                    item.Group.name === 'Leader' || user.email === item.email || item.Group.name === user.data.name || user.data.name === 'Customer'  ? <><button className="btn opacity-0">.</button></>
                                                        :
                                                        <>
                                                            <button className="btn btn-warning text-white" onClick={() => showUpdate({ ...item, group: item.Group ? item.Group.id : null, gender: item.sex })}><i className="fa fa-pencil-square-o"></i></button>
                                                            <button className="btn btn-danger mx-2" onClick={() => showConfirmDelete(item)}><i className="fa fa-trash-o"></i></button>
                                                        </>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                                    : <tr>
                                        <td colSpan={7} className="text-center">Loading data........</td>
                                    </tr>
                                }
                            </>
                        </tbody>
                    </table>
                </div>

                <div className="user-footer d-flex justify-content-between">
                    <div className="">
                        <label className="fw-medium">Set limit values show: </label>
                        <select className="form-select-sm mx-2"
                            value={limit}
                            onChange={(event) => handleSetLimit(event.target.value)}
                        >
                            <option value={8}>8</option>
                            <option value={16}>16</option>
                        </select>
                    </div>

                    <div className="pagination">
                        <>
                            {
                                totalPage > 0 &&
                                <ReactPaginate
                                    nextLabel="next >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPage}
                                    previousLabel="< previous"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                />
                            }
                        </>
                    </div>
                </div>
            </div>

            <ModalUser
                show={isShowCreate}
                hideCreate={hideCreate}
                showModal={isShowModal}
                dataModalUpdate={dataModalUpdate}
                fetchData={fetchData}
            />

            <ModalDelete
                show={isShowConfirmDelete}
                hideConfirm={hideConfirmDelete}
                handleDeleteUser={handleDeleteUser}
                dataModal={dataModalDelete.email}
                title={'user'}
            />

        </>

    )
}
export default User;