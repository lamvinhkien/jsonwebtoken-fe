import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getGroupWithPagination, deleteGroup } from '../../services/groupService'
import ReactPaginate from 'react-paginate';
import ModalDelete from '../User/ModalDelete';
import ModalUpdate2 from './ModalUpdate2';
import { toast } from "react-toastify";

const TableGroup = forwardRef((props, ref) => {

    // Groups data
    const [listGroup, setListGroup] = useState([])

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
        name: '',
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
    const handleDeleteGroup = async () => {
        if (dataModalDelete) {
            let res = await deleteGroup(dataModalDelete.id)

            if (res && res.EC === "1") {
                fetchGroups()
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
            name: '',
            description: ''
        })
    }


    // Handle fetch group by Method Save from Parent (Group component)
    useImperativeHandle(ref, () => ({
        fetchGroupsBySave() {
            fetchGroups()
        }
    }))


    // Fetch data roles
    const fetchGroups = async () => {
        let data = await getGroupWithPagination(page, limit)
        if (data && data.EC === "1") {
            setOffset(data.DT.offset)
            setTotalPage(data.DT.totalPage)
            setListGroup(data.DT.roles)
        } else {
            toast.error(data.EM)
        }
    }
    useEffect(() => {
        fetchGroups()
    }, [page, limit])



    return (
        <div className="Table-Group">
            <div className='table-responsive' style={{ minHeight: '330px' }}>
                <table className="table table-striped table-hover">
                    <thead className="">
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <>
                            {listGroup && listGroup.length > 0 ? listGroup.map((item, index) => {
                                return (
                                    <tr key={"row" + index} className='text-nowrap'>
                                        <td>{index + 1 + offset}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <button className="btn btn-warning text-white mx-2" onClick={() => showUpdate(item)}><i className="fa fa-pencil-square-o"></i></button>
                                            <button className="btn btn-danger" onClick={() => showConfirmDelete(item)}><i className="fa fa-trash-o"></i></button>
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
            </div>

            <div className='row'>
                <div className="col-12 d-flex align-items-center justify-content-center mt-2 col-md-6 d-md-flex justify-content-md-start mt-md-0 gap-2">
                    <label className="fw-medium">Limit records: </label>
                    <select className="form-select-sm mx-2"
                        value={limit}
                        onChange={(event) => handleSetLimit(event.target.value)}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>
                </div>

                <div className="col-12 d-flex align-items-center justify-content-center mt-2 col-md-6 d-md-flex justify-content-md-end mt-md-2">
                    <>
                        {
                            totalPage > 0 &&
                            <ReactPaginate
                                nextLabel=">"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={1}
                                marginPagesDisplayed={1}
                                pageCount={totalPage}
                                previousLabel="<"
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
                                forcePage={page - 1}
                            />
                        }
                    </>
                </div>
            </div>

            <ModalDelete
                title={`group`}
                show={isShowDelete}
                hideConfirm={hideConfirmDelete}
                handleDeleteUser={handleDeleteGroup}
                dataModal={dataModalDelete.name}
            />

            <ModalUpdate2
                show={isShowUpdate}
                onHide={hideUpdate}
                data={dataModalUpdate}
                fetchData={fetchGroups}
            />
        </div>
    )
})

export default TableGroup;