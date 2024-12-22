import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';
import { uploadTaskReport, getAllReportByEmployee, deleteTaskReport, getAllReportByManager } from '../../services/taskService';
import moment from 'moment';

const TaskReport = (props) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const { user } = useContext(UserContext)
    const defaultIsValidInput = {
        uploadedFiles: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)
    const [isCheckRole, setIsCheckRole] = useState(true)

    const handleHide = () => {
        props.hide()
        setIsValidInput(defaultIsValidInput)
        setUploadedFiles([])
        setExistingFiles([])
    }
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
        setIsValidInput(defaultIsValidInput)
        event.target.value = null
    };
    const handleRemoveFile = (indexToRemove) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, index) => index !== indexToRemove)
        );
    };
    const handleUploadReport = async () => {
        if (uploadedFiles.length <= 0) { setIsValidInput({ ...defaultIsValidInput, uploadedFiles: isValidInput.uploadedFiles = false }); toast.error('Please upload document.'); return; }

        let formData = new FormData();
        formData.append('UserID', user ? user.id : '')
        formData.append('TaskID', props.idTask ? props.idTask : '')
        uploadedFiles.forEach((file, index) => {
            formData.append(`report`, file);
        });

        let res = await uploadTaskReport(formData)
        if (res && res.EC === "1") {
            getReportEmployee()
            setIsValidInput(defaultIsValidInput)
            setUploadedFiles([])
            toast.success(res.EM)
            return
        }
        toast.error(res.EM)
    }
    const handleDeleteReport = async (id) => {
        let res = await deleteTaskReport(id)
        if (res && res.EC === "1") {
            toast.success(res.EM)
            getReportEmployee()
            return
        }
        toast.error(res.EM)
    }
    const getReportEmployee = async () => {
        let data = { TaskID: props.idTask, UserID: user ? user.id : '' }
        let res = await getAllReportByEmployee(data)
        if (res && res.EC === "1") {
            setExistingFiles(res.DT)
        }

    }
    const getReportManager = async () => {
        let res = await getAllReportByManager(+props.idTask)
        if (res && res.EC === "1") {
            setExistingFiles(res.DT)
        }

    }

    useEffect(() => {
        if (props && props.show && props.idTask !== '') {
            if (user && user.data && user.data.Roles.length > 0) {
                user.data.Roles.find((item, index) => {
                    if (item && item.url) {
                        if (item.url === '/task/create') {
                            setIsCheckRole(false)
                            getReportManager()
                        }
                        if (item.url === '/task/create-report') {
                            setIsCheckRole(true)
                            getReportEmployee()
                        }
                    }
                })
            }
        }
    }, [props.idTask, props.show])


    return (
        <div className="TaskReport">
            <Modal show={props.show} onHide={handleHide} size={isCheckRole === true ? 'lg' : 'xl'}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {isCheckRole === true ? 'Upload your report' : 'Task report'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    {isCheckRole === true ?
                        <Container>
                            <Row className='justify-content-center'>
                                <div className="col-12">
                                    <label className="form-label">Documents:</label>
                                    <div className='table-responsive'>
                                        <table className='table'>
                                            <tbody>
                                                {uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles.map((file, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {index + 1}.
                                                        </td>
                                                        <td className='w-100'>
                                                            {file.name}
                                                        </td>
                                                        <td className='text-end'>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleRemoveFile(index)}
                                                            >
                                                                <i className="fa fa-trash-o"></i>
                                                            </button>
                                                        </td>

                                                    </tr>
                                                ))
                                                    :
                                                    <tr className='text-center'>
                                                        <td className='fst-italic'>No files available.....</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="input-group">
                                        <input type="file" multiple className={isValidInput.uploadedFiles === true ? 'form-control' : 'form-control is-invalid'}
                                            onChange={handleFileChange} />
                                        <button className="btn btn-success" onClick={() => { handleUploadReport() }}>Upload</button>
                                    </div>
                                </div>
                            </Row>
                            <hr />
                            <Row>
                                <div className='col-12 d-flex justify-content-between'>
                                    <div className='fs-5 fw-medium'>Your Report</div>
                                    <button className="btn btn-primary btn-sm" onClick={() => getReportEmployee()}><i className="fa fa-refresh"></i> Refresh</button>
                                </div>
                                <div className='table-responsive'>
                                    <table className='table'>
                                        <tbody>
                                            {existingFiles && existingFiles.length > 0 ?
                                                existingFiles.map((file, index) => (
                                                    <tr key={index} className='text-nowrap'>
                                                        <td>
                                                            {index + 1}.
                                                        </td>
                                                        <td>
                                                            {file.FilePath.replace(/^report-\d+-/, '')}
                                                        </td>
                                                        <td>
                                                            {moment(file.createdAt).format('lll')}
                                                        </td>
                                                        <td className='text-end'>
                                                            <a href={file.GetFilePath} className='btn btn-primary btn-sm'>
                                                                <i className="fa fa-download"></i>
                                                            </a>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                style={{ marginLeft: "7px" }}
                                                                onClick={() => { handleDeleteReport(file.id) }}
                                                            >
                                                                <i className="fa fa-trash-o"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) :
                                                <tr className='text-center'>
                                                    <td className='fst-italic'>No task report available.....</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </Row>
                        </Container>
                        :
                        <Container>
                            <div className='table-responsive'>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Upload at</th>
                                            <th scope="col">Document</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {existingFiles && existingFiles.length > 0 ?
                                            existingFiles.map((file, index) => (
                                                <tr key={index} className='text-nowrap'>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{file.username}</td>
                                                    <td>{file.email}</td>
                                                    <td>{moment(file.createdAt).format('lll')}</td>
                                                    <td>{file.FilePath.replace(/^report-\d+-/, '')}</td>
                                                    <td className='text-end'>
                                                        <a href={file.GetFilePath} className='btn btn-primary btn-sm'>
                                                            <i className="fa fa-download"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            )) :
                                            <tr className='text-center'>
                                                <td className='fst-italic' colSpan={6}>No task report available.....</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Container>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleHide} variant='secondary'>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TaskReport;