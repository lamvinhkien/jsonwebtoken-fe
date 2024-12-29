import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { updateGroup } from '../../services/groupService';


const ModalUpdate2 = (props) => {

    const [valueInput, setValueInput] = useState({
        id: '',
        name: '',
        description: ''
    })

    const [isValidInput, setIsValidInput] = useState(true)

    const handleOnChangeInput = (event, name) => {
        let _valueInput = _.cloneDeep(valueInput)
        if (name === 'name') {
            setIsValidInput(true)
        }
        _valueInput[name] = event
        setValueInput(_valueInput)
    }

    const handleUpdate = async () => {
        if (!valueInput.name) {
            setIsValidInput(false)
            toast.error("Please enter name.")
        } else {
            let res = await updateGroup(valueInput)

            if (res && res.EC === "1") {
                setIsValidInput(true)
                props.fetchData()
                props.onHide()
                toast.success(res.EM)
            } else {
                toast.error(res.EM)
            }
        }
    }

    const handleHideModal = () => {
        props.onHide()
        setIsValidInput(true)
    }


    useEffect(() => {
        if (props.data) {
            setValueInput({ id: props.data.id, name: props.data.name, description: props.data.description })
        }
    }, [props.data])

    return (
        <Modal show={props.show} centered aria-labelledby="contained-modal-title-vcenter" onHide={handleHideModal}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Update group
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row>
                        <Col xs={12}>
                            <label>Name<span className='text-danger'>*</span></label>
                            <input type='text' className={isValidInput ? 'form-control' : 'form-control is-invalid'}
                                onChange={(event) => { handleOnChangeInput(event.target.value, 'name') }}
                                value={valueInput.name} />
                        </Col>
                        <Col xs={12} className='mt-2'>
                            <label>Description</label>
                            <input type='text' className='form-control'
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

export default ModalUpdate2;