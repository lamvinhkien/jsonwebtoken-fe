import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../Context/Context';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { updateTask, getDocument, deleteTask } from '../../services/taskService';
import { toast } from 'react-toastify';
import ModalDeleteTask from './ModalDeleteTask';
import ModalTaskReport from './TaskReport';
import './Task.scss';

const TaskDetail = (props) => {
    const history = useHistory()
    const location = useLocation()
    const params = useParams()
    const detailData = location.state || {}
    const [isShowReport, setIsShowReport] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [endAt, setEndAt] = useState('')
    const [postBy, setPostBy] = useState('')
    const [postAt, setPostAt] = useState('')
    const [existingFiles, setExistingFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [isShowDelete, setIsShowDelete] = useState(false)
    const [isCheckRole, setIsCheckRole] = useState(false)
    const defaultIsValidInput = {
        title: true,
        description: true,
        endAt: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)
    const [indexLoadFiles, setIndexLoadFiles] = useState(0)
    const { user } = useContext(UserContext)

    const handleBack = () => {
        setTitle('')
        setDescription('')
        setEndAt('')
        setPostBy('')
        setPostAt('')
        setExistingFiles([])
        setNewFiles([])
        setFilesToDelete([])
        setIsValidInput(defaultIsValidInput)
        history.goBack()
    }
    const handleChangeTitle = (event) => {
        setTitle(event)
    }
    const handleChangeDes = (event) => {
        setDescription(event)
    }
    const handleChangeEnd = (event) => {
        setEndAt(event)
    }
    const handleNewFileChange = (event) => {
        const files = Array.from(event.target.files);
        setNewFiles((prev) => [...prev, ...files]);
    };
    const handleRemoveExistingFile = (fileToRemove) => {
        setFilesToDelete((prev) => [...prev, fileToRemove]); // Thêm vào danh sách cần xóa
        setExistingFiles((prev) => prev.filter((file) => file !== fileToRemove)); // Loại khỏi danh sách hiển thị
        if (existingFiles.length > 0) {
            setIndexLoadFiles(indexLoadFiles - 1)
        }
    };
    const handleRemoveNewFile = (indexToRemove) => {
        setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };
    const handleGetDocument = async (id) => {
        let res = await getDocument(id)
        if (res && res.EC === "1") {
            setExistingFiles(res.DT)
            setIndexLoadFiles(res.DT.length)
        }
    }
    const handleUpdate = async () => {
        if (title === '') { setIsValidInput({ ...defaultIsValidInput, title: isValidInput.title = false }); toast.error('Please enter Title.'); return; }
        if (description === '') { setIsValidInput({ ...defaultIsValidInput, description: isValidInput.description = false }); toast.error('Please enter Description.'); return; }
        if (endAt === '') { setIsValidInput({ ...defaultIsValidInput, endAt: isValidInput.endAt = false }); toast.error('Please set end time.'); return; }

        let formData = new FormData();
        formData.append('id', params && params.id ? params.id : '')
        formData.append('title', title)
        formData.append('description', description)
        formData.append('endDate', endAt)
        formData.append('filesToDelete', JSON.stringify(filesToDelete));
        newFiles.forEach((file) => formData.append('files', file));

        let res = await updateTask(formData)
        if (res && res.EC === "1") {
            toast.success(res.EM)
            setIsValidInput(defaultIsValidInput)
            return
        }
        toast.error(res.EM)
    }
    const handleShowDelete = () => {
        setIsShowDelete(!isShowDelete)
    }
    const handleDeleteTask = async () => {
        if (params && params.id !== '') {
            let res = await deleteTask(params.id)
            if (res && res.EC === "1") {
                handleShowDelete()
                handleBack()
                toast.success(res.EM)
                return
            }
            toast.error(res.EM)
        }
        toast.error("Not found Task.")
    }
    const handleCheckPermission = (permission) => {
        if (permission?.Roles?.length > 0) {
            const urls = new Set(permission.Roles.map(item => item.url))
            const check = urls.has('/task/update') && urls.has('/task/delete')
            setIsCheckRole(check)
        }
    }
    const handleShowReport = () => {
        setIsShowReport(!isShowReport)
    }

    useEffect(() => {
        if (params?.id && user?.data && detailData) {
            setTitle(detailData.title)
            setDescription(detailData.description)
            setEndAt(detailData.endAt)
            setPostBy(detailData.postBy)
            setPostAt(moment(detailData.postAt).format('lll'))
            handleGetDocument(params.id)
            handleCheckPermission(user.data)
        }
    }, [params?.id, user?.data, detailData])


    return (
        <>
            <div className='content-card-body'>
                {
                    isCheckRole === true ?
                        <>
                            <div className='row'>
                                <div className="col-12 fs-4 fw-bold text-info">
                                    <div className="hiddenTitleUrl">
                                        <i className="fa fa-info-circle"></i> {title}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className="col-lg-8 mb-3">
                                    <label className="form-label">Title:</label>
                                    <input type="text" className={isValidInput.title === true ? 'form-control' : 'form-control is-invalid'}
                                        value={title} onChange={(e) => { handleChangeTitle(e.target.value) }} />
                                </div>
                                <div className="col-lg-4 mb-3">
                                    <label className="form-label">Due:</label>
                                    <input type="datetime-local" className={isValidInput.endAt === true ? 'form-control' : 'form-control is-invalid'}
                                        value={moment(endAt).format('YYYY-MM-DDTHH:mm')} onChange={(e) => { handleChangeEnd(e.target.value) }} />
                                </div>
                                <div className="col-lg-12">
                                    <div className='row align-items-center'>
                                        <div className='col-sm-9 d-sm-flex justify-content-sm-start'>
                                            <label className="form-label">Documents:</label>
                                        </div>
                                        <div className='col-sm-3 d-sm-flex justify-content-sm-end'>
                                            <label htmlFor="file-upload" className="custom-file-upload btn btn-primary btn-sm w-100">
                                                Upload files
                                            </label>
                                            <input type='file' id="file-upload" multiple onChange={handleNewFileChange} />
                                        </div>
                                    </div>
                                    <div className='table-responsive'>
                                        <table className='table'>
                                            <tbody>
                                                {
                                                    existingFiles.length === 0 && newFiles.length === 0 ?
                                                        <tr>
                                                            <td className='fst-italic text-center'>No files available.....</td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {
                                                                existingFiles.map((file, index) => (
                                                                    <tr key={index} className='text-nowrap'>
                                                                        <td>
                                                                            {index + 1}.
                                                                        </td>
                                                                        <td>
                                                                            {file.FilePath.replace(/^files-\d+-/, '')}
                                                                        </td>
                                                                        <td className='text-end text-nowrap'>
                                                                            <a href={process.env.REACT_APP_URL_FILES_BE + file.FilePath} className='btn btn-primary btn-sm'>
                                                                                <i className="fa fa-download"></i>
                                                                            </a>
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                style={{ marginLeft: "7px" }}
                                                                                onClick={() => handleRemoveExistingFile(file)}
                                                                            >
                                                                                <i className="fa fa-trash-o"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                            {
                                                                newFiles.map((file, index) => (
                                                                    <tr key={`new-${index}`}>
                                                                        <td>
                                                                            {index + 1 + indexLoadFiles}.
                                                                        </td>
                                                                        <td className='text-nowrap'>
                                                                            {file.name}
                                                                        </td>
                                                                        <td className='text-end text-nowrap'>
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                onClick={() => handleRemoveNewFile(index)}
                                                                            >
                                                                                <i className="fa fa-trash-o"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-lg-12 mb-3">
                                    <label className="form-label">Description:</label>
                                    <textarea className={isValidInput.description === true ? 'form-control' : 'form-control is-invalid'}
                                        rows="3" value={description} onChange={(e) => { handleChangeDes(e.target.value) }}></textarea>
                                </div>
                                <div className='col-lg-12 mb-2'>
                                    <div className='row'>
                                        <div className="col-12 col-lg-6">
                                            <span className="fst-italic">Posted by:</span>&nbsp;<span className='fw-medium'>{postBy}</span>
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            <span className="fst-italic">Posted on:</span>&nbsp;<span className='fw-medium'>{postAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-12 d-flex justify-content-center col-sm-3 d-sm-flex justify-content-sm-start mt-sm-0'>
                                    <Button onClick={() => { handleShowReport() }} variant='primary'>View Reports</Button>
                                </div>
                                <div className='col-12 d-flex justify-content-center mt-2 col-sm-9 d-sm-flex justify-content-sm-end mt-sm-0 gap-2'>
                                    <Button onClick={handleBack} variant='secondary'>Back</Button>
                                    <Button onClick={handleShowDelete} variant='danger'>Delete</Button>
                                    <Button onClick={handleUpdate} variant='success'>Update</Button>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className='row text-center'>
                                <div className='col-12 fs-4 fw-bold text-info'>
                                    <i className="fa fa-info-circle"></i> Task Details
                                </div>
                                <div className='col-12 fs-5 fw-medium mt-2'>
                                    {title}
                                </div>
                                <div className='mt-2 col-lg-4 mt-lg-2'>
                                    <span className='fst-italic'>Due:</span>&nbsp;<span className='fw-bold text-danger'>{moment(endAt).format('lll')}</span>
                                </div>
                                <div className='col-lg-4 mt-lg-2'>
                                    <span className='fst-italic'>Posted by:</span>&nbsp;<span className='fw-medium'>{postBy}</span>
                                </div>
                                <div className='col-lg-4 mt-lg-2'>
                                    <span className='fst-italic'>Posted on:</span>&nbsp;<span className='fw-medium'>{moment(postAt).format('lll')}</span>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-12 fs-5 fw-bold text-info text-center'>
                                    <i className="fa fa-file-text"></i> Documents
                                </div>
                                <div className='col-12 mt-1'>
                                    <div className='table-responsive'>
                                        <table className='table'>
                                            <tbody>
                                                {
                                                    existingFiles.length === 0 && newFiles.length === 0 ?
                                                        <tr>
                                                            <td className='fst-italic text-center'>No files available.....</td>
                                                        </tr>
                                                        :
                                                        <>
                                                            {
                                                                existingFiles.map((file, index) => (
                                                                    <tr key={index} className='text-nowrap'>
                                                                        <td>
                                                                            {index + 1}.
                                                                        </td>
                                                                        <td>
                                                                            {file.FilePath.replace(/^files-\d+-/, '')}
                                                                        </td>
                                                                        <td className='text-end text-nowrap'>
                                                                            <a href={process.env.REACT_APP_URL_FILES_BE + file.FilePath} className='btn btn-primary btn-sm'>
                                                                                <i className="fa fa-download"></i>
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-12 fs-5 fw-bold text-info text-center'>
                                    Description
                                </div>
                                <div className='col-12 mt-1'>
                                    {description}
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-lg-12 d-flex justify-content-between align-items-center'>
                                    <Button onClick={() => { handleShowReport() }} variant='primary'>Report</Button>
                                    <Button onClick={handleBack} variant='secondary'>Back</Button>
                                </div>
                            </div>
                        </>
                }
            </div>

            <ModalTaskReport
                show={isShowReport}
                hide={handleShowReport}
                idTask={params ? params.id : ''}
            />

            <ModalDeleteTask
                show={isShowDelete}
                hide={handleShowDelete}
                delete={handleDeleteTask}
            />
        </>
    )
}

export default TaskDetail;