import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import User from '../components/User/User';
import Project from '../components/Project/Project';
import Role from "../components/Role/Role";
import Assign from "../components/Assign/Assign";
import PrivateRoutes from "./Private-Routes";


const AppRoutes = (props) => {
    return (
        <Switch>
            <PrivateRoutes path="/users" component={User}/>
            <PrivateRoutes path="/projects" component={Project}/>
            <PrivateRoutes path="/roles" component={Role}/>
            <PrivateRoutes path="/assign" component={Assign}/>

            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/" exact>
                Home
            </Route>
            <Route path="*">
                404 NOT FOUND
            </Route>
        </Switch>
    )
}
export default AppRoutes;