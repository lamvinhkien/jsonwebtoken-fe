import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import User from '../components/User/User';
import Role from "../components/Role/Role";
import Assign from "../components/Assign/Assign";
import Group from '../components/Group/Group';
import Profile from "../components/Profile/Profile";
import Task from "../components/Task/Task";
import TaskDetail from '../components/Task/TaskDetail';
import PrivateRoutes from "./Private-Routes";
import Home from "../components/Home/Home";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";

const AppRoutes = (props) => {
    return (
        <Switch>
            <PrivateRoutes path="/user" component={User} />
            <PrivateRoutes path="/group" component={Group} />
            <PrivateRoutes path="/role" component={Role} />
            <PrivateRoutes exact path="/task" component={Task} />
            <PrivateRoutes path="/task/:id" component={TaskDetail} />
            <PrivateRoutes path="/assign" component={Assign} />
            <PrivateRoutes path="/profile" component={Profile} />
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/forgot-password">
                <ForgotPassword />
            </Route>
            <PrivateRoutes path="/" component={Home} />
            <Route path="*">
                404 NOT FOUND
            </Route>
        </Switch>
    )
}
export default AppRoutes;