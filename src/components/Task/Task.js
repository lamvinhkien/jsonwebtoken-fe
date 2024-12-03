import { useState, useEffect, useContext } from 'react';
import './Task.scss';
import './InputFile.scss';
import { getAllTask } from '../../services/taskService';
import moment from 'moment';
import ModalAddTask from './ModalAddTask';
import ModalViewTask from './ModalViewTask';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';

const Task = (props) => {
    const [task, setTask] = useState([])
    const [isShowCreate, setIsShowCreate] = useState(false)
    const [isShowDetail, setIsShowDetail] = useState(false)
    const [taskDetail, setTaskDetail] = useState({})
    
    const { user } = useContext(UserContext)

    const showCreate = () => {
        setIsShowCreate(!isShowCreate)
    }
    const showDetail = (task) => {
        setTaskDetail(task)
        setIsShowDetail(!isShowDetail)
    }
    const fetchTask = async () => {
        let res = await getAllTask()

        if (res && res.EC === "1") {
            setTask(res.DT)
            return
        }
        toast.error(res.EM)
    }
    const handleRefresh = async () => {
        await fetchTask()
    }

    useEffect(() => {
        fetchTask()
    }, [])

    return (
        <div className='Task container'>
            <div className="task-header row mt-3">
                <div className="title col-9">
                    <span className="fs-2 fw-medium"><i className="fa fa-tasks"></i> Tasks List</span>
                </div>
                <div className="action col-3">
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
                    <button className="btn btn-primary mx-2" onClick={() => handleRefresh()}><i className="fa fa-refresh"></i> Refresh</button>
                </div>
            </div>

            <div className='separator'>
                <span className="fs-4 fw-medium"><i className="fa fa-circle" style={{ color: '#fffc3f' }}></i> In Progress</span>
            </div>

            <div className='task-body row mt-3'>
                {
                    task && task.length > 0 && task.map((item, index) => {
                        if (+moment(new Date(item.endDate)).format('x') > Date.now()) {
                            return (
                                <div className='col-3 mb-3' key={index}>
                                    <div className="card text-center">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fa fa-circle" style={{ color: '#fffc3f' }}></i>
                                            </div>
                                            <div>
                                                Task end at: <span className='fw-medium'>{moment(item.endDate).format('lll')}</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.description}</p>
                                            <button className="btn btn-primary" onClick={() => { showDetail(item) }}>View Details</button>
                                        </div>
                                        <div className="card-footer text-body-secondary">
                                            <div>
                                                <span className='fst-italic'>By:</span> <span className='fw-medium'>{item.postBy}</span>.
                                            </div>
                                            <div>
                                                <span className='fst-italic'>At:</span> <span className='fw-medium'>{moment(item.createdAt).format('lll')}</span>.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>

            <div className='separator'>
                <span className="fs-4 fw-medium"><i className="fa fa-circle" style={{ color: '#ff3a3a' }}></i> Out of time</span>
            </div>

            <div className='task-body row mt-3'>
                {
                    task && task.length > 0 && task.map((item, index) => {
                        if (+moment(new Date(item.endDate)).format('x') <= Date.now()) {
                            return (
                                <div className='col-3 mb-3' key={index}>
                                    <div className="card text-center">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fa fa-circle" style={{ color: '#ff3a3a' }}></i>
                                            </div>
                                            <div>
                                                Task end at: <span className='fw-medium'>{moment(item.endDate).format('lll')}</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.description}</p>
                                            <button className="btn btn-primary" onClick={() => { showDetail(item) }}>View Details</button>
                                        </div>
                                        <div className="card-footer text-body-secondary">
                                            <div>
                                                <span className='fst-italic'>By:</span> <span className='fw-medium'>{item.postBy}</span>.
                                            </div>
                                            <div>
                                                <span className='fst-italic'>At:</span> <span className='fw-medium'>{moment(item.createdAt).format('lll')}</span>.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>

            <ModalAddTask
                show={isShowCreate}
                hide={showCreate}
                fetch={fetchTask}
            />

            <ModalViewTask
                show={isShowDetail}
                hide={showDetail}
                dataModal={taskDetail}
                fetch={fetchTask}
                permission={user ? user.data : ''}
            />
        </div>
    )
}

export default Task;