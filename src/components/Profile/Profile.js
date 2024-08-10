import { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './Profile.scss';
import _ from 'lodash';
import { UserContext } from '../Context/Context';
import { changeInfor, changePassword } from '../../services/userService';
import { toast } from 'react-toastify';

const Profile = () => {
    let history = useHistory();

    const [valueInput, setValueInput] = useState({
        email: '',
        phone: '',
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const defaultValid = {
        isValidEmail: true,
        isValidPhone: true,
        isValidUsername: true,
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
        let res = await changeInfor(user.email, user.data.id, { email: valueInput.email, phone: valueInput.phone, username: valueInput.username })
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
        if (user && user.auth === true) {
            let _valueInput = _.cloneDeep(valueInput)
            setValueInput({ ..._valueInput, email: user.email, phone: user.phone, username: user.username })
        }
    }, [user])

    return (
        <div className="Profile-component">
            <div className='container'>
                <div className='row mt-3'>
                    <div className="col-0 col-lg-3"></div>

                    <div className='col-12 col-lg-6'>
                        {
                            user && user.auth === true ?
                                <>
                                    <div className=''>
                                        <span className='fs-4 fw-medium'><i className="fa fa-address-book"></i> Your email/phone</span>
                                        <div className='mt-2'>
                                            <input type="text" className={checkValidInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address"
                                                value={valueInput.email} onChange={(event) => handleOnChangeInput(event.target.value, 'email')} />
                                            <input type="text" className={checkValidInput.isValidPhone ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Phone number"
                                                value={valueInput.phone} onChange={(event) => handleOnChangeInput(event.target.value, 'phone')} />
                                            <input type="text" className={checkValidInput.isValidUsername ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Username"
                                                value={valueInput.username} onChange={(event) => handleOnChangeInput(event.target.value, 'username')} />
                                        </div>
                                        <div className='d-flex justify-content-end'>
                                            <button className='btn btn-success mt-3' onClick={() => { handleSaveEmailPhone() }}>Save changes</button>
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <span className='fs-4 fw-medium'><i className="fa fa-lock"></i> Your password</span>
                                        <div className='mt-2'>
                                            <input type="password" className={checkValidInput.isValidCurrentPassword ? "form-control" : "form-control is-invalid"} placeholder="Current password"
                                                value={valueInput.currentPassword} onChange={(event) => handleOnChangeInput(event.target.value, 'currentPassword')} />
                                            <input type="password" className={checkValidInput.isValidNewPassword ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="New password"
                                                value={valueInput.newPassword} onChange={(event) => handleOnChangeInput(event.target.value, 'newPassword')} />
                                            <input type="password" className={checkValidInput.isValidConfirmNewPassword ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Confirm new password"
                                                value={valueInput.confirmNewPassword} onChange={(event) => handleOnChangeInput(event.target.value, 'confirmNewPassword')} />
                                        </div>
                                        <div className='d-flex justify-content-end'>
                                            <button className='btn btn-success mt-3' onClick={() => { handleSaveNewPassword() }}>Save changes</button>
                                        </div>
                                    </div>
                                </>
                                :
                                <div className=''>
                                    <span>Please login...</span>
                                    <button className='btn btn-warning mt-3'>Login here</button>
                                </div>
                        }

                    </div>

                    <div className="col-0 col-lg-3"></div>
                </div>
            </div>
        </div>
    )
}

export default Profile;