import { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './Profile.scss';
import _ from 'lodash';
import { UserContext } from '../Context/Context';
import { changeInfor, changePassword } from '../../services/userService';
import { toast } from 'react-toastify';
import logo from '../../assets/logo-project.png'

const Profile = () => {
    let history = useHistory();

    const [valueInput, setValueInput] = useState({
        email: '',
        phone: '',
        username: '',
        gender: '',
        address: '',
        group: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const defaultValid = {
        isValidEmail: true,
        isValidPhone: true,
        isValidUsername: true,
        isValidGender: true,
        isValidAddress: true,
        isValidCurrentPassword: true,
        isValidNewPassword: true,
        isValidConfirmNewPassword: true
    }
    const [checkValidInput, setCheckValidInput] = useState(defaultValid)

    const { user, fetchUser, logoutContext } = useContext(UserContext)

    const handleOnChangeInput = (value, name) => {
        let _valueInput = _.cloneDeep(valueInput)
        _valueInput[name] = value
        setValueInput(_valueInput)
    }

    const handleSaveEmailPhone = async () => {
        let res = await changeInfor(user.id, user.email, user.data.id, user.typeAccount, { email: valueInput.email, phone: valueInput.phone, username: valueInput.username, gender: valueInput.gender, address: valueInput.address })
        if (res && res.EC === '1') {
            await fetchUser()
            setCheckValidInput(defaultValid)
            toast.success(res.EM)
        } else {
            if (res.DT === 'email') {
                setCheckValidInput({ ...defaultValid, isValidEmail: false })
            }

            if (res.DT === 'phone') {
                setCheckValidInput({ ...defaultValid, isValidPhone: false })
            }

            if (res.DT === 'username') {
                setCheckValidInput({ ...defaultValid, isValidUsername: false })
            }
            toast.error(res.EM)
        }
    }

    const handleSaveNewPassword = async () => {
        let res = await changePassword(user.email, { currentPassword: valueInput.currentPassword, newPassword: valueInput.newPassword, confirmNewPassword: valueInput.confirmNewPassword })
        if (res && res.EC === '1') {
            let _valueInput = _.cloneDeep(valueInput)
            setValueInput({
                ..._valueInput,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            })
            setCheckValidInput(defaultValid)
            logoutContext()
            history.push("/login")
            toast.success('Save new password success! Please login again.')
        } else {
            if (res.DT === 'current' || res.DT === 'incorrect') {
                setCheckValidInput({ ...defaultValid, isValidCurrentPassword: false })
            }

            if (res.DT === 'new' || res.DT === 'sameCurrent') {
                setCheckValidInput({ ...defaultValid, isValidNewPassword: false })
            }

            if (res.DT === 'isNotSame' || res.DT === 'confirm') {
                setCheckValidInput({ ...defaultValid, isValidConfirmNewPassword: false })
            }

            toast.error(res.EM)
        }
    }

    useEffect(() => {
        if (user && user.auth === true && user.data) {
            setValueInput({ email: user.email, phone: user.phone, username: user.username, gender: user.gender, address: user.address, group: user.data.name })
        }
    }, [])

    return (
        <div className="Profile-component">
            <div className='content-card-body'>
                <div className='row'>
                    <div className='col-12 mb-3'>
                        <span className='fs-4 fw-bold text-info'><i className="fa fa-address-book"></i>&nbsp;Change your information</span>
                    </div>
                    <div className='col-12 col-lg-4 text-center'>
                        <div className=''>
                            <img src={logo} style={{ width: '200px', height: '200px' }} />
                        </div>
                        <div className='mt-2'>
                            <label className='btn btn-outline-info' htmlFor='avatar'>Upload</label>
                            <input type='file' hidden id='avatar' />
                        </div>
                    </div>
                    <div className='col-12 col-lg-8'>
                        <div className='row'>
                            {
                                user.typeAccount === 'LOCAL' &&
                                <div className='col-12'>
                                    <label>Email</label>
                                    <input
                                        type="text" className={checkValidInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address"
                                        value={valueInput.email} onChange={(event) => handleOnChangeInput(event.target.value, 'email')}
                                    />
                                </div>
                            }
                            <div className='col-12 col-lg-5 mt-3'>
                                <label>Name</label>
                                <input type="text" className={checkValidInput.isValidUsername ? "form-control" : "form-control is-invalid"} placeholder="Username"
                                    value={valueInput.username} onChange={(event) => handleOnChangeInput(event.target.value, 'username')} />
                            </div>
                            <div className='col-12 col-lg-4 mt-3'>
                                <label>Phone</label>
                                <input type="text" className={checkValidInput.isValidPhone ? "form-control" : "form-control is-invalid"} placeholder="Phone number"
                                    value={valueInput.phone} onChange={(event) => handleOnChangeInput(event.target.value, 'phone')} />
                            </div>
                            <div className='col-12 col-lg-3 mt-3'>
                                <label>Gender</label>
                                <select className="form-select" value={valueInput.gender} onChange={(event) => handleOnChangeInput(event.target.value, "gender")}>
                                    <option defaultValue={"Male"}>Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className='col-12 col-lg-9 mt-3'>
                                <label>Address</label>
                                <input type="text" className={checkValidInput.isValidAddress ? "form-control" : "form-control is-invalid"} placeholder="Address"
                                    value={valueInput.address} onChange={(event) => handleOnChangeInput(event.target.value, 'address')} />
                            </div>
                            <div className='col-12 col-lg-3 mt-3'>
                                <label>Group</label>
                                <input
                                    type="text" className='form-control' value={valueInput.group} disabled
                                />
                            </div>
                            <div className='col-12 text-end mt-3'>
                                <button className='btn btn-success' onClick={() => { handleSaveEmailPhone() }}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    user.typeAccount === 'LOCAL' ?
                        <>
                            <hr />
                            <div className='row'>
                                <div className='col-12 mb-3'>
                                    <span className='fs-4 fw-bold text-info'><i className="fa fa-lock"></i>&nbsp;Change your password</span>
                                </div>
                                <div className='col-12 col-lg-4 mb-3 mb-lg-0'>
                                    <input type="password" className={checkValidInput.isValidCurrentPassword ? "form-control" : "form-control is-invalid"} placeholder="Current password"
                                        value={valueInput.currentPassword} onChange={(event) => handleOnChangeInput(event.target.value, 'currentPassword')} />
                                </div>
                                <div className='col-12 col-lg-4 mb-3 mb-lg-0'>
                                    <input type="password" className={checkValidInput.isValidNewPassword ? "form-control" : "form-control is-invalid"} placeholder="New password"
                                        value={valueInput.newPassword} onChange={(event) => handleOnChangeInput(event.target.value, 'newPassword')} />
                                </div>
                                <div className='col-12 col-lg-4 mb-3 mb-lg-0'>
                                    <input type="password" className={checkValidInput.isValidConfirmNewPassword ? "form-control" : "form-control is-invalid"} placeholder="Confirm new password"
                                        value={valueInput.confirmNewPassword} onChange={(event) => handleOnChangeInput(event.target.value, 'confirmNewPassword')} />
                                </div>
                                <div className='col-12 text-end mt-0 mt-lg-3'>
                                    <button className='btn btn-success' onClick={() => { handleSaveNewPassword() }}>Save changes</button>
                                </div>
                            </div>
                        </>
                        :
                        <></>
                }
            </div>
        </div >
    )
}

export default Profile;