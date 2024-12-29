import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { updateRole } from '../../services/rolesService';


const ModalUpdate = (props) => {

    const [valueInput, setValueInput] = useState({
        id: '',
        url: '',
        description: ''
    })

    const handleOnChangeInput = (event, name) => {
        let _valueInput = _.cloneDeep(valueInput)
        _valueInput[name] = event
        setValueInput(_valueInput)
    }

    const handleUpdate = async () => {
        let res = await updateRole(valueInput)

        if (res && res.EC === "1") {
            props.fetchData()
            props.onHide()
            toast.success(res.EM)
        } else {
            toast.error(res.EM)
        }
    }

    const handleHideModal = () => {
        props.onHide()
    }


    useEffect(() => {
        if (props.data) {
            setValueInput({ id: props.data.id, url: props.data.url, description: props.data.description })
        }
    }, [props.data])

    return (
        <Modal show={props.show} centered aria-labelledby="contained-modal-title-vcenter" onHide={handleHideModal}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Update role: <span className='fw-normal'>{valueInput.url}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row>
                        <Col xs={12} className=''>
                            <label className='fw-medium'>Description:</label>
                            <input type='text' className='form-control mt-1'
                                onChange={(event) => { handleOnChangeInput(event.target.value, 'description') }}
                                value={valueInput.description} />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleHideModal} variant='secondary'>Close</Button>
                <Button onClick={() => { handleUpdate() }} variant='success'>Update</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalUpdate;