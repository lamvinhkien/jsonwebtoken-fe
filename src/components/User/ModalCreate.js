import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Col, Row } from 'react-bootstrap';
import { getAllGroup } from '../../services/userService';
import _ from 'lodash';

const ModalCreate = (props) => {
    const [listGroup, setListGroup] = useState([])
    const [valueInput, setValueInput] = useState({
        email: "",
        password: "",
        phone: "",
        username: "",
        address: "",
        gender: "",
        group: ""
    })

    const fetchGroup = async () => {
        let res = await getAllGroup()
        if (res) {
            setListGroup(res.data.DT)
        }
    }

    useEffect(() => {
        fetchGroup()
    }, [])

    const handleOnChangeInput = (value, name) => {
        let _valueInput = _.cloneDeep(valueInput)
        _valueInput[name] = value
        setValueInput(_valueInput)
    }

    return (
        <>
            <Modal show={props.show} onHide={props.hideCreate} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create new user
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    <Container>
                        <Row>
                            <Col xs={6}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Email<span className='text-danger'>*</span></label>
                                    <input type="text" className="form-control" placeholder="Email address" value={valueInput.email}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "email")}
                                    />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Password<span className='text-danger'>*</span></label>
                                    <input type="password" className="form-control" placeholder="Password" value={valueInput.password}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "password")}
                                    />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Phone<span className='text-danger'>*</span></label>
                                    <input type="text" className="form-control" placeholder="Phone number" value={valueInput.phone}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "phone")}
                                    />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Group<span className='text-danger'>*</span></label>
                                    <select className="form-select"
                                    value={valueInput.group}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "group")}
                                    >
                                        {
                                            listGroup.length > 0 ? listGroup.map((item, index) => {
                                                return (
                                                    <option key={`group-${index}`} defaultValue={item.id}>{item.name}</option>
                                                )
                                            })
                                                :
                                                <option>Group loading...</option>
                                        }
                                    </select>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Username</label>
                                    <input type="text" className="form-control" placeholder="Username" value={valueInput.username}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "username")}
                                    />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Gender</label>
                                    <select className="form-select"
                                    value={valueInput.gender}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "gender")}
                                    >
                                        <option defaultValue={"Male"}>Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </Col>

                            <Col xs={12}>
                                <div className="form-group mb-3">
                                    <label className="py-1">Address</label>
                                    <input type="text" className="form-control" placeholder="Address" value={valueInput.address}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "address")}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.hideCreate}>Close</Button>
                    <Button variant="success" onClick={props.handleCreateUser}>Create</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalCreate;