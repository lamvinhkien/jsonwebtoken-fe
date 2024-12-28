import './Nav.scss';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useHistory } from 'react-router-dom';
import { useContext, useState } from "react";
import { UserContext } from "../Context/Context";
import { logoutUser } from '../../services/userService';
import { toast } from "react-toastify";
import ModalLogout from '../User/ModalLogout';
import logo from '../../assets/logo-project.png'
import userAvatar from '../../assets/user-avatar.png'
import NavDropdown from 'react-bootstrap/NavDropdown';
const NavHeader = (props) => {
    const { user, logoutContext } = useContext(UserContext)
    const history = useHistory()

    const [isShowLogout, setIsShowLogout] = useState(false)
    const handleShowLogout = () => {
        setIsShowLogout(true)
    }
    const handleHideLogout = () => {
        setIsShowLogout(false)
    }
    const handleLogoutUser = async () => {
        let res = await logoutUser()
        if (res && res.EC === "1") {
            logoutContext()
            setIsShowLogout(false)
            toast.success("Logout successfully!")
            history.push("/login")
        } else {
            setIsShowLogout(false)
            toast.error("Logout failed!")
        }
    }
    const handleNavigate = (url) => {
        history.push(url)
    }

    return (
        <div>
            <Navbar expand="lg" data-bs-theme="light">
                {
                    props.broken &&
                    <>
                        <button className='btn btn-outline-info btn-lg' onClick={props.button}>
                            <i className="fa fa-bars"></i>
                        </button>
                        <div style={{ textAlign: "center" }}>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{ width: "60px", height: "auto" }}
                            />
                        </div>
                    </>
                }
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className='bg-info' />
                <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-end'>
                    <Nav>
                        <NavDropdown title={
                            <>
                                <span className='fw-bold '>{user.username}</span>
                                &nbsp;&nbsp;<img src={user.avatar ? process.env.REACT_APP_URL_FILES_BE + user.avatar : userAvatar}
                                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                />
                            </>
                        } id="navbarScrollingDropdown" className='text-end'>
                            <NavDropdown.Item className='fw-medium' onClick={() => { handleNavigate('/profile') }}>
                                <i className="fa fa-user"></i> Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item className='text-danger fw-medium' onClick={() => { handleShowLogout() }}>
                                <i className="fa fa-sign-out"></i> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link></Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <ModalLogout
                show={isShowLogout}
                handleClose={handleHideLogout}
                handleLogout={handleLogoutUser}
            />
        </div >
    )

}

export default NavHeader;