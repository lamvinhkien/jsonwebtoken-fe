import { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row } from 'react-bootstrap';
import { createNewUser, updateUser } from '../../services/userService';
import { getAllGroup } from '../../services/groupService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';
import userAvatar from '../../assets/user-avatar.png'
import moment from 'moment/moment';

const ModalCreate = (props) => {
    const [listGroup, setListGroup] = useState([])
    const defaultValueInput = {
        email: "",
        password: "",
        phone: "",
        avatar: "",
        username: "",
        address: "",
        gender: "Male",
        dateOfBirth: "",
        group: 2
    }
    const [valueInput, setValueInput] = useState(defaultValueInput)
    const defaultIsValidInput = {
        email: true,
        password: true,
        phone: true,
        group: true,
        gender: true,
        address: true,
        dateOfBirth: true,
        username: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)
    const { user } = useContext(UserContext)

    const fetchGroup = async () => {
        let res = await getAllGroup()
        if (res) {
            setListGroup(res.DT)
        }
    }
    useEffect(() => {
        if (user && user.data) {
            fetchGroup()
        }
    }, [])
    const handleOnChangeInput = (value, name) => {
        let _valueInput = _.cloneDeep(valueInput)
        _valueInput[name] = value
        setValueInput(_valueInput)
    }
    const handleValidateInput = () => {
        let arr = props.showModal === "CREATE" ?
            ["email", "phone", "password", "username", "dateOfBirth"] :
            ["group"]

        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!valueInput[arr[i]]) {
                let _value = _.cloneDeep(defaultIsValidInput)
                _value[arr[i]] = false
                setIsValidInput(_value)
                check = false
                if (arr[i] === 'dateOfBirth') {
                    toast.error(`Please enter date of birth.`)
                } else {
                    toast.error(`Please enter ${arr[i]}.`)
                }
                break;
            }
        }
        return check
    }
    const handleConfirmUser = async () => {
        let check = handleValidateInput()
        if (check === true) {
            let res = props.showModal === "CREATE" ?
                await createNewUser({ ...valueInput, gender: valueInput.gender, groupId: valueInput.group ? valueInput.group : 2 }) :
                await updateUser({ ...valueInput, gender: valueInput.gender, groupId: valueInput.group ? valueInput.group : 2 })

            if (res.EC === "1") {
                setIsValidInput(defaultIsValidInput)
                setValueInput(defaultValueInput)
                props.hideCreate()
                await props.fetchData()
                toast.success(res.EM)
            } else {
                let _value = _.cloneDeep(defaultIsValidInput)
                _value[res.DT] = false
                setIsValidInput(_value)
                toast.error(res.EM)
            }
        }
    }
    const handleHideModal = () => {
        props.hideCreate()
        setIsValidInput(defaultIsValidInput)
        setValueInput(defaultValueInput)
    }
    useEffect(() => {
        if (props.showModal === "UPDATE") {
            setValueInput(props.dataModalUpdate)
        }
    }, [props.dataModalUpdate, props.showModal])


    return (
        <Modal show={props.show} onHide={handleHideModal} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.showModal === "CREATE" ? "Create new user" : "Update user"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="grid-example">
                <Container>
                    <Row className='align-items-center'>
                        {
                            props.showModal === 'UPDATE' ?
                                <>
                                    <div className='col-12 mb-3 col-lg-5 mb-lg-0 text-center'>
                                        <div className=''>
                                            <img src={valueInput.avatar ? process.env.REACT_APP_URL_FILES_BE + valueInput.avatar : userAvatar}
                                                style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
                                        </div>
                                    </div>
                                    <div className='col-12 col-lg-7' style={{ fontSize: '17px' }}>
                                        <div className='row'>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Username:</span>&nbsp;<span>{valueInput.username}</span>
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Email:</span>&nbsp;<span>{valueInput.email}</span>
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Phone:</span>&nbsp;<span>{valueInput.phone}</span>
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Gender:</span>&nbsp;<span>{valueInput.gender}</span>
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Date of birth:</span>&nbsp;<span>{valueInput.dateOfBirth ? moment(valueInput.dateOfBirth).format('LL') : null}</span>
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Address:</span>&nbsp;<span>{valueInput.address}</span>
                                            </div>
                                            <div className='col-12 mb-3'>
                                                <span className='fw-medium'>Type Account:</span>&nbsp;<span>{valueInput.typeAccount}</span>
                                            </div>
                                            <div className="col-12 d-flex justify-content-start align-items-center">
                                                <span className='fw-medium'>Group:</span>&nbsp;
                                                <select className={isValidInput.group ? "w-50 form-select form-select-sm" : "w-50 form-select form-select-sm is-invalid"}
                                                    value={valueInput.group}
                                                    onChange={(event) => handleOnChangeInput(event.target.value, "group")}
                                                >
                                                    {
                                                        listGroup.length > 0 ? listGroup.map((item, index) => {
                                                            return (
                                                                <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                                            )
                                                        })
                                                            :
                                                            <option>Group loading...</option>
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="form-group mb-2 col-12">
                                        <label className="py-1">Email<sup className='text-danger fw-bold'>*</sup></label>
                                        <input type="text"
                                            className={isValidInput.email ? "form-control" : "form-control is-invalid"}
                                            placeholder="Email address" value={valueInput.email}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "email")}
                                        />
                                    </div>
                                    <div className="form-group mb-2 col-12 col-lg-6">
                                        <label className="py-1">Phone<sup className='text-danger fw-bold'>*</sup></label>
                                        <input type="text"
                                            className={isValidInput.phone ? "form-control" : "form-control is-invalid"}
                                            placeholder="Phone number" value={valueInput.phone}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "phone")}
                                        />
                                    </div>
                                    <div className="form-group mb-2 col-12 col-lg-6">
                                        <label className="py-1">Username<sup className='text-danger fw-bold'>*</sup></label>
                                        <input type="text" className={isValidInput.username ? "form-control" : "form-control is-invalid"}
                                            placeholder="Username" value={valueInput.username}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "username")}
                                        />
                                    </div>
                                    <div className="form-group mb-2 col-12 col-lg-6">
                                        <label className="py-1">Date of birth<sup className='text-danger fw-bold'>*</sup></label>
                                        <input type="date" className={isValidInput.dateOfBirth ? "form-control" : "form-control is-invalid"}
                                            value={valueInput.dateOfBirth}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "dateOfBirth")}
                                        />
                                    </div>
                                    <div className="form-group mb-2 col-12 col-lg-6">
                                        <label className="py-1">Gender<sup className='text-danger fw-bold'>*</sup></label>
                                        <select className="form-select"
                                            value={valueInput.gender}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "gender")}
                                        >
                                            <option defaultValue={"Male"}>Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                    <div className="form-group mb-2 col-12">
                                        <label className="py-1">Group<sup className='text-danger fw-bold'>*</sup></label>
                                        <select className={isValidInput.group ? "form-select" : "form-select is-invalid"}
                                            value={valueInput.group}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "group")}
                                        >
                                            {
                                                listGroup.length > 0 ? listGroup.map((item, index) => {
                                                    return (
                                                        <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                                    :
                                                    <option>Group loading...</option>
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group mb-2 col-12">
                                        <label className="py-1">Password<sup className='text-danger fw-bold'>*</sup></label>
                                        <input type="password" className={isValidInput.password ? "form-control" : "form-control is-invalid"}
                                            placeholder="Password" value={valueInput.password}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "password")}
                                        />
                                    </div>
                                    <div className="form-group mb-2 col-12">
                                        <label className="py-1">Address</label>
                                        <input type="text" className="form-control" placeholder="Address" value={valueInput.address}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "address")}
                                        />
                                    </div>
                                </>
                        }
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleHideModal}>Close</Button>
                <Button variant="success" onClick={handleConfirmUser}>{props.showModal === "CREATE" ? "Create" : "Update"}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalCreate;