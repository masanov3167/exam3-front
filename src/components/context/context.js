import React, { useState} from 'react';

const Context = React.createContext();

const TokenProvider = ({ children }) => {

    
	const [token ,setToken] = useState(JSON.parse(window.localStorage.getItem("token")) || false)
    const [role, setRole] = useState(JSON.parse(window.localStorage.getItem("role")) ||false);
    const link = 'https://exam3-crm.herokuapp.com';
	
	React.useEffect(() => {
        if(token) {
            window.localStorage.setItem("token", JSON.stringify(token)
            )
        }
        else{
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("role")
        }
        if(role) {
            window.localStorage.setItem("role", JSON.stringify(role)
            )
        }
        else{
            window.localStorage.removeItem("role")
            window.localStorage.removeItem("token");
        }
    }, [token, role])

	return (
		<Context.Provider value={{role, setRole,token ,setToken, link}}>{children}</Context.Provider>
	);
};

export { Context, TokenProvider };

