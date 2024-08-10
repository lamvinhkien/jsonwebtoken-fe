import { useEffect, useState, createContext } from "react"
import { getUserAccount } from "../../services/userService";
import { toast } from 'react-toastify';

const UserContext = createContext({});

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ auth: false, isLoading: true });

    const loginContext = (userData) => {
        setUser({ ...userData, auth: true, isLoading: false })
    };

    const logoutContext = () => {
        setUser({ auth: false, isLoading: false });
    };

    const fetchUser = async () => {
        let res = await getUserAccount()
        if (res && res.EC === "1") {
            setUser({ ...res.DT, auth: true, isLoading: false })
        } else {
            setUser({})
        }
    }

    useEffect(() => {
        setTimeout(() => {
            fetchUser()
        }, 600)

    }, [])

    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider }