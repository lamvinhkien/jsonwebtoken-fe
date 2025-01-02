import { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import './Profile.scss';
import _ from 'lodash';
import { UserContext } from '../Context/Context';
import { changeInfor, changePassword, changeAvatar, removeAvatar } from '../../services/userService';
import { toast } from 'react-toastify';
import userAavatar from '../../assets/user-avatar.png'
import moment from 'moment';

const Profile = () => {
    let history = useHistory();
    const [valueInput, setValueInput] = useState({
        email: '',
        phone: '',
        avatar: '',
        username: '',
        dateOfBirth: '',
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
        isValidDateOfBirth: true,
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

    const handleChangeAvavatar = async (event) => {
        if (event && event.target.files.length > 0) {
            if (event.target.files[0].type.startsWith("image/")) {
                let formData = new FormData()
                formData.append('id', user.id)
                formData.append('groupId', user.data.id)
                formData.append('avatar', event.target.files[0])
                let res = await changeAvatar(formData)
                if (res && res.EC === '1') {
                    await fetchUser()
                    toast.success(res.EM)
                } else {
                    toast.error(res.EM)
                }
            } else {
                toast.error('Please upload image file.')
            }
        } else {
            toast.error('Please upload image file.')
        }
        event.target.value = null
    }

    const handleRemoveAvatar = async () => {
        if (valueInput.avatar !== '') {
            let res = await removeAvatar(user.id, user.data.id)
            if (res && res.EC === '1') {
                await fetchUser()
                toast.success(res.EM)
            } else {
                toast.error(res.EM)
            }
        } else {
            toast.error(`You don't have avatar.`)
        }
    }

    const handleSaveEmailPhone = async () => {
        let res = await changeInfor(user.id, user.email, user.data.id, user.typeAccount, { email: valueInput.email, phone: valueInput.phone, username: valueInput.username, dateOfBirth: valueInput.dateOfBirth, gender: valueInput.gender, address: valueInput.address })
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

            if (res.DT === 'dateOfBirth') {
                setCheckValidInput({ ...defaultValid, isValidDateOfBirth: false })
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
            history.push("/")
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
            setValueInput({ email: user.email, phone: user.phone, avatar: user.avatar, username: user.username, dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : null, gender: user.gender, address: user.address, group: user.data.name })
        }
    }, [user])

    return (
        <>
            <div className='content-card-body'>
                <div className='row align-items-center'>
                    <div className='col-12 mb-3'>
                        <span className='fs-4 fw-bold text-info'><i className="fa fa-address-book"></i>&nbsp;Change Information</span>
                    </div>
                    <div className='col-12 col-lg-4 text-center'>
                        <div className=''>
                            <img src={valueInput.avatar ? process.env.REACT_APP_URL_FILES_BE + valueInput.avatar : userAavatar} alt='avatar'
                                style={{ width: '210px', height: '210px', borderRadius: '50%' }} />
                        </div>
                        <div className='mt-3 d-flex justify-content-center gap-2'>
                            <div>
                                <button className='btn btn-outline-danger' onClick={() => { handleRemoveAvatar() }}>Remove</button>
                            </div>
                            <div>
                                <label className='btn btn-outline-info' htmlFor='avatar'>Upload</label>
                                <input type='file' hidden id='avatar' accept='image/*'
                                    onChange={(event) => { handleChangeAvavatar(event) }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-8'>
                        <div className='row'>
                            {
                                user.typeAccount === 'LOCAL' &&
                                <div className='col-12'>
                                    <label className='mb-1'>Email</label>
                                    <input
                                        type="text" className={checkValidInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address"
                                        value={valueInput.email} onChange={(event) => handleOnChangeInput(event.target.value, 'email')}
                                    />
                                </div>
                            }
                            <div className='col-12 col-lg-6 mt-3'>
                                <label className='mb-1'>Name</label>
                                <input type="text" className={checkValidInput.isValidUsername ? "form-control" : "form-control is-invalid"} placeholder="Username"
                                    value={valueInput.username} onChange={(event) => handleOnChangeInput(event.target.value, 'username')} />
                            </div>
                            <div className='col-12 col-lg-6 mt-3'>
                                <label className='mb-1'>Phone</label>
                                <input type="text" className={checkValidInput.isValidPhone ? "form-control" : "form-control is-invalid"} placeholder="Phone number"
                                    value={valueInput.phone} onChange={(event) => handleOnChangeInput(event.target.value, 'phone')} />
                            </div>
                            <div className='col-12 col-lg-4 mt-3'>
                                <label className='mb-1'>Date of birth</label>
                                <input type="date" className={checkValidInput.isValidDateOfBirth ? "form-control" : "form-control is-invalid"}
                                    value={valueInput.dateOfBirth} onChange={(event) => handleOnChangeInput(event.target.value, 'dateOfBirth')} />
                            </div>
                            <div className='col-12 col-lg-4 mt-3'>
                                <label className='mb-1'>Gender</label>
                                <select className="form-select" value={valueInput.gender} onChange={(event) => handleOnChangeInput(event.target.value, "gender")}>
                                    <option defaultValue={"Male"}>Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className='col-12 col-lg-4 mt-3'>
                                <label className='mb-1'>Group</label>
                                <input
                                    type="text" className='form-control' value={valueInput.group} disabled
                                />
                            </div>
                            <div className='col-12 col-lg-12 mt-3'>
                                <label className='mb-1'>Address</label>
                                <input type="text" className={checkValidInput.isValidAddress ? "form-control" : "form-control is-invalid"} placeholder="Address"
                                    value={valueInput.address} onChange={(event) => handleOnChangeInput(event.target.value, 'address')} />
                            </div>
                            <div className='col-12 text-end mt-3'>
                                <button className='btn btn-success' onClick={() => { handleSaveEmailPhone() }}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                user.typeAccount === 'LOCAL' ?
                    <div className='content-card-body mt-3'>
                        <div className='row'>
                            <div className='col-12 mb-3'>
                                <span className='fs-4 fw-bold text-info'><i className="fa fa-lock"></i>&nbsp;Change Password</span>
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
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default Profile;