import './ForgotPassword.scss'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
        history.push('/login')
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
            history.push('/login')
        }
    }
    const renderTooltipSend = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            We will send OTP code to your email or phone number.
        </Tooltip>
    );
    const renderTooltipConfirm = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Enter the OTP code we sent to your email or phone number to reset your password.
        </Tooltip>
    );

    return (
        <div className="ForgotPassword">
            <div className="forgotpassword-container container-fluid position-absolute top-50 start-50 translate-middle pb-5">
                <div className="row">
                    <div className="col-0 col-lg-4"></div>
                    <div className="father col-12 col-lg-4">
                        <div className="child d-flex flex-column">
                            <div className="">
                                <span className='fw-medium fs-5'>Find your account</span>
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 50, hide: 150 }}
                                    overlay={renderTooltipSend}
                                >
                                    <i className="fa fa-info-circle mx-2"></i>
                                </OverlayTrigger>
                            </div>
                            <div className="input-group mt-2">
                                <input type="text" className={isValidInput.emailUser === true ? "form-control" : "form-control is-invalid"}
                                    placeholder="Please type your email or phone number"
                                    value={emailUser}
                                    onChange={(event) => { handleEmailValue(event.target.value) }}
                                />
                                <button className="btn btn-primary" disabled={seconds > 0 ? true : false} onClick={() => { handleSendOTP() }}>
                                    {seconds > 0 ? (
                                        <span>
                                            {seconds < 10 ? `0${seconds}` : seconds}s
                                        </span>
                                    ) : (
                                        <span>Send OTP</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="child d-flex flex-column mt-4">
                            <div className="">
                                <span className='fw-medium fs-5'>Reset your password</span>
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 50, hide: 150 }}
                                    overlay={renderTooltipConfirm}
                                >
                                    <i className="fa fa-info-circle mx-2"></i>
                                </OverlayTrigger>
                            </div>
                            <div className='mt-2'>
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

                                <div className='text-end'>
                                    <button className='btn btn-success mt-3' onClick={() => { handleResetPassword() }}>
                                        Reset password
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className='back-forget text-end mt-1'>
                            <span className="" onClick={() => returnToLoginPage()}>Return to login page <i className="fa fa-undo"></i></span>
                        </div>
                    </div>
                    <div className="col-0 col-lg-4"></div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;