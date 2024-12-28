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
    const [gender, setGender] = useState("Male")
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const defaultCheckValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidUsername: true,
        isValidDateOfBirth: true,
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

        if (!dateOfBirth) {
            setCheckValidInput({ ...defaultCheckValidInput, isValidDateOfBirth: false })
            toast.error("Date of birth is required!")
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

    const [isVisible, setVisible] = useState(false);
    const handleShowPassword = () => {
        setVisible(!isVisible);
    }

    useEffect(() => {
        if (user && user.auth === true) {
            history.push("/")
        }
    }, [history, user])

    const handleRegister = async () => {
        let check = isValidInput()
        if (check) {
            let res = await registerNewUser(email, phone, gender, username, dateOfBirth, password)
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
            <div className="register-container container position-absolute top-50 start-50 translate-middle">
                <div className="row justify-content-center">
                    <div className="col-11 col-lg-7">
                        <div className="child row">
                            <div className="fw-bold fs-4 mb-3 text-center col-12">
                                <span className="title-form-register">Create Account</span>
                            </div>
                            <div className="col-12 mb-3">
                                <input type="text" className={checkValidInput.isValidEmail ? "form-control" : "form-control is-invalid"} placeholder="Email address"
                                    value={email} onChange={(event) => setEmail(event.target.value)} />
                            </div>
                            <div className="col-12 mb-3">
                                <input type="text" className={checkValidInput.isValidPhone ? "form-control" : "form-control is-invalid"} placeholder="Phone number"
                                    value={phone} onChange={(event) => setPhone(event.target.value)} />
                            </div>
                            <div className="col-12 mb-3">
                                <input type="text" className={checkValidInput.isValidUsername ? "form-control" : "form-control is-invalid"} placeholder="Username"
                                    value={username} onChange={(event) => setUsername(event.target.value)} />
                            </div>
                            <div className="col-lg-7 mb-3">
                                <label className="mb-1 mx-1">Date of Birth</label>
                                <input type="date" className={checkValidInput.isValidDateOfBirth ? "form-control" : "form-control is-invalid"}
                                    value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
                            </div>
                            <div className="col-lg-5 mb-3">
                                <label className="mb-1 mx-1">Gender</label>
                                <select className="form-select"
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
                                >
                                    <option defaultValue={"Male"}>Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="col-12 mb-3">
                                <div className="input-group">
                                    <input type={!isVisible ? "password" : "text"}
                                        className={checkValidInput.isValidPassword ? "form-control" : "form-control is-invalid"} placeholder="Password"
                                        value={password} onChange={(event) => setPassword(event.target.value)} />
                                    <button className="btn btn-outline-secondary" onClick={() => { handleShowPassword() }}>
                                        <i className={!isVisible ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-12 mb-3">
                                <input type={!isVisible ? "password" : "text"}
                                    className={checkValidInput.isValidConfirmPassword ? "form-control" : "form-control is-invalid"} placeholder="Confirm password"
                                    value={confirmPassword} onChange={(event) => setconfirmPassword(event.target.value)} />
                            </div>
                            <div className="col-12">
                                <div className="row align-items-center">
                                    <div className="col-12 col-lg-4 d-flex justify-content-center justify-content-lg-start">
                                        <button className="btn register-btn" onClick={() => handleRegister()}>Create New</button>
                                    </div>
                                    <div className="col-12 col-lg-8 d-flex mt-2 justify-content-center justify-content-lg-end mt-lg-0">
                                        <button className="btn create-new-account" onClick={() => handleLogin()}>Already have an account? Login.</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;