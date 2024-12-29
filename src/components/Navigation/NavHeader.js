import './Nav.scss';
import Navbar from 'react-bootstrap/Navbar';
import { useHistory } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
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
            history.push("/")
        } else {
            setIsShowLogout(false)
            toast.error("Logout failed!")
        }
    }
    const handleNavigate = (url) => {
        history.push(url)
    }

    const [isMobile, setIsMobile] = useState(window.innerWidth < 992)
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            <Navbar expand="lg" data-bs-theme="light">
                {props.broken && (
                    <>
                        <button className="btn btn-outline-info btn-lg" onClick={props.button}>
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
                )}

                {isMobile ?
                    <>
                        <img
                            src={user.avatar ? process.env.REACT_APP_URL_FILES_BE + user.avatar : userAvatar}
                            alt="User Avatar"
                            style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
                            onClick={handleDropdownToggle}
                        />
                        {showDropdown && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "60px", // Điều chỉnh vị trí dropdown
                                    right: "15px",
                                    backgroundColor: "white",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "5px",
                                    zIndex: 1050,
                                }}
                            >
                                <NavDropdown.Item
                                    className="fw-medium py-2 px-4 border-bottom"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleNavigate("/profile");
                                    }}
                                >
                                    <i className="fa fa-user"></i> Profile
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    className="text-danger fw-medium py-2 px-4"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleShowLogout();
                                    }}
                                >
                                    <i className="fa fa-sign-out"></i> Logout
                                </NavDropdown.Item>
                            </div>
                        )}
                    </>
                    :
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                        <NavDropdown
                            title={
                                <>
                                    <span className="fw-bold">{user.username}</span>
                                    &nbsp;&nbsp;
                                    <img
                                        src={
                                            user.avatar
                                                ? process.env.REACT_APP_URL_FILES_BE + user.avatar
                                                : userAvatar
                                        }
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            borderRadius: "50%",
                                        }}
                                        alt="Avatar"
                                    />
                                </>
                            }
                            id="navbarScrollingDropdown"
                            className="text-end"
                        >
                            <NavDropdown.Item
                                className="fw-medium"
                                onClick={() => {
                                    handleNavigate("/profile");
                                }}
                            >
                                <i className="fa fa-user"></i> Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                className="text-danger fw-medium"
                                onClick={() => {
                                    handleShowLogout();
                                }}
                            >
                                <i className="fa fa-sign-out"></i> Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                }
            </Navbar>

            <ModalLogout
                show={isShowLogout}
                handleClose={handleHideLogout}
                handleLogout={handleLogoutUser}
            />
        </>
    )

}

export default NavHeader;