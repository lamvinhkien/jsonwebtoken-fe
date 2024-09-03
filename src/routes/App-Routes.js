import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import User from '../components/User/User';
import Role from "../components/Role/Role";
import Assign from "../components/Assign/Assign";
import Groups from '../components/Group/Group';
import Profile from "../components/Profile/Profile";
import PrivateRoutes from "./Private-Routes";
import Home from "../components/Home/Home";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";

const AppRoutes = (props) => {
    return (
        <Switch>
            <PrivateRoutes path="/users" component={User} />
            <PrivateRoutes path="/groups" component={Groups} />
            <PrivateRoutes path="/roles" component={Role} />
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
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="*">
                404 NOT FOUND
            </Route>
        </Switch>
    )
}
export default AppRoutes;