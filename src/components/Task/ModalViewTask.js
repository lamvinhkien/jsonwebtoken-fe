import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import moment from 'moment';
import { updateTask, getDocument, deleteTask } from '../../services/taskService';
import { toast } from 'react-toastify';
import ModalDeleteTask from './ModalDeleteTask';

const ModalViewTask = (props) => {
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
    };
    const handleRemoveNewFile = (indexToRemove) => {
        setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };
    const handleGetDocument = async (id) => {
        let res = await getDocument(id)
        if (res && res.EC === "1") {
            setExistingFiles(res.DT)
        }
    }
    const handleUpdate = async () => {
        let formData = new FormData();
        formData.append('id', props.dataModal ? props.dataModal.id : '')
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
            return
        }
        toast.error(res.EM)
    }
    const handleShowDelete = () => {
        setIsShowDelete(!isShowDelete)
    }
    const handleDeleteTask = async () => {
        let id = props.dataModal ? props.dataModal.id : ''
        if (id !== '') {
            let res = await deleteTask(id)
            if (res && res.EC === "1") {
                props.fetch()
                handleShowDelete()
                handleHide()
                toast.success(res.EM)
                return
            }
            toast.error(res.EM)
        }
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

    useEffect(() => {
        if (props.dataModal && props.permission) {
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
                            <div className="col-6 mb-3">
                                <label className="form-label">Title:</label>
                                <input type="text" className="form-control" value={title} disabled={isCheckUpdate}
                                    onChange={(e) => { handleChangeTitle(e.target.value) }} />
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">End At:</label>
                                <input type="datetime-local" className="form-control" value={endAt} disabled={isCheckUpdate}
                                    onChange={(e) => { handleChangeEnd(e.target.value) }} />

                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Description:</label>
                                <textarea className="form-control" rows="7" value={description} disabled={isCheckUpdate}
                                    onChange={(e) => { handleChangeDes(e.target.value) }}></textarea>
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Documents:</label>
                                {isCheckUpdate === false &&
                                    <input type='file' multiple className='form-control mb-3' onChange={handleNewFileChange} />
                                }
                                <ul className="list-group">
                                    {existingFiles.map((file, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {file.FilePath.replace(/^files-\d+-/, '')}
                                            </div>
                                            <div>
                                                <a href={file.GetFilePath} className='btn btn-primary btn-sm'>
                                                    <i className="fa fa-download"></i>
                                                </a>
                                                {isCheckUpdate === false &&
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        style={{marginLeft: "7px"}}
                                                        onClick={() => handleRemoveExistingFile(file)}
                                                    >
                                                        <i className="fa fa-trash-o"></i>
                                                    </button>
                                                }
                                            </div>
                                        </li>
                                    ))}
                                    {isCheckUpdate === false && newFiles.map((file, index) => (
                                        <li key={`new-${index}`} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {file.name}
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveNewFile(index)}
                                                >
                                                    <i className="fa fa-trash-o"></i>
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Post by:</label>
                                <input type="text" className="form-control" value={postBy} disabled />
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Post at:</label>
                                <input type="text" className="form-control" value={postAt} disabled />
                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleHide} variant='secondary'>Close</Button>
                    {isCheckDelete === false && <Button onClick={handleShowDelete} variant='danger'>Delete</Button>}
                    {isCheckUpdate === false && <Button onClick={handleUpdate} variant='success'>Update</Button>}
                </Modal.Footer>
            </Modal>

            <ModalDeleteTask
                show={isShowDelete}
                hide={handleShowDelete}
                delete={handleDeleteTask}
            />
        </div>
    )
}

export default ModalViewTask;