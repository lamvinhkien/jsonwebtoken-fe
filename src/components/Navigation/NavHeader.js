import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { useContext, useState } from "react";
import { UserContext } from "../Context/Context";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { logoutUser } from '../../services/userService';
import { toast } from "react-toastify";
import ModalLogout from '../User/ModalLogout';

const NavHeader = () => {
    const { user } = useContext(UserContext)
    const location = useLocation()
    const history = useHistory()
    const { logoutContext } = useContext(UserContext)

    // Confirm Logout
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

    if (user && user.auth === true || location.pathname === "/") {
        return (
            <>
                <Navbar collapseOnSelect expand="lg" className="nav-header">
                    <Container>
                        <Navbar.Brand href="#home" className="logoJWT">
                            JSONWEBTOKEN
                        </Navbar.Brand>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <NavLink to="/" className="option" exact>Home</NavLink>
                                <NavLink to="/users" className="option">User</NavLink>
                                <NavLink to="/roles" className="option">Role</NavLink>
                                <NavLink to="/projects" className="option">Project</NavLink>
                                {user.auth === true ? <NavLink to="/change-password" className="option">Change Password</NavLink> : <></>}
                            </Nav>

                            <Nav>
                                {user.username ? <Nav.Link className="option">Welcome {user.username}!</Nav.Link> : <></>}
                                {user.auth === true ? <Nav.Link to="/logout" className="option"><span onClick={() => { handleShowLogout() }}>Logout</span></Nav.Link>
                                    : <Link to="/login" className="option">Login</Link>}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <ModalLogout
                    show={isShowLogout}
                    handleClose={handleHideLogout}
                    handleLogout={handleLogoutUser}
                />
            </>
        )
    } else {
        return <></>
    }
}

export default NavHeader;