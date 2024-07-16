import { useEffect, useState } from "react";
import { getAllUser, deleteUser } from "../../services/userService";
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";
import ModalCreate from "./ModalCreate";
import ModalDelete from "./ModalDelete";

const User = (props) => {
    // Data
    const [listUser, setListUser] = useState([])

    // Pagination
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(2)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // Confirm Delete
    const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false)
    const [dataModalDelete, setDataModal] = useState({})

    // Confirm Create
    const [isShowCreate, setisShowCreate] = useState(false)

    const fetchData = async () => {
        let res = await getAllUser(page, limit)
        if (res) {
            setTotalPage(res.data.DT.totalPage)
            setOffset(res.data.DT.offset)
            setListUser(res.data.DT.users)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page])

    const handlePageClick = (event) => {
        setPage(event.selected + 1)
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
            await deleteUser(dataModalDelete.id)
            setIsShowConfirmDelete(false)
            await fetchData()
            toast.success("Delete user successfully!")
        } else {
            setIsShowConfirmDelete(false)
            await fetchData()
            toast.error("Can't delete user, please try again!")
        }
    }

    // Create
    const showCreate = () => {
        setisShowCreate(true)
    }

    const hideCreate = () => {
        setisShowCreate(false)
    }

    const handleCreateUser = () => {
        alert("Create success")
    }



    return (
        <>
            <div className="User container">
                <div className="user-header row mt-3">
                    <div className="title col-10">
                        <span className="fs-2 fw-medium">User List</span>
                    </div>
                    <div className="action col-2">
                        <button className="btn btn-primary">Refesh</button>
                        <button className="btn btn-success mx-2" onClick={()=> {showCreate()}}>Create</button>
                    </div>
                </div>

                <div className="user-body mt-3 row">
                    <table className="table table-striped table-hover">
                        <thead className="">
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Id</th>
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
                                            <td>{index + 1 + offset}</td>
                                            <td>{item.id}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.username}</td>
                                            <td>{item.Group ? item.Group.name : ""}</td>
                                            <td>
                                                <button className="btn btn-warning">Edit</button>
                                                <button className="btn btn-danger mx-2" onClick={() => showConfirmDelete(item)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                    : <tr>
                                        <td colSpan={6}>Loading...</td>
                                    </tr>
                                }
                            </>
                        </tbody>
                    </table>
                </div>

                <div className="user-footer">
                    <div className="pagination justify-content-center">
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

            <ModalCreate
                show={isShowCreate}
                hideCreate={hideCreate}
                handleCreateUser={handleCreateUser}
            />

            <ModalDelete
                show={isShowConfirmDelete}
                hideConfirm={hideConfirmDelete}
                handleDeleteUser={handleDeleteUser}
                dataModal={dataModalDelete.email}
            />

        </>

    )
}
export default User;