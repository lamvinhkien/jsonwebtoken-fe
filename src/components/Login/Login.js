import "./Login.scss"
import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";
import { UserContext } from "../Context/Context";
import logo from '../../assets/logo-project.png'

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
            <div className="login-container container position-absolute top-50 start-50 translate-middle">
                <div className="row">
                    <div className="left mt-3 col-lg-6 d-none d-lg-block">
                        <div className="left-child">
                            <div style={{ textAlign: "center", margin: "0" }}>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{ width: "170px", height: "auto" }}
                                />
                            </div>
                            <div className="description text-center mt-2">
                                <div>
                                    Streamline Tasks, Enhance Collaboration
                                </div>
                                <div>
                                    and Empower Your Workforce.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="right col-12 col-lg-6">
                        <div className="right-child d-flex flex-column">
                            <div className="d-lg-none d-block d-flex justify-content-between align-items-center mb-3">
                                <div className="fw-bold fs-4">
                                    <span className="title-form-login">Account Login</span>
                                </div>
                                <div>
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        style={{ width: "50px", height: "auto" }}
                                    />
                                </div>
                            </div>
                            <div className="d-none d-lg-block fw-bold fs-4 mb-3 text-center">
                                <span className="title-form-login">Account Login</span>
                            </div>
                            <input type="text"
                                className={isValidInput.isValidValueLogin ? "form-control form-control-lg" : "form-control form-control-lg is-invalid"}
                                placeholder="Email or phone number"
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

                            <button className="mt-3 btn login-btn" onClick={() => handleLogin()} >Log In</button>
                            <div className="d-flex justify-content-end forget mt-2">
                                <span className="" onClick={() => { handleForgotPassword() }}>Forgotten password?</span>
                            </div>

                            <hr />

                            <span className="fs-6 text-center">Don't have an account?</span>
                            <div className="mt-2">
                                <button className="btn create-new-account w-100" onClick={() => handleCreateNewAccount()}>Create New Account</button>
                            </div>

                            <hr />

                            <span className="text-center">Or login with</span>
                            <div className="row">
                                <div className="col-lg-6 col-md-12 mt-2">
                                    <button className="btn google-button w-100" onClick={() => { handleGoogle() }}>
                                        <i className="fa fa-google"></i> Google
                                    </button>
                                </div>
                                <div className="col-lg-6 col-md-12 mt-2">
                                    <button className="btn facebook-button w-100" onClick={() => { handleFacebook() }}>
                                        <i className="fa fa-facebook-f"></i> Facebook
                                    </button>
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