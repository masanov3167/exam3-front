import React,{useEffect} from "react";
import { Context } from "../context/context";
import './admincomponent.css';

const Groups = () =>{
    const {link, token, setToken} = React.useContext(Context);
    const [groups, setGroups] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });
    const [courses, setCourses] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });

    const [teachers, setTeachers] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });

    const [toggle, setToggle] = React.useState(false)
    const [ display, setDisplay] = React.useState({add: false, update: false})
    const [defaultVal, setDefaultVal] = React.useState(false)

    useEffect(() => {
		fetch(`${link}/groups`, {
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
		
	},[toggle]);
    
    const togglerForm = () =>{
        fetch(`${link}/courses`,{
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setCourses({isFetched: true,data: data.data,error: false}))

			.catch(er =>{
				setCourses({
					error:true,
					isFetched:false,
				})
			});

          setDisplay({add: true, update: false})
    }
    const getTeacher = e =>{
        fetch(`${link}/teachers/${e.target.value}`)
			.then((res) => res.json())
			.then((data) =>
				setTeachers({
					isFetched: true,
					data: data.data,
					error: false,
				})
			)

			.catch(er =>{
				setTeachers({
					error:true,
					isFetched:false,
				})
			});
    }

    const addGroup = e =>{
        e.preventDefault();
        const {name, courses, teachers} = e.target;
        if(courses.value !== 'false' && teachers.value !== 'false' && name.value.length >3){
            fetch(`${link}/groups`,{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    name: name.value, 
                    courses: courses.value,
                    teachers: teachers.value
                })
            })
			.then((res) => res.json())
			.then((data) =>
				setToggle(!toggle)
			)
			.catch(er =>{
				setGroups({
					error:true,
					isFetched:false,
				})
			})
        }
    }

    const deleteGroup = id =>{
        fetch(`${link}/groups/${id}`,{
            method: 'DELETE',
            headers:{
                'Content-type': 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) =>
            setToggle(!toggle)
        )
        .catch(er =>{
            setGroups({
                error:true,
                isFetched:false,
            })
        })
    }

    const updateGroup = id =>{
        const find = groups.data.find(a => a.id === id);
        setDefaultVal(find)
        setDisplay({add: false, update: true})
    }

    const editGroup = (e) =>{
        e.preventDefault()
        fetch(`${link}/groups/${defaultVal.id}`,{
            method: 'PUT',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                name: e.target.new_name.value.trim(), 
            })
        })
        .then((res) => res.json())
        .then((data) =>
            (setToggle(!toggle),
            setDisplay({add: false, update: false})
            )
        )
        .catch(er =>{
            setGroups({
                error:true,
                isFetched:false,
            })
        })
    }

    return(
        <>
            <table className="table">
            <thead>
            <tr>
                <th>Guruh nomi</th>
                <th>Kurs nomi</th>
                <th>O'qituvchi</th>
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
                                <td onClick={() => updateGroup(a.id)} >&#9998;</td>
                                <td onClick={() => deleteGroup(a.id)} >x</td>
                            </tr>
                        ))
                    ):(
                        <></>
                    )
                }
            </tbody>
            
            </table>

            <div onClick={togglerForm} className="toggler__form">
                +
            </div>

            {
                courses.isFetched && courses.data.length && display.add ? (
                    <div className="form__div">
                    <div>
                        <h2>Yangi guruh yaratish</h2>
                        <span onClick={() => setDisplay({add: false, update: display.update})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={addGroup}>
                            <input name="name" type="text" minLength='5' maxLength='15' required/>
                            <select name="courses" defaultValue='false' onChange={getTeacher}>
                                <option value="false" disabled>Kursni tanlang</option>
                                {
                                    courses.isFetched && courses.data.length >0 ?(
                                        courses.data.map((a, index) =>(
                                            <option key={index} value={a.id}>{a.name}</option>
                                        ))
                                    ):(
                                        <></>
                                    )
                                }
                            </select>

                            <select name="teachers" defaultValue='false'>
                                <option value="false" disabled>O'qituvchini tanlang</option>
                                {
                                    teachers.isFetched && teachers.data.length >0 ?(
                                        teachers.data.map((a, index) =>(
                                            <option key={index} value={a.id}>{a.name}</option>
                                        ))
                                    ):(
                                        <></>
                                    )
                                }
                            </select>
                            <button type="submit">guruh yaratish</button>
                    </form>
                </div>
                ): display.update ? (
                    <div className="form__div">
                    <div>
                        <h2>Guruh nomini tahrirlash</h2>
                        <span onClick={() => setDisplay({add: false, update: false})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={editGroup}>
                            <input name="new_name" type="text" minLength='5' placeholder="yangi nomni kiriting" defaultValue={defaultVal.g_name || ''} maxLength='15' required/>
                            <button type="submit">guruh yangilash</button>
                    </form>
                </div>
                ):(
                    <></>
                )
            }
        </>
    )
}

export default Groups;