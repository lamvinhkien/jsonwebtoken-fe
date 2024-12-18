import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/App-Routes';
import { useContext, useState } from "react";
import { UserContext } from "./components/Context/Context";
import RingLoader from "react-spinners/RingLoader";
import Footer from './components/Footer/Footer';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import logo from './assets/logo-project-hd.png'

const App = (props) => {
    const { user } = useContext(UserContext)
    const [collapse, setCollapse] = useState(false)
    const [toggled, setToggled] = useState(false)
    const [broken, setBroken] = useState(window.matchMedia('(max-width: 992px').matches)

    return (
        <Router>
            <div className='min-vw-100'>
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
                            <div className='d-flex align-items-start'>
                                {
                                    user && user.auth === true &&
                                    <div className='app-sidebar' style={{ display: 'flex', minHeight: '729px', height: '100%' }}>
                                        <Sidebar toggled={toggled} collapsed={collapse} width='240px'
                                            customBreakPoint='992px' onBreakPoint={setBroken} backgroundColor='#f4ffff'>
                                            <Menu
                                                menuItemStyles={{
                                                    button: ({ level, active, disabled }) => {
                                                        // only apply styles on first level elements of the tree
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
                                                <SubMenu label="Assign Role" icon={<i className="fa fa-users"></i>}>
                                                    <MenuItem component={<Link to="/groups" />}> Group</MenuItem>
                                                    <MenuItem component={<Link to="/roles" />}> Role</MenuItem>
                                                    <MenuItem component={<Link to="/assign" />}> Assign</MenuItem>
                                                </SubMenu>
                                                <SubMenu label="Task Report" icon={<i className="fa fa-tasks"></i>}>
                                                    <MenuItem component={<Link to="/tasks" />}> Task</MenuItem>
                                                </SubMenu>
                                                <SubMenu label="User Account" icon={<i className="fa fa-user"></i>}>
                                                    <MenuItem component={<Link to="/users" />}> User</MenuItem>
                                                </SubMenu>
                                            </Menu>
                                            {
                                                broken ?
                                                    <div className='text-center mt-3'>
                                                        <button className='btn btn-outline-info btn-lg' onClick={() => setToggled(!toggled)}>
                                                            <i className="fa fa-arrow-left"></i>
                                                        </button>
                                                    </div>
                                                    :
                                                    <>
                                                        {
                                                            collapse === false ?
                                                                <div className='text-center mt-3'>
                                                                    <button className='btn btn-outline-info btn-lg' onClick={() => setCollapse(!collapse)}
                                                                    ><i className="fa fa-arrow-left"></i></button>
                                                                </div>
                                                                :
                                                                <div className='text-center mt-3'>
                                                                    <button className='btn btn-outline-info btn-lg' onClick={() => setCollapse(!collapse)}
                                                                    ><i className="fa fa-arrow-right"></i></button>
                                                                </div>
                                                        }
                                                    </>
                                            }
                                        </Sidebar>
                                    </div>
                                }
                                <div className='app-main w-100' style={{ paddingRight: '15px' }}>
                                    <div className='row align-items-start'>
                                        {
                                            user && user.auth === true &&
                                            <div className='app-header col-lg-12'>
                                                <div className='px-2 border-bottom' style={{ backgroundColor: "#f4ffff" }}>
                                                    <NavHeader
                                                        broken={broken}
                                                        button={() => setToggled(!toggled)}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        <div className='app-content col-lg-12' style={user && user.auth ? { minHeight: '617px' } : { minHeight: '685px' }}>
                                            <div className='px-3 py-1' style={{ height: '100%' }}>
                                                <AppRoutes />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='app-footer'>
                                        <Footer />
                                    </div>
                                </div>
                            </div>
                            <ToastContainer
                                position="bottom-center"
                                autoClose={5000}
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
            </div>
        </Router>
    )
}

export default App;
