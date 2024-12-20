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
        <div className='Task'>
            <div className="content-card-body">
                <div className='row align-items-center'>
                    <div className="col-12 d-flex justify-content-center col-sm-4 d-sm-flex justify-content-sm-start">
                        <span className="fs-4 fw-bold text-info"><i className="fa fa-tasks"></i> Tasks</span>
                    </div>
                    <div className="col-12 d-flex justify-content-center mt-2 col-sm-8 d-sm-flex justify-content-sm-end mt-sm-0 gap-2">
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
                <div className='row'>
                    {
                        task && task.length > 0 && task.map((item, index) => {
                            return (
                                <div className='col-lg-6 col-12 mb-3' key={index}>
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
                                            <h5 className="card-title text-center">{item.title}</h5>
                                            <p className="card-text hiddenContent">{item.description}</p>
                                            <div className='text-center'>
                                                <button className="btn btn-primary" onClick={() => { showDetail(item) }}>View Details</button>
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