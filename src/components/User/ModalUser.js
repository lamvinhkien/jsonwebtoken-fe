import { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row } from 'react-bootstrap';
import { createNewUser, updateUser } from '../../services/userService';
import { getAllGroup } from '../../services/groupService';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/Context';

const ModalCreate = (props) => {
    // Define state value for user and list group
    const [listGroup, setListGroup] = useState([])

    const defaultValueInput = {
        email: "",
        password: "",
        phone: "",
        username: "",
        address: "",
        gender: "Male",
        group: ""
    }

    const [valueInput, setValueInput] = useState(defaultValueInput)


    // Valid Input
    const defaultIsValidInput = {
        email: true,
        password: true,
        phone: true,
        group: true,
        gender: true,
        address: true,
        username: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)

    const { user } = useContext(UserContext)

    // fetch data group
    const fetchGroup = async () => {
        let res = await getAllGroup()
        if (res) {
            setListGroup(res.DT)

            let group = res.DT
            setValueInput({ ...valueInput, group: group[0].id })
        }
    }
    useEffect(() => {
        fetchGroup()
    }, [])


    // OnChange Input
    const handleOnChangeInput = (value, name) => {
        let _valueInput = _.cloneDeep(valueInput)
        _valueInput[name] = value
        setValueInput(_valueInput)
    }


    // Validate and Handle Create
    const handleValidateInput = () => {
        let arr = props.showModal === "CREATE" ?
            ["email", "phone", "password", "username", "group"] :
            ["username", "group"]

        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!valueInput[arr[i]]) {
                let _value = _.cloneDeep(defaultIsValidInput)
                _value[arr[i]] = false
                setIsValidInput(_value)
                check = false
                toast.error(`Please enter ${arr[i]}.`)
                break;
            }
        }
        return check
    }

    const handleConfirmUser = async () => {
        let check = handleValidateInput()
        if (check === true) {
            let res = props.showModal === "CREATE" ?
                await createNewUser({ ...valueInput, sex: valueInput.gender, groupId: valueInput.group }) :
                await updateUser({ ...valueInput, sex: valueInput.gender, groupId: valueInput.group })

            if (res.EC === "1") {
                setIsValidInput(defaultIsValidInput)
                setValueInput({ ...defaultValueInput, group: listGroup && listGroup.length > 0 ? listGroup[0].id : "" })
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


    // Show data for update and handle null for modal when turn off
    useEffect(() => {
        if (props.showModal === "UPDATE") {
            setValueInput(props.dataModalUpdate)
        }
    }, [props.dataModalUpdate])

    const handleHideModal = () => {
        props.hideCreate()
        setIsValidInput(defaultIsValidInput)
        setValueInput({ ...defaultValueInput, group: listGroup[0].id })
    }

    return (
        <>
            <Modal show={props.show} onHide={handleHideModal} centered size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.showModal === "CREATE" ? "Create new user" : "Update a user"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    <Container>
                        <Row>
                            <div className={props.showModal === "CREATE" ? "form-group mb-3 col-6" : "form-group mb-3 col-6"}>
                                <label className="py-1">Email<span className='text-danger'>*</span></label>
                                <input type="text"
                                    disabled={props.showModal === "CREATE" ? false : true}
                                    className={isValidInput.email ? "form-control" : "form-control is-invalid"}
                                    placeholder="Email address" value={valueInput.email}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "email")}
                                />
                            </div>

                            <div className="form-group mb-3 col-6">
                                <label className="py-1">Phone<span className='text-danger'>*</span></label>
                                <input type="text"
                                    disabled={props.showModal === "CREATE" ? false : true}
                                    className={isValidInput.phone ? "form-control" : "form-control is-invalid"}
                                    placeholder="Phone number" value={valueInput.phone}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "phone")}
                                />
                            </div>

                            <div className="form-group mb-3 col-6">
                                <label className="py-1">Username<span className='text-danger'>*</span></label>
                                <input type="text" className={isValidInput.username ? "form-control" : "form-control is-invalid"}
                                    placeholder="Username" value={valueInput.username}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "username")}
                                />
                            </div>

                            <div className="form-group mb-3 col-6">
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

                            {
                                user.data.name === 'Leader' &&
                                <div className="form-group mb-3 col-12">
                                    <label className="py-1">Group<span className='text-danger'>*</span></label>
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
                            }

                            <div className="form-group mb-3 col-12">
                                <label className="py-1">Address</label>
                                <input type="text" className="form-control" placeholder="Address" value={valueInput.address}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "address")}
                                />
                            </div>

                            {props.showModal === "CREATE" &&
                                <>
                                    <div className="form-group mb-3 col-12">
                                        <label className="py-1">Password<span className='text-danger'>*</span></label>
                                        <input type="password" className={isValidInput.password ? "form-control" : "form-control is-invalid"}
                                            placeholder="Password" value={valueInput.password}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "password")}
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
        </>
    )
}

export default ModalCreate;