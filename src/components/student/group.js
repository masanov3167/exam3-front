import React,{useEffect, useRef} from "react";
import { Context } from "../context/context";
import '../admin/admincomponent.css';
import './studentcomponent.css'
const StudentItem = () =>{
    const {link, token, setToken} = React.useContext(Context);
    const [groups, setGroups] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });
    const [homeworks, setHomeworks] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    })

    const [groupId, setGroupId] = React.useState(false)

    useEffect(() => {
		fetch(`${link}/student-own-groups`, {
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
    

    const endTask = id =>{
        fetch(`${link}/student-own-homeworks/${id}`, {
            method: 'POST',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            },
            body:JSON.stringify({
                groupid: groupId
            })
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setHomeworks({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setHomeworks({
					error:true,
					isFetched:false,
				})
		})
    }

    const viewTask = id =>{
        setGroupId(id)
        fetch(`${link}/student-own-homeworks/${id}`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setHomeworks({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setHomeworks({
					error:true,
					isFetched:false,
				})
		})
    }
    
    return(
        <>
            <table className="table table__students">
            <thead>
            <tr>
                <th>Guruh nomi</th>
                <th>Kurs nomi</th>
                <th>O'qituvchi</th>
                <th>Vazifa</th>
            </tr>
            </thead>
            <tbody className="test">
                {
                    groups.isFetched ? (
                        groups.data.map((a, index) =>(
                            <tr key={index}>
                                <td>{a.g_name}</td>
                                <td>{a.c_name}</td>
                                <td>{a.t_name}</td>
                                <td onClick={() => viewTask(a.id)}>Vazifani ko'rish</td>
                            </tr>
                        ))
                    ):(
                        <></>
                    )
                }
            </tbody>
            
            </table>


            { homeworks.isFetched && homeworks.data.length >0 ? (
                    <div className="modal">
                        <span onClick={() => setHomeworks({isFetched: false, data:{}}) }>X</span>
                        <ol className="modal__list">
                            {
                                homeworks.data.map((a, index) =>(
                                    <li key={index} className="modal__list__item">
                                        <span><b>title:</b> {a.title} </span>
                                        <span><b>body:</b> {a.body} </span>
                                        <div onClick={() => endTask(a.id)} className="modal__list__item__btn">
                                            Bajardim
                                       </div>
                                        <ul className="students__list">
                                        <span><b>Bajarganlar:</b> {a.students === null ? 0 : a.students.length} </span>
                                            {
                                                a.students && a.students.length >0 ? a.students.map((item, key) =>(
                                                    <li key={key}>{item.name} - ({item.iat})</li>
                                                )):(
                                                    <></>
                                                )
                                            }
                                        </ul>
                                    </li>
                                ))
                            }
                        </ol>
                    </div>
                ): (
                    <></>
                )
            }
        </>
    )
}

export default StudentItem;