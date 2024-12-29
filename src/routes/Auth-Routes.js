import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";

const AuthRoutes = (props) => {
    return (
        <Switch>
            <Route exact path="/">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/forgot-password">
                <ForgotPassword />
            </Route>
            <Route path="*">
                404 NOT FOUND
            </Route>
        </Switch>
    )
}
export default AuthRoutes;