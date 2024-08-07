import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/App-Routes';
import { useContext } from "react";
import { UserContext } from "./components/Context/Context";
import RingLoader from "react-spinners/RingLoader";

const App = (props) => {
    const { user } = useContext(UserContext)

    return (
        <Router>
            {
                user && user.isLoading === true ?
                    <div className='loading-app'>
                        <RingLoader
                            color={"#0866FF"}
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
                        <div className='app-header'>
                            <NavHeader />
                        </div>

                        <div className='app-container'>
                            <AppRoutes />
                            <ToastContainer
                                position="bottom-center"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                            />
                        </div>
                    </>
            }
        </Router>
    )
}

export default App;
