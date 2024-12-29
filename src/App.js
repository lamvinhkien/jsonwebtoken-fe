import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/App-Routes';
import AuthRoutes from './routes/Auth-Routes';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./components/Context/Context";
import RingLoader from "react-spinners/RingLoader";
import Footer from './components/Footer/Footer';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import logo from './assets/logo-project.png'

const App = () => {
    const { user } = useContext(UserContext)
    const [collapse, setCollapse] = useState(false)
    const [toggled, setToggled] = useState(false)
    const [broken, setBroken] = useState(window.matchMedia('(max-width: 992px)').matches)

    useEffect(() => {
        if (broken) {
            setCollapse(false)
        }
    }, [broken])

    return (
        <Router>
            {
                user && user.isLoading === true ?
                    <div className='loading-app'>
                        <RingLoader
                            color={"#0CBDDF"}
                            loading={user.isLoading}
                            cssOverride={""}
                            size={80}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                        <span>
                            Loading.....
                        </span>
                    </div>
                    :
                    <>
                        {
                            user && user.auth === true ?
                                <div className='min-vw-100 d-flex justify-content-start align-items-start'>
                                    <div className='app-sidebar'
                                        style={{
                                            width: broken ? '0px' : collapse ? '80px' : '240px',
                                        }}>
                                        <Sidebar toggled={toggled} collapsed={collapse} width='240px' backgroundColor='#f4ffff'
                                            customBreakPoint='992px' onBreakPoint={setBroken} style={{ border: '0' }}>
                                            <Menu
                                                menuItemStyles={{
                                                    button: ({ level, active, disabled }) => {
                                                        if (level === 0)
                                                            return {
                                                                color: disabled ? '#0DCAF0' : '#0DCAF0',
                                                                backgroundColor: active ? '#0DCAF0' : undefined,
                                                            };
                                                    },
                                                }}
                                            >
                                                <div style={{ textAlign: "center", margin: "15px 0" }}>
                                                    <img
                                                        src={logo}
                                                        alt="Logo"
                                                        style={{ width: "80px", height: "auto" }}
                                                    />
                                                </div>
                                                {user.data && user.data.name === "Admin" &&
                                                    <>
                                                        <SubMenu label="Assign Role" icon={<i className="fa fa-users"></i>}>
                                                            <MenuItem component={<Link to="/group" />}> Group</MenuItem>
                                                            <MenuItem component={<Link to="/role" />}> Role</MenuItem>
                                                            <MenuItem component={<Link to="/assign" />}> Assign</MenuItem>
                                                        </SubMenu>
                                                        <SubMenu label="User Account" icon={<i className="fa fa-user"></i>}>
                                                            <MenuItem component={<Link to="/user" />}> User</MenuItem>
                                                        </SubMenu>
                                                        <SubMenu label="Task Report" icon={<i className="fa fa-tasks"></i>}>
                                                            <MenuItem component={<Link to="/task" />}> Task</MenuItem>
                                                        </SubMenu>
                                                    </>
                                                }
                                                {user.data && user.data.name === "Manager" &&
                                                    <>
                                                        <SubMenu label="Task Report" icon={<i className="fa fa-tasks"></i>}>
                                                            <MenuItem component={<Link to="/task" />}> Task</MenuItem>
                                                        </SubMenu>
                                                    </>
                                                }
                                                {user.data && user.data.name === "Employee" &&
                                                    <>
                                                        <SubMenu label="Task Report" icon={<i className="fa fa-tasks"></i>}>
                                                            <MenuItem component={<Link to="/task" />}> Task</MenuItem>
                                                        </SubMenu>
                                                    </>
                                                }
                                            </Menu>
                                            {
                                                broken ?
                                                    <div className='text-center mt-1'>
                                                        <button className='btn btn-outline-info btn-lg' onClick={() => setToggled(!toggled)}>
                                                            <i className="fa fa-arrow-left"></i>
                                                        </button>
                                                    </div>
                                                    :
                                                    <div className='text-center mt-1'>
                                                        <button className='btn btn-outline-info btn-lg' onClick={() => setCollapse(!collapse)}
                                                        ><i className={collapse === false ? "fa fa-arrow-left" : "fa fa-arrow-right"}></i></button>
                                                    </div>
                                            }
                                        </Sidebar>
                                    </div>
                                    <div className='app-main w-100'
                                        style={{
                                            marginLeft: broken ? '0px' : collapse ? '80px' : '240px',
                                            transition: 'all 0.3s ease-in-out'
                                        }}>
                                        <div className='app-header' style={{
                                            paddingRight: broken ? '12px' : '22px',
                                            paddingLeft: broken ? '12px' : '0px',
                                            borderBottom: '1.5px solid #eef0f3',
                                            backgroundColor: "#f4ffff"
                                        }}>
                                            <NavHeader
                                                broken={broken}
                                                button={() => setToggled(!toggled)}
                                            />
                                        </div>
                                        <div className='app-content' style={{
                                            minHeight: '617px',
                                            padding: broken ? '10px 10px 0px 10px' : '10px 25px 0px 10px',
                                        }}>
                                            <AppRoutes />
                                        </div>
                                        <div className='app-footer'>
                                            <Footer />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='min-vh-100 min-vw-100' style={{ backgroundColor: '#f0f2f5' }}>
                                    <AuthRoutes />
                                    <Footer />
                                </div>
                        }
                        <ToastContainer
                            position="top-center"
                            autoClose={4000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </>
            }
        </Router>
    )
}

export default App;
