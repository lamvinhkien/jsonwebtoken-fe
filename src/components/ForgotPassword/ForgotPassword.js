import './ForgotPassword.scss'
import { useHistory } from 'react-router-dom'
import { sendOTP, resetPassword } from '../../services/userService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ForgotPassword = (props) => {
    const history = useHistory()
    const [emailUser, setEmailUser] = useState('')
    const [codeOTP, setCodeOTP] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfrimPassword] = useState('')

    const defaultIsValidInput = {
        emailUser: true,
        codeOTP: true,
        newPassword: true,
        confirmPassword: true,
    }
    const [isValidInput, setIsValidInput] = useState(defaultIsValidInput)

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    const handleEmailValue = (event) => {
        setEmailUser(event)
    }
    const handleCodeValue = (event) => {
        setCodeOTP(event)
    }
    const handleNewPwValue = (event) => {
        setNewPassword(event)
    }
    const handleCfPwValue = (event) => {
        setConfrimPassword(event)
    }
    const returnToLoginPage = () => {
        history.push('/')
    }
    const handleSendOTP = async () => {
        let res = await sendOTP(emailUser)

        if (res.EC === '0') {
            setIsValidInput({ ...defaultIsValidInput, emailUser: false })
            toast.error(res.EM)
        }

        if (res.EC === '1') {
            setIsValidInput({ ...defaultIsValidInput })
            setSeconds(30);
            toast.success(res.EM)
        }
    }
    const handleResetPassword = async () => {
        let res = await resetPassword(emailUser, codeOTP, newPassword, confirmPassword)

        if (res.EC === '0' && res.DT === 'email') {
            setIsValidInput({ ...defaultIsValidInput, emailUser: false })
            toast.error(res.EM)
        }

        if (res.EC === '0' && res.DT === 'new') {
            setIsValidInput({ ...defaultIsValidInput, newPassword: false })
            toast.error(res.EM)
        }

        if (res.EC === '0' && res.DT === 'confirm') {
            setIsValidInput({ ...defaultIsValidInput, confirmPassword: false })
            toast.error(res.EM)
        }

        if (res.EC === '0' && res.DT === 'code') {
            setIsValidInput({ ...defaultIsValidInput, codeOTP: false })
            toast.error(res.EM)
        }

        if (res.EC === '1') {
            setIsValidInput({ ...defaultIsValidInput })
            toast.success('Congratulations! Reset password successfully.')
            history.push('/')
        }
    }

    return (
        <div className='ForgotPassword containter py-3 px-3 py-lg-5 px-lg-5'>
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-5">
                    <div className="card">
                        <div className="card-header">
                            <span className='fw-bold fs-5 title-form-forgot'>Find your account</span>
                        </div>
                        <div className='card-body'>
                            <div style={{ fontSize: '14.5px' }}>
                                We will send OTP code to your email or phone number.
                            </div>
                            <div className='mt-2'>
                                <input type="text" className={isValidInput.emailUser === true ? "form-control" : "form-control is-invalid"}
                                    placeholder="Please type your email or phone number"
                                    value={emailUser}
                                    onChange={(event) => { handleEmailValue(event.target.value) }}
                                />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className='row justify-content-end'>
                                <div className='col-12 col-md-3'>
                                    <button className="btn submit-btn w-100" disabled={seconds > 0 ? true : false} onClick={() => { handleSendOTP() }}>
                                        {seconds > 0 ? (
                                            <span>
                                                {seconds < 10 ? `0${seconds}` : seconds}s
                                            </span>
                                        ) : (
                                            <span>Send</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                            <span className='fw-bold fs-5 title-form-forgot'>Reset your password</span>
                        </div>
                        <div className='card-body'>
                            <div className='mb-2' style={{ fontSize: '14.5px' }}>
                                Enter the OTP code we sent to your email or phone number to reset your password.
                            </div>
                            <input type="text" className={isValidInput.codeOTP === true ? "form-control" : "form-control is-invalid"}
                                placeholder="Please type your code OTP"
                                value={codeOTP}
                                onChange={(event) => { handleCodeValue(event.target.value) }}
                            />

                            <input type="password" className={isValidInput.newPassword === true ? "form-control mt-3" : "form-control is-invalid mt-3"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(event) => { handleNewPwValue(event.target.value) }}
                            />

                            <input type="password" className={isValidInput.confirmPassword === true ? "form-control mt-3" : "form-control is-invalid mt-3"}
                                placeholder="Cofirm new password"
                                value={confirmPassword}
                                onChange={(event) => { handleCfPwValue(event.target.value) }}
                            />
                        </div>
                        <div className='card-footer'>
                            <div className='row justify-content-end'>
                                <div className='col-12 col-md-3'>
                                    <button className='btn submit-btn w-100' onClick={() => { handleResetPassword() }}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='back-forget text-end mt-1'>
                        <span className="" onClick={() => returnToLoginPage()}>Return to login page <i className="fa fa-undo"></i></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;