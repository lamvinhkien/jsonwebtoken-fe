import React from 'react';
import './Nav.scss';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect, useState } from "react";

const Nav = () => {
    let [isShow, setIsShow] = useState(false);

    useEffect(() => {
        let sessionToken = sessionStorage.getItem("TOKEN")
        if (sessionToken) {
            setIsShow(true)
        }
    }, [])

    return (
        <>
            {isShow === true &&
                <div className="Nav">
                    <NavLink to="/" className="option" exact>Home</NavLink>
                    <NavLink to="/users" className="option">User</NavLink>
                    <NavLink to="/projects" className="option">Project</NavLink>
                </div>
            }
        </>
    );
}

export default Nav;