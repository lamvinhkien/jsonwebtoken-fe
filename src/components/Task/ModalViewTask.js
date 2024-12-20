import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import { updateTask, getDocument, deleteTask } from '../../services/taskService';
import { toast } from 'react-toastify';
import ModalDeleteTask from './ModalDeleteTask';
import ModalTaskReport from './ModalTaskReport';

const ModalViewTask = (props) => {
    const [idTask, setIdTask] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [endAt, setEndAt] = useState('')
    const [postBy, setPostBy] = useState('')
    const [postAt, setPostAt] = useState('')
    const [existingFiles, setExistingFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [isShowDelete, setIsShowDelete] = useState(false)
    const [permission, setPermission] = useState('')
    const [isCheckUpdate, setIsCheckUpdate] = useState(true)
    const [isCheckDelete, setIsCheckDelete] = useState(true)
    const defaultIsValidInput = {
        title: true,
        description: true,
        endAt: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)
    const [isShowTaskReport, setIsShowTaskReport] = useState(false)
    const [indexLoadFiles, setIndexLoadFiles] = useState(0)

    const handleHide = () => {
        props.hide()
        setTitle('')
        setDescription('')
        setEndAt('')
        setPostBy('')
        setPostAt('')
        setExistingFiles([])
        setNewFiles([])
        setFilesToDelete([])
        setIsValidInput(defaultIsValidInput)
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
        formData.append('id', idTask)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('endDate', endAt)
        formData.append('filesToDelete', JSON.stringify(filesToDelete));
        newFiles.forEach((file) => formData.append('files', file));

        let res = await updateTask(formData)
        if (res && res.EC === "1") {
            handleHide()
            props.fetch()
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
        if (idTask !== '') {
            let res = await deleteTask(idTask)
            if (res && res.EC === "1") {
                props.fetch()
                handleShowDelete()
                handleHide()
                toast.success(res.EM)
                return
            }
            toast.error(res.EM)
        }
        toast.error("Not found Task.")
    }
    const handleCheckPermission = () => {
        if (permission && permission.Roles.length > 0) {
            permission.Roles.find((item, index) => {
                if (item && item.url) {
                    if (item.url === '/task/update') {
                        setIsCheckUpdate(false)
                    }
                    if (item.url === '/task/delete') {
                        setIsCheckDelete(false)
                    }
                }
            })
        }
    }
    const handleShowTaskReport = () => {
        setIsShowTaskReport(!isShowTaskReport)
        props.hide()
    }

    useEffect(() => {
        if (props && props.dataModal && props.permission) {
            setIdTask(props.dataModal.id)
            setTitle(props.dataModal.title)
            setDescription(props.dataModal.description)
            setEndAt(props.dataModal.endDate)
            setPostBy(props.dataModal.postBy)
            setPostAt(moment(props.dataModal.createdAt).format('lll'))
            handleGetDocument(props.dataModal.id)
            setPermission(props.permission)
        }

        if (permission) {
            handleCheckPermission()
        }
    }, [props.dataModal, props.show])


    return (
        <div className="ModalViewTask">
            <Modal show={props.show} onHide={handleHide} aria-labelledby="contained-modal-title-vcenter" size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Task Detail
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    <Container>
                        <Row>
                            <div className="col-lg-6 mb-2">
                                <label className="form-label">Title:</label>
                                <input type="text" className={isValidInput.title === true ? 'form-control' : 'form-control is-invalid'}
                                    value={title} disabled={isCheckUpdate}
                                    onChange={(e) => { handleChangeTitle(e.target.value) }} />
                            </div>
                            <div className="col-lg-6 mb-2">
                                <label className="form-label">End At:</label>
                                <input type="datetime-local" className={isValidInput.endAt === true ? 'form-control' : 'form-control is-invalid'}
                                    value={endAt} disabled={isCheckUpdate}
                                    onChange={(e) => { handleChangeEnd(e.target.value) }} />

                            </div>
                            <div className="col-lg-12 mb-3">
                                <label className="form-label">Description:</label>
                                <textarea className={isValidInput.description === true ? 'form-control' : 'form-control is-invalid'}
                                    rows="3" value={description} disabled={isCheckUpdate}
                                    onChange={(e) => { handleChangeDes(e.target.value) }}></textarea>
                            </div>
                            <div className="col-lg-12 mb-1">
                                <div className='row align-items-center'>
                                    <div className='col-sm-9 d-sm-flex justify-content-sm-start'>
                                        <label className="form-label">Documents:</label>
                                    </div>
                                    {isCheckUpdate === false &&
                                        <div className='col-sm-3 d-sm-flex justify-content-sm-end'>
                                            <label htmlFor="file-upload" className="custom-file-upload btn btn-primary btn-sm w-100">
                                                Upload files
                                            </label>
                                            <input type='file' id="file-upload" multiple onChange={handleNewFileChange} />
                                        </div>
                                    }
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
                                                                <tr key={index}>
                                                                    <td>
                                                                        {index + 1}.
                                                                    </td>
                                                                    <td className='w-100'>
                                                                        {file.FilePath.replace(/^files-\d+-/, '')}
                                                                    </td>
                                                                    <td className='text-end text-nowrap'>
                                                                        <a href={file.GetFilePath} className='btn btn-primary btn-sm'>
                                                                            <i className="fa fa-download"></i>
                                                                        </a>
                                                                        {isCheckUpdate === false &&
                                                                            <button
                                                                                className="btn btn-danger btn-sm"
                                                                                style={{ marginLeft: "7px" }}
                                                                                onClick={() => handleRemoveExistingFile(file)}
                                                                            >
                                                                                <i className="fa fa-trash-o"></i>
                                                                            </button>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                        {
                                                            isCheckUpdate === false && newFiles.map((file, index) => (
                                                                <tr key={`new-${index}`}>
                                                                    <td>
                                                                        {index + 1 + indexLoadFiles}.
                                                                    </td>
                                                                    <td className='w-100'>
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

                            <div className="col-lg-6 mb-2">
                                <label className="form-label">Post by:</label>
                                <input type="text" className="form-control" value={postBy} disabled />
                            </div>
                            <div className="col-lg-6 mb-2">
                                <label className="form-label">Post at:</label>
                                <input type="text" className="form-control" value={postAt} disabled />
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center d-sm-flex justify-content-sm-between'>
                    <div>
                        <Button onClick={() => { handleShowTaskReport() }} variant='primary'>Task Report</Button>
                    </div>
                    <div>
                        <Button onClick={handleHide} variant='secondary' style={{ marginRight: '8px' }}>Close</Button>
                        {isCheckDelete === false && <Button onClick={handleShowDelete} variant='danger' style={{ marginRight: '8px' }}>Delete</Button>}
                        {isCheckUpdate === false && <Button onClick={handleUpdate} variant='success'>Update</Button>}
                    </div>
                </Modal.Footer>
            </Modal>

            <ModalTaskReport
                show={isShowTaskReport}
                hide={handleShowTaskReport}
                idTask={idTask}
            />

            <ModalDeleteTask
                show={isShowDelete}
                hide={handleShowDelete}
                delete={handleDeleteTask}
            />
        </div>
    )
}

export default ModalViewTask;