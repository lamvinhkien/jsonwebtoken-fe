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
    const defaultIsValidInput = {
        title: true,
        description: true,
        endAt: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)

    const { user } = useContext(UserContext)

    const handleHide = () => {
        props.hide()
        setTitle('')
        setDescription('')
        setEndAt('')
        setUploadedFiles([])
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
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
        event.target.value = null
    };
    const handleRemoveFile = (indexToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };
    const handleAddTask = async () => {
        if (title === '') { setIsValidInput({ ...defaultIsValidInput, title: isValidInput.title = false }); toast.error('Please enter Title.'); return; }
        if (description === '') { setIsValidInput({ ...defaultIsValidInput, description: isValidInput.description = false }); toast.error('Please enter Description.'); return; }
        if (endAt === '') { setIsValidInput({ ...defaultIsValidInput, endAt: isValidInput.endAt = false }); toast.error('Please set end time.'); return; }

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
            setIsValidInput(defaultIsValidInput)
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
                                <input type="text" className={isValidInput.title === true ? 'form-control' : 'form-control is-invalid'}
                                    value={title} onChange={(e) => handleChangeTitle(e.target.value)} />
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">End At:</label>
                                <input type="datetime-local" className={isValidInput.endAt === true ? 'form-control' : 'form-control is-invalid'}
                                    value={endAt} onChange={(e) => handleChangeEnd(e.target.value)} />

                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Description:</label>
                                <textarea className={isValidInput.description === true ? 'form-control' : 'form-control is-invalid'} rows="7"
                                    value={description} onChange={(e) => handleChangeDes(e.target.value)}></textarea>
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label">Documents:</label>
                                <div className='col-12'>
                                    <label htmlFor="file-upload" className="custom-file-upload btn btn-primary w-100">
                                        Upload files
                                    </label>
                                    <input type='file' id="file-upload" multiple onChange={handleFileChange} />
                                </div>
                                <ul className="list-group mt-2">
                                    {uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles.map((file, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className='w-25'>
                                                {index + 1}.
                                            </div>
                                            <div className='w-100'>
                                                {file.name}
                                            </div>
                                            <div className='w-25 text-end'>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleRemoveFile(index)}
                                                >
                                                    <i className="fa fa-trash-o"></i>
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                        :
                                        <div className='text-center mt-2'>
                                            <span className='fst-italic'>No files available.....</span>
                                        </div>
                                    }
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