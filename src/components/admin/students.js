import React,{useEffect} from "react";
import { Context } from "../context/context";
import './admincomponent.css';

const Students = () =>{
    const {link, token, setToken} = React.useContext(Context);
    const [students, setStudents] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });
    const [groups, setgroups] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });

    const [toggle, setToggle] = React.useState(false)
    const [ display, setDisplay] = React.useState({add: false, update: false})
    const [defaultVal, setDefaultVal] = React.useState(false)

    useEffect(() => {
        fetch(`${link}/students`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
        .then((res) => res.json())
        .then((data) => data.invalid_token ? setToken(false) :
            setStudents({
                isFetched: true,
                data: data.data,
                error: false,
            })
        )

        .catch(er =>{
            setStudents({
                error:true,
                isFetched:false,
            })
        });
	},[toggle]);
    
    const togglerForm = () =>{
        fetch(`${link}/groups`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setgroups({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setgroups({
					error:true,
					isFetched:false,
				})
			});

          setDisplay({add: true, update: false})
    }
    

    const addStudents = e =>{
        e.preventDefault();
        const {students_name, students_phone,students_pass, group} = e.target;
        if(group.value !== false && students_name.value.length >3 && students_phone.value.length >4 & students_pass.value.length > 4){
            fetch(`${link}/students`,{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    name: students_name.value.trim(),
                    pass:  students_pass.value.trim(),
                    phone: students_phone.value.trim(),
                    groupid:group.value -0
                })
            })
			.then((res) => res.json())
			.then((data) =>
				setToggle(!toggle)
			)
			.catch(er =>{
				setStudents({
					error:true,
					isFetched:false,
				})
			})
        }
    }

    const deleteStudents = id =>{
        fetch(`${link}/students/${id}`,{
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
            setStudents({
                error:true,
                isFetched:false,
            })
        })
    }

    const updateStudents= id =>{
        const find = students.data.find(a => a.id === id);
        setDefaultVal(find)
        fetch(`${link}/groups`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setgroups({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setgroups({
					error:true,
					isFetched:false,
				})
		});
        setDisplay({add: false, update: true})
    }

    const editTeacher = (e) =>{
        e.preventDefault()
        fetch(`${link}/students/${defaultVal.id}`,{
            method: 'PUT',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                name: e.target.students_new_name.value.trim(),
                pass:  e.target.students_new_pass.value.trim(),
                phone:  e.target.students_new_phone.value.trim(),
                groupid: e.target.group_new.value -0
            })
        })
        .then((res) => res.json())
        .then((data) => setToggle(!toggle), setDisplay({add: false, update: false})
            
        )
        .catch(er =>{
            setStudents({
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
                <th>Ism</th>
                <th>Telefon raqami</th>
                <th>Guruhi</th>
            </tr>
            </thead>
            <tbody >
                {
                    students.isFetched ? (
                        students.data.map((a, index) =>(
                            <tr key={index}>
                                <td>{a.name}</td>
                                <td>{a.phone}</td>
                                <td>{a.g_name}</td>
                                <td onClick={() => updateStudents(a.id)}>&#9998;</td>
                                <td onClick={() => deleteStudents(a.id)} >x</td>
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
                 display.add ? (
                    <div className="form__div">
                    <div>
                        <h2>Yangi o'quvchi yaratish</h2>
                        <span onClick={() => setDisplay({add: false, update: display.update})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={addStudents}>
                            <input name="students_name" type="text" minLength='5' maxLength='15' placeholder="O'quvchi ismi *" required/>
                            <input name="students_pass" type="text" minLength='5' maxLength='15' placeholder="O'quvchi paroli *" required/>
                            <input name="students_phone" type="text" minLength='4' maxLength='15' placeholder="O'quvchi telefon raqami *" required/>
                            <select name="group" defaultValue='false'>
                                <option value="false" disabled>Guruhni tanlang</option>
                                {
                                    groups.isFetched && groups.data.length >0 ?(
                                        groups.data.map((a, index) =>(
                                            <option key={index} value={a.id}>{a.g_name}</option>
                                        ))
                                    ):(
                                        <></>
                                    )
                                }
                            </select>
                            <button type="submit">O'quvchi yaratish</button>
                    </form>
                </div>
                ): display.update ? (
                    <div className="form__div">
                    <div>
                        <h2>O'quvchini tahrirlash</h2>
                        <span onClick={() => setDisplay({add: false, update: false})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={editTeacher}>
                            <input defaultValue={defaultVal.name || ''} name="students_new_name" type="text" minLength='5' maxLength='15' placeholder="O'quvchi ismi *" required/>
                            <input defaultValue={defaultVal.pass || ''} name="students_new_pass" type="text" minLength='5' maxLength='15' placeholder="O'quvchi paroli *" required/>
                            <input defaultValue={defaultVal.phone || ''} name="students_new_phone" type="text" minLength='4' maxLength='15' placeholder="O'quvchi telefon raqami *" required/>
                            <select name="group_new" defaultValue={defaultVal.g_id}>
                                <option value="false"  disabled>Guruhni tanlang</option>
                                {
                                    groups.isFetched && groups.data.length >0 ?(
                                        groups.data.map((a, index) =>(
                                            <option key={index} value={a.id}>{a.g_name}</option>
                                        ))
                                    ):(
                                        <></>
                                    )
                                }
                            </select>
                            <button type="submit">O'qituvchini yangilash</button>
                    </form>
                </div>
                ):(
                    <></>
                )
            }
        </>
    )
}

export default Students;