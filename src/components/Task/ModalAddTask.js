import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { createTask } from '../../services/taskService';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';

const ModalAddTask = (props) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [endAt, setEndAt] = useState('')
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const { user } = useContext(UserContext)

    const handleHide = () => {
        props.hide()
        setTitle('')
        setDescription('')
        setEndAt('')
        setUploadedFiles([])
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
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
    };
    const handleRemoveFile = (indexToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };
    const handleAddTask = async () => {
        let formData = new FormData();
        formData.append('title', title)
        formData.append('description', description)
        formData.append('endDate', endAt)
        formData.append('postBy', user.username)
        uploadedFiles.forEach((file, index) => {
            formData.append(`files`, file);
        });

        let res = await createTask(formData)
        if (res && res.EC === "1") {
            toast.success(res.EM)
            handleHide()
            props.fetch()
            return
        }
        toast.error(res.EM)
    }

    return (
        <div className="ModalAddTask">
            <Modal show={props.show} onHide={handleHide} aria-labelledby="contained-modal-title-vcenter" size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add New Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    <Container>
                        <Row>
                            <div className="col-6 mb-3">
                                <label className="form-label">Title:</label>
                                <input type="text" className="form-control" value={title} onChange={(e) => handleChangeTitle(e.target.value)} />
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">End At:</label>
                                <input type="datetime-local" className="form-control" value={endAt} onChange={(e) => handleChangeEnd(e.target.value)} />

                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Description:</label>
                                <textarea className="form-control" rows="7" value={description} onChange={(e) => handleChangeDes(e.target.value)}></textarea>
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Documents:</label>
                                <input type='file' multiple className='form-control' onChange={handleFileChange} />
                                <ul className="list-group mt-3">
                                    {uploadedFiles.map((file, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {file.name}
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveFile(index)}
                                                >
                                                    <i className="fa fa-trash-o"></i>
                                                </button>
                                            </div>

                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleHide} variant='secondary'>Close</Button>
                    <Button onClick={handleAddTask} variant='success'>Add</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalAddTask;