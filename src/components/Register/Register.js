import "./Register.scss"
import { useHistory } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../Context/Context";
import { toast } from 'react-toastify';
import { registerNewUser } from "../../services/userService";

const Register = (props) => {
    let history = useHistory();
    const handleLogin = () => {
        history.push("/login")
    }
    const { user } = useContext(UserContext);

    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const defaultCheckValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidUsername: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    }
    const [checkValidInput, setCheckValidInput] = useState(defaultCheckValidInput)

    const isValidInput = () => {
        if (!email) {
            setCheckValidInput({ ...defaultCheckValidInput, isValidEmail: false })
            toast.error("Email is required!")
            return false;
        }

        if (!phone) {
            setCheckValidInput({ ...defaultCheckValidInput, isValidPhone: false })
            toast.error("Phone is required!")
            return false;
        }

        if (!username) {
            setCheckValidInput({ ...defaultCheckValidInput, isValidUsername: false })
            toast.error("Username is required!")
            return false;
        }

        if (!password) {
            setCheckValidInput({ ...defaultCheckValidInput, isValidPassword: false })
            toast.error("Password is required!")
            return false;
        }

        if (password !== confirmPassword) {
            setCheckValidInput({ ...defaultCheckValidInput, isValidConfirmPassword: false })
            toast.error("Password & Confirm password is not same!")
            return false;
        }

        return true;
    }

    useEffect(() => {
        if (user && user.auth === true) {
            history.push("/")
        }
    }, [history, user])

    const handleRegister = async () => {

        let check = isValidInput()
        if (check) {
            let res = await registerNewUser(email, phone, username, password)
            let result = res.EC
            let message = res.EM
            let dataInvalid = res.DT

            if (result === "0") {
                if (dataInvalid === "email") {
                    setCheckValidInput({ ...defaultCheckValidInput, isValidEmail: false })
                }
                if (dataInvalid === "phone") {
                    setCheckValidInput({ ...defaultCheckValidInput, isValidPhone: false })
                }
                if (dataInvalid === "username") {
                    setCheckValidInput({ ...defaultCheckValidInput, isValidUsername: false })
                }
                if (dataInvalid === "password") {
                    setCheckValidInput({ ...defaultCheckValidInput, isValidPassword: false })
                }
                toast.error(message)
            } else {
                toast.success("Congratulations! Create new account successfully.")
                history.push("/login")
            }
        }

    }

    return (
        <div className="Register">
            <div className="register-container container-fluid position-absolute top-50 start-50 translate-middle pb-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-6">
                        <div className="child d-flex flex-column">
                            <div className="fw-bold fs-4 mb-3 text-center">
                                <span className="title-form-register">Create Account</span>
                            </div>
                            <input type="text" className={checkValidInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address"
                                value={email} onChange={(event) => setEmail(event.target.value)} />
                            <input type="text" className={checkValidInput.isValidPhone ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Phone number"
                                value={phone} onChange={(event) => setPhone(event.target.value)} />
                            <input type="text" className={checkValidInput.isValidUsername ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Username"
                                value={username} onChange={(event) => setUsername(event.target.value)} />
                            <input type="password" className={checkValidInput.isValidPassword ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Password"
                                value={password} onChange={(event) => setPassword(event.target.value)} />
                            <input type="password" className={checkValidInput.isValidConfirmPassword ? "form-control mt-3" : "form-control mt-3 is-invalid"} placeholder="Confirm password"
                                value={confirmPassword} onChange={(event) => setconfirmPassword(event.target.value)} />
                            <button className="mt-3 btn register-btn" onClick={() => handleRegister()}>Create New</button>
                            <hr />
                            <div className="text-center">
                                <button className="btn create-new-account" onClick={() => handleLogin()}>Already have an account? Login.</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;