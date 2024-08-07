import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../components/Context/Context";

const PrivateRoutes = (props) => {
    const { user } = useContext(UserContext)

    if(user && user.auth === true){
        return (
            <Route path={props.path} component={props.component}></Route>
        )
    } else {
        return <Redirect to='/login'></Redirect>
    }

}

export default PrivateRoutes;