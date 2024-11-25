import "./Login.scss"
import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";
import { UserContext } from "../Context/Context";

const Login = (props) => {
    let history = useHistory();
    const handleCreateNewAccount = () => {
        history.push("/register")
    }

    const [valueLogin, setValueLogin] = useState("")
    const [password, setPassword] = useState("")

    const defaultValidInput = {
        isValidValueLogin: true,
        isValidPassword: true
    }

    const [isValidInput, setIsValidInput] = useState(defaultValidInput)

    const { user, loginContext } = useContext(UserContext);

    const handleLogin = async () => {
        if (!valueLogin) {
            setIsValidInput({ ...defaultValidInput, isValidValueLogin: false })
            toast.error("Please enter your email address or phone number.")
            return;
        }

        if (!password) {
            setIsValidInput({ ...defaultValidInput, isValidPassword: false })
            toast.error("Please enter your password.")
            return;
        }

        let res = await loginUser(valueLogin, password)
        if (res.EC === "1") {
            loginContext(res.DT)
            history.push("/")
            toast.success(res.EM)
        } else {
            if (res.DT === 'email') {
                setIsValidInput({ ...defaultValidInput, isValidValueLogin: false })
                toast.error(res.EM)
            }
            if (res.DT === 'password') {
                setIsValidInput({ ...defaultValidInput, isValidPassword: false })
                toast.error(res.EM)
            }
            if (res.DT === '') {
                toast.error(res.EM)
            }
        }

    }

    const handlePressEnter = (event) => {
        if (event.key === "Enter" && event.keyCode === 13) {
            handleLogin()
        }
    }

    const returnToHomePage = () => {
        history.push("/")
    }

    const [isVisible, setVisible] = useState(false);

    const handleShowPassword = () => {
        setVisible(!isVisible);
    }

    const handleGoogle = async () => {
        window.location.href = `http://localhost:8080/api/login/google`
    }

    const handleFacebook = async () => {
        window.location.href = `http://localhost:8080/api/login/facebook`
    }

    const handleForgotPassword = async () => {
        history.push('/forgot-password')
    }

    useEffect(() => {
        if (user && user.auth === true) {
            history.push("/")
        }
    }, [history, user])

    return (
        <div className="Login">
            <div className="login-container container position-absolute top-50 start-50 translate-middle px-md-5 pb-5 px-4">
                <div className="row">
                    <div className="col-12 mb-2 d-lg-none d-block">
                        <div className="logo-mobile">
                            JWT Project
                        </div>
                    </div>

                    <div className="left mt-3 col-12 col-lg-6 d-none d-lg-block">
                        <div className="left-child">
                            <div className="logo text-center">
                                JWT Project
                            </div>
                            <div className="description text-center mt-2">
                                <span className='fst-italic content'>Register, Login, Logout, Assign user with</span>
                                <div className="desProject">
                                    <img src='/jwt-3.svg' width={'10%'} className='img' alt="" />
                                    <span className='fw-medium'>JSONWEBTOKEN</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right col-lg-6">
                        <div className="right-child d-flex flex-column">
                            <div className="fw-medium fs-4 mb-3 text-center">
                                <span>Account Login</span>
                            </div>
                            <input type="text"
                                className={isValidInput.isValidValueLogin ? "form-control form-control-lg" : "form-control form-control-lg is-invalid"}
                                placeholder="Email address or phone number"
                                value={valueLogin} onChange={(event) => { setValueLogin(event.target.value) }}
                                onKeyDown={(event) => handlePressEnter(event)} />

                            <div className="input-group mt-3">
                                <input type={!isVisible ? "password" : "text"}
                                    className={isValidInput.isValidPassword ? "form-control form-control-lg" : "form-control form-control-lg is-invalid"}
                                    placeholder="Password"
                                    value={password} onChange={(event) => { setPassword(event.target.value) }}
                                    onKeyDown={(event) => handlePressEnter(event)} />

                                <button className="btn btn-outline-secondary" onClick={() => { handleShowPassword() }}>
                                    <i className={!isVisible ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                                </button>
                            </div>

                            <button className="mt-3 login-btn" onClick={() => handleLogin()} >Log In</button>
                            <div className="d-flex justify-content-between back-forget mt-2">
                                <span className="" onClick={() => returnToHomePage()}>Return to homepage <i className="fa fa-undo"></i></span>
                                <span className="" onClick={() => { handleForgotPassword() }}>Forgotten password?</span>
                            </div>

                            <hr />

                            <p className="fs-6 text-center">Don't have an account?</p>
                            <button className="create-new-account" onClick={() => handleCreateNewAccount()}>Create New Account</button>

                            <hr />

                            <p className="text-center">Or</p>
                            <div className="d-flex justify-content-center text-center">
                                <div type="button" className="google-button" onClick={() => { handleGoogle() }}>
                                    <i className="fa fa-google"></i> Log in with Google
                                </div>

                                <div type="button" className="facebook-button" onClick={() => { handleFacebook() }}>
                                    <i className="fa fa-facebook-f"></i> Log in with Facebook
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;