import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getAllRoles, deleteRole } from '../../services/rolesService'
import ReactPaginate from 'react-paginate';
import ModalDelete from '../User/ModalDelete';
import ModalUpdate from './ModalUpdate';
import { toast } from "react-toastify";

const TableRole = forwardRef((props, ref) => {

    // Roles data
    const [listRole, setListRole] = useState([])

    // Pagination
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // Confirm Delete
    const [isShowDelete, setIsShowDelete] = useState(false)
    const [dataModalDelete, setDataModalDelete] = useState({})

    // Confirm Update
    const [isShowUpdate, setIsShowUpdate] = useState(false)
    const [dataModalUpdate, setDataModalUpdate] = useState({
        id: '',
        url: '',
        description: ''
    })


    // Handle Pagination
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }
    const handleSetLimit = (event) => {
        setLimit(event)
        setPage(1)
    }


    // Handle Confirm Delete
    const showConfirmDelete = (item) => {
        setIsShowDelete(true)
        setDataModalDelete(item)
    }
    const hideConfirmDelete = () => {
        setIsShowDelete(false)
        setDataModalDelete({})
    }
    const handleDeleteRole = async () => {
        if (dataModalDelete) {
            let res = await deleteRole(dataModalDelete.id)

            if (res && res.EC === "1") {
                fetchRoles()
                toast.success(res.EM)
            } else {
                toast.error(res.EM)
            }
            setDataModalDelete({})
            setIsShowDelete(false)
        }
    }


    // Handle Confirm Update
    const showUpdate = (item) => {
        setIsShowUpdate(true)
        setDataModalUpdate(item)
    }

    const hideUpdate = () => {
        setIsShowUpdate(false)
        setDataModalUpdate({
            id: '',
            url: '',
            description: ''
        })
    }


    // Handle fetch role by Method Save from Parent (Role component)
    useImperativeHandle(ref, () => ({
        fetchRolesBySave() {
            fetchRoles()
        }
    }))


    // Fetch data roles
    const fetchRoles = async () => {
        let data = await getAllRoles(page, limit)
        if (data && data.EC === "1") {
            setOffset(data.DT.offset)
            setTotalPage(data.DT.totalPage)
            setListRole(data.DT.roles)
        }
    }
    useEffect(() => {
        fetchRoles()
    }, [page, limit])



    return (
        <div className="Table-Role">
            <table className="table table-striped table-hover">
                <thead className="">
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Id</th>
                        <th scope="col">URL</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <>
                        {listRole && listRole.length > 0 ? listRole.map((item, index) => {
                            return (
                                <tr key={"row" + index}>
                                    <td>{index + 1 + offset}</td>
                                    <td>{item.id}</td>
                                    <td>{item.url}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <button className="btn btn-warning text-white" onClick={() => showUpdate(item)}><i className="fa fa-pencil-square-o"></i></button>
                                        <button className="btn btn-danger mx-2" onClick={() => showConfirmDelete(item)}><i className="fa fa-trash-o"></i></button>
                                    </td>
                                </tr>
                            )
                        })
                            : <tr>
                                <td colSpan={5} className="text-center">Loading data........</td>
                            </tr>
                        }
                    </>
                </tbody>
            </table>

            <div className="user-footer d-flex justify-content-between">
                <div className="">
                    <label className="fw-medium">Set limit values show: </label>
                    <select className="form-select-sm mx-2"
                        value={limit}
                        onChange={(event) => handleSetLimit(event.target.value)}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
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

            <ModalDelete
                title={`role`}
                show={isShowDelete}
                hideConfirm={hideConfirmDelete}
                handleDeleteUser={handleDeleteRole}
                dataModal={dataModalDelete.url}
            />

            <ModalUpdate
                show={isShowUpdate}
                onHide={hideUpdate}
                data={dataModalUpdate}
                fetchData={fetchRoles}
            />
        </div>
    )
})

export default TableRole;