import './Role.scss'
import { useState, useEffect } from 'react'
import ModalUpdate from './ModalUpdate';
import { toast } from "react-toastify";
import { getAllRoles } from '../../services/rolesService'
import ReactPaginate from 'react-paginate';

const Role = () => {
    const [listRole, setListRole] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(8)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [isShowUpdate, setIsShowUpdate] = useState(false)
    const [dataModalUpdate, setDataModalUpdate] = useState({
        id: '',
        url: '',
        description: ''
    })

    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }
    const handleSetLimit = (event) => {
        setLimit(event)
        setPage(1)
    }
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
    const handleRefresh = async () => {
        await fetchRoles()
    }
    const fetchRoles = async () => {
        let data = await getAllRoles(page, limit)
        if (data && data.EC === "1") {
            setOffset(data.DT.offset)
            setTotalPage(data.DT.totalPage)
            setListRole(data.DT.roles)
        } else {
            toast.error(data.EM)
        }
    }
    useEffect(() => {
        fetchRoles()
    }, [page, limit])

    return (
        <>
            <div className='content-card-body'>
                <div className='row'>
                    <div className='col-12 d-flex justify-content-center col-sm-4 d-sm-flex justify-content-sm-start'>
                        <span className='fw-bold fs-4 text-info'><i className="fa fa-wrench"></i> Role</span>
                    </div>
                    <div className='col-12 d-flex justify-content-center mt-2 col-sm-8 d-sm-flex justify-content-sm-end mt-sm-0'>
                        <button className='btn btn-primary fw-medium' onClick={() => { handleRefresh() }}><i className="fa fa-refresh"></i> Refresh</button>
                    </div>
                </div>

                <hr />

                <div className='table-responsive' style={{ minHeight: '495px' }}>
                    <table className="table table-striped table-hover">
                        <thead className="">
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">URL</th>
                                <th scope="col">Description</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {listRole && listRole.length > 0 ? listRole.map((item, index) => {
                                    return (
                                        <tr key={"row" + index} className='text-nowrap'>
                                            <td>{index + 1 + offset}</td>
                                            <td>{item.url}</td>
                                            <td>{item.description}</td>
                                            <td>
                                                <div className='text-nowrap'>
                                                    <button className="btn btn-warning text-white" onClick={() => showUpdate(item)}><i className="fa fa-pencil-square-o"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                                    : <tr>
                                        <td colSpan={5} className="text-center fst-italic">No roles available.....</td>
                                    </tr>
                                }
                            </>
                        </tbody>
                    </table>
                </div>

                {
                    totalPage > 0 &&
                    <div className='row'>
                        <div className="col-12 d-flex align-items-center justify-content-center mt-2 col-md-6 d-md-flex justify-content-md-start mt-md-0 gap-2">
                            <label className="fw-medium">Limit records: </label>
                            <select className="form-select-sm mx-2"
                                value={limit}
                                onChange={(event) => handleSetLimit(event.target.value)}
                            >
                                <option value={8}>8</option>
                                <option value={16}>16</option>
                            </select>
                        </div>

                        <div className="col-12 d-flex align-items-center justify-content-center mt-2 col-md-6 d-md-flex justify-content-md-end mt-md-2">
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
                        </div>
                    </div>
                }
            </div>

            <ModalUpdate
                show={isShowUpdate}
                onHide={hideUpdate}
                data={dataModalUpdate}
                fetchData={fetchRoles}
            />
        </>
    )
}

export default Role;