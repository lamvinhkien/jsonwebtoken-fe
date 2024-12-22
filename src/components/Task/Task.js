import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import './Task.scss';
import './InputFile.scss';
import { getAllTask } from '../../services/taskService';
import moment from 'moment';
import ModalAddTask from './ModalAddTask';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';
import ReactPaginate from 'react-paginate';

const Task = (props) => {
    const history = useHistory()
    const [task, setTask] = useState([])
    const [isShowCreate, setIsShowCreate] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    const { user } = useContext(UserContext)

    const showCreate = () => {
        setIsShowCreate(!isShowCreate)
    }
    const redirectToDetail = (item) => {
        history.push(`/task/${item.id}`, { title: item.title, description: item.description, endAt: item.endDate, postBy: item.postBy, postAt: item.createdAt })
    }
    const fetchTask = async () => {
        let res = await getAllTask(page, limit)
        if (res && res.EC === "1") {
            setTotalPage(res.DT.totalPage)
            setOffset(res.DT.offset)
            setTask(res.DT.task)
            return
        }
        toast.error(res.EM)
    }
    const handleRefresh = async () => {
        await fetchTask()
    }
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
    }
    const handleSetLimit = (event) => {
        setLimit(event)
        setPage(1)
    }

    useEffect(() => {
        fetchTask()
    }, [page, limit])

    return (
        <div className='Task'>
            <div className="content-card-body">
                <div className='row align-items-center'>
                    <div className="col-12 d-flex justify-content-center col-md-7 d-sm-flex justify-content-md-start fs-4 fw-bold text-info">
                        <span className=""><i className="fa fa-tasks"></i> Tasks List</span>
                    </div>
                    <div className="col-12 d-flex justify-content-center mt-2 col-md-5 d-sm-flex justify-content-md-end mt-md-0 gap-2">
                        {
                            user && user.data && user.data.Roles.length > 0 ? user.data.Roles.map((item, index) => {
                                if (item && item.url && item.url === '/task/create') {
                                    return (
                                        <button key={index} className="btn btn-success" onClick={() => { showCreate() }}><i className="fa fa-plus-circle"></i> Add new task</button>
                                    )
                                }
                            }) :
                                <></>
                        }
                        <button className="btn btn-primary" onClick={() => handleRefresh()}><i className="fa fa-refresh"></i> Refresh</button>
                    </div>
                </div>
                <hr />
                <div className='row' style={{ minHeight: '550px' }}>
                    {
                        task && task.length > 0 && task.map((item, index) => {
                            return (
                                <div className='col-lg-6 col-12 mb-4' key={index}>
                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <div>
                                                Task end at: <span className='fw-medium'>{moment(item.endDate).format('lll')}</span>
                                            </div>
                                            <div>
                                                <i className="fa fa-circle" style={{ color: '#fffc3f' }}></i>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title text-center hiddenTitle">{item.title}</h5>
                                            <p className="card-text hiddenContent">{item.description}</p>
                                            <div className='text-center'>
                                                <button className="btn btn-primary" onClick={() => { redirectToDetail(item) }}>View Details</button>
                                            </div>
                                        </div>
                                        <div className="card-footer text-body-secondary">
                                            <div className='row align-items-center'>
                                                <div className='col-lg-6 d-lg-flex justify-content-lg-start col-12 d-flex justify-content-center'>
                                                    <span className='fst-italic'>By:</span>&nbsp;<span className='fw-medium'>{item.postBy}</span>
                                                </div>
                                                <div className='col-lg-6 d-lg-flex justify-content-lg-end col-12 d-flex justify-content-center'>
                                                    <span className='fst-italic'>At:</span>&nbsp;<span className='fw-medium'>{moment(item.createdAt).format('lll')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-center col-md-6 d-md-flex justify-content-md-start mt-md-0 gap-2">
                        <label className="fw-medium">Limit records: </label>
                        <select className="form-select-sm"
                            value={limit}
                            onChange={(event) => handleSetLimit(event.target.value)}
                        >
                            <option value={4}>4</option>
                            <option value={8}>8</option>
                        </select>
                    </div>

                    <div className="col-12 d-flex align-items-center justify-content-center mt-3 col-md-6 d-md-flex justify-content-md-end mt-md-2">
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
                    </div>
                </div>
            </div>

            <ModalAddTask
                show={isShowCreate}
                hide={showCreate}
                fetch={fetchTask}
            />
        </div>
    )
}

export default Task;