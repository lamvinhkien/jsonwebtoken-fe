import { Route } from "react-router-dom";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const PrivateRoutes = (props) => {
    let history = useHistory()
    useEffect(() => {
        let sessionToken = sessionStorage.getItem("TOKEN")
        if (!sessionToken) {
            history.push("/login")
        }
    })

    return (
        <Route path={props.path} component={props.component}></Route>
    )
}

export default PrivateRoutes;