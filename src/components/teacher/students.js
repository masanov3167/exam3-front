import React,{useEffect} from "react";
import { Context } from "../context/context";
import '../admin/admincomponent.css';
import './teachercomponent.css'

const StudentOfTeachers = () =>{
    const {link, token, setToken} = React.useContext(Context);
    const [groups, setGroups] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });

    useEffect(() => {
		fetch(`${link}/student-groups`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setGroups({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setGroups({
					error:true,
					isFetched:false,
				})
			})
		
	},[]);
    

    return(
        <>
            <table className="table table__students">
            <thead>
            <tr>
                <th>Guruh nomi</th>
                <th>Kurs nomi</th>
                <th>Ismi</th>
                <th>Telefon raqami</th>
            </tr>
            </thead>
            <tbody className="test">
                {
                    groups.isFetched ? (
                        groups.data.map((a, index) =>(
                            <tr key={index}>
                                <td>{a.g_name}</td>
                                <td>{a.c_name}</td>
                                <td>{a.s_name}</td>
                                <td>{a.s_phone}</td>
                            </tr>
                        ))
                    ):(
                        <></>
                    )
                }
            </tbody>
            
            </table>
        </>
    )
}

export default StudentOfTeachers;