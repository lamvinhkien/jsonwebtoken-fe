import "./Login.scss"
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";

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
        if (res.data.EC === "1") {
            let infoToken = {
                token: "Fake Token",
                email: res.data.DT
            }
            sessionStorage.setItem("TOKEN", JSON.stringify(infoToken))
            toast.success(res.data.EM)
            history.push("/users")
        } else {
            toast.error(res.data.EM)
        }

    }

    const handlePressEnter = (event) => {
        if(event.key === "Enter" && event.keyCode === 13){
            handleLogin()
        }
    }

    useEffect(() => {
        let sessionToken = sessionStorage.getItem("TOKEN")
        if (sessionToken) {
            history.push("/users")
        }
    })

    return (
        <div className="Login">
            <div className="login-container container position-absolute top-50 start-50 translate-middle px-md-5 pb-5 px-4">
                <div className="row">
                    <div className="col-12 mb-2 d-lg-none d-block">
                        <div className="logo-mobile">
                            17Sep
                        </div>
                    </div>

                    <div className="left mt-3 col-12 col-lg-6 d-none d-lg-block">
                        <div className="left-child">
                            <div className="logo">
                                17Sep
                            </div>
                            <div className="description">
                                17Sep helps you connect and share with the people in your life.
                            </div>
                        </div>
                    </div>

                    <div className="right col-lg-6">
                        <div className="right-child d-flex flex-column">
                            <input type="text"
                                className={isValidInput.isValidValueLogin ? "form-control form-control-lg" : "form-control form-control-lg is-invalid"}
                                placeholder="Email address or phone number"
                                value={valueLogin} onChange={(event) => { setValueLogin(event.target.value) }}
                                onKeyDown={(event)=> handlePressEnter(event)} />

                            <input type="password"
                                className={isValidInput.isValidPassword ? "form-control form-control-lg mt-3" : "form-control form-control-lg mt-3 is-invalid"}
                                placeholder="Password"
                                value={password} onChange={(event) => { setPassword(event.target.value) }}
                                onKeyDown={(event)=> handlePressEnter(event)} />

                            <button className="mt-3 login-btn" onClick={() => handleLogin()} >Log In</button>
                            <a className="mt-3 mb-1 forget-password" href="https://facebook.com/lamvinhkien1709">Forgotten password?</a>
                            <hr />
                            <div className="text-center">
                                <button className="mt-2 create-new-account" onClick={() => handleCreateNewAccount()}>Create New Account</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;