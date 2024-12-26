import { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Task.scss';
import './InputFile.scss';
import { getTaskByCondition } from '../../services/taskService';
import moment from 'moment';
import ModalAddTask from './ModalAddTask';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';
import ReactPaginate from 'react-paginate';

const Task = (props) => {
    const history = useHistory()
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const savedCondition = params.get('condition');
    const savedPage = params.get('page');
    const savedLimit = params.get('limit');
    const [task, setTask] = useState([])
    const [isShowCreate, setIsShowCreate] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(4)
    const [offset, setOffset] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [condition, setCondition] = useState('')

    const { user } = useContext(UserContext)

    const showCreate = () => {
        setIsShowCreate(!isShowCreate)
    }
    const redirectToDetail = (item) => {
        history.push(`/task/${item.id}`, { title: item.title, description: item.description, endAt: item.endDate, postBy: item.postBy, postAt: item.createdAt })
    }
    const fetchTask = async (page, limit, condition) => {
        let res = await getTaskByCondition(page, limit, condition)
        if (res && res.EC === "1") {
            setTotalPage(res.DT.totalPage)
            setOffset(res.DT.offset)
            setTask(res.DT.task)
            return
        }
        toast.error(res.EM)
    }
    const handleRefresh = () => {
        fetchTask(savedPage ? savedPage : page, savedLimit ? savedLimit : limit, savedCondition ? savedCondition : condition)
    }
    const handlePageClick = (event) => {
        setPage(event.selected + 1)
        history.push(`?condition=${condition}&page=${event.selected + 1}&limit=${limit}`)
    }
    const handleSetLimit = (event) => {
        setLimit(event)
        history.push(`?condition=${condition}&page=${1}&limit=${event}`)
    }
    const handleChangeSelect = (value) => {
        setCondition(value)
        history.push(`?condition=${value}&page=${1}&limit=${limit}`)
    }

    useEffect(() => {
        if (!savedCondition && !savedPage && !savedLimit) {
            fetchTask(page, limit, condition)
        }
    }, [])

    useEffect(() => {
        if (savedCondition || savedPage || savedLimit) {
            setCondition(savedCondition)
            setPage(savedPage)
            setLimit(savedLimit)
            fetchTask(savedPage, savedLimit, savedCondition)
        }
    }, [location]);

    return (
        <div className='Task'>
            <div className="content-card-body">
                <div className='row align-items-center'>
                    <div className="col-12 col-lg-5 fs-4 fw-bold text-info">
                        <span className=""><i className="fa fa-tasks"></i> Tasks List</span>
                    </div>
                    <div className="col-12 mt-2 col-lg-7 mt-lg-0">
                        <div className='row justify-content-lg-end text-nowrap'>
                            {
                                user?.data?.Roles.length > 0 ? user.data.Roles.map((item, index) => {
                                    if (item && item.url && item.url === '/task/create') {
                                        return (
                                            <div className='col-12 col-lg-3' key={index}>
                                                <button className="btn btn-success w-100" onClick={() => { showCreate() }}><i className="fa fa-plus-circle"></i> Add</button>
                                            </div>
                                        )
                                    }
                                }) :
                                    <></>
                            }
                            <div className='col-12 mt-2 col-lg-4 mt-lg-0'>
                                <button className="btn btn-primary w-100" onClick={() => handleRefresh()}><i className="fa fa-refresh"></i> Refresh</button>
                            </div>
                            <div className='col-12 mt-2 col-lg-3 mt-lg-0'>
                                <select className='form-select border-info' value={condition} onChange={(event) => { handleChangeSelect(event.target.value) }}>
                                    <option value={''}>All</option>
                                    <option value={'gt'}>Due</option>
                                    <option value={'lt'}>Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row' style={{ minHeight: '550px' }}>
                    {
                        task && task.length > 0 && task.map((item, index) => {
                            return (
                                <div className='col-lg-6 col-12 mb-4' key={index + offset}>
                                    <div className="card">
                                        {
                                            moment().isAfter(moment(item.endDate)) ?
                                                <div className='card-header bg-danger-subtle'>
                                                    <span className='fst-italic'>Overdue:&nbsp;</span>
                                                    <span className='fw-medium'>{moment(item.endDate).format('MMM D, h:mm A')}</span>
                                                </div>
                                                :
                                                <div className='card-header bg-warning-subtle'>
                                                    <span className='fst-italic'>Due:&nbsp;</span>
                                                    <span className='fw-medium'>{moment(item.endDate).format('MMM D, h:mm A')}</span>
                                                </div>
                                        }
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
                                                    <span className='fst-italic'>by</span>&nbsp;<span className='fw-medium'>{item.postBy}</span>
                                                </div>
                                                <div className='col-lg-6 d-lg-flex justify-content-lg-end col-12 d-flex justify-content-center fw-medium'>
                                                    <span className='fst-italic'><i className="fa fa-clock-o"></i>&nbsp;{moment(item.createdAt).startOf('minute').fromNow()}</span>
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
            />
        </div>
    )
}

export default Task;