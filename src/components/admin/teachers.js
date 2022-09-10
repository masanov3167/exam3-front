import React,{useEffect} from "react";
import { Context } from "../context/context";
import './admincomponent.css';

const Teachers = () =>{
    const {link, token, setToken} = React.useContext(Context);
    const [teachers, setTeachers] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });
    const [courses, setCourses] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });

    const [toggle, setToggle] = React.useState(false)
    const [ display, setDisplay] = React.useState({add: false, update: false})
    const [defaultVal, setDefaultVal] = React.useState(false)

    useEffect(() => {
        fetch(`${link}/teachers`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
        .then((res) => res.json())
        .then((data) => data.invalid_token ? setToken(false) :
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
	},[toggle]);
    
    const togglerForm = () =>{
        fetch(`${link}/courses`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) => data.invalid_token ? setToken(false) : setCourses({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setCourses({
					error:true,
					isFetched:false,
				})
			});

          setDisplay({add: true, update: false})
    }
    

    const addTeachers = e =>{
        e.preventDefault();
        const {teachers_name, teachers_phone,teachers_pass, courses} = e.target;
        if(courses.value !== false && teachers_name.value.length >3 && teachers_phone.value.length >4 & teachers_pass.value.length > 4){
            fetch(`${link}/teachers`,{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    name: teachers_name.value.trim(),
                    pass:  teachers_pass.value.trim(),
                    phone: teachers_phone.value.trim(),
                    courseid:courses.value -0
                })
            })
			.then((res) => res.json())
			.then((data) =>
				setToggle(!toggle)
			)
			.catch(er =>{
				setTeachers({
					error:true,
					isFetched:false,
				})
			})
        }
    }

    const deleteTeachers = id =>{
        fetch(`${link}/teachers/${id}`,{
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
            setTeachers({
                error:true,
                isFetched:false,
            })
        })
    }

    const updateCourse = id =>{
        const find = teachers.data.find(a => a.id === id);
        setDefaultVal(find)
        fetch(`${link}/courses`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) =>data.invalid_token ? setToken(false) : setCourses({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setCourses({
					error:true,
					isFetched:false,
				})
			});
        setDisplay({add: false, update: true})
    }

    const editTeacher = (e) =>{
        e.preventDefault()
        fetch(`${link}/teachers/${defaultVal.id}`,{
            method: 'PUT',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                name: e.target.teachers_new_name.value.trim(),
                pass:  e.target.teachers_new_pass.value.trim(),
                phone:  e.target.teachers_new_phone.value.trim(),
                courseid: e.target.courses_new.value -0
            })
        })
        .then((res) => res.json())
        .then((data) =>
            (setToggle(!toggle),
            setDisplay({add: false, update: false})
            )
        )
        .catch(er =>{
            setTeachers({
                error:true,
                isFetched:false,
            })
        })
    }

    return(
        <>
            <table className="table table__courses">
            <thead>
            <tr>
                <th>Ism</th>
                <th>Telefon raqami</th>
            </tr>
            </thead>
            <tbody >
                {
                    teachers.isFetched ? (
                        teachers.data.map((a, index) =>(
                            <tr key={index}>
                                <td>{a.name}</td>
                                <td>{a.phone}</td>
                                <td onClick={() => updateCourse(a.id)}>&#9998;</td>
                                <td onClick={() => deleteTeachers(a.id)} >x</td>
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
                        <h2>Yangi o'qituvchi yaratish</h2>
                        <span onClick={() => setDisplay({add: false, update: display.update})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={addTeachers}>
                            <input name="teachers_name" type="text" minLength='5' maxLength='15' placeholder="O'qituvchi ismi *" required/>
                            <input name="teachers_pass" type="text" minLength='5' maxLength='15' placeholder="O'qituvchi paroli *" required/>
                            <input name="teachers_phone" type="text" minLength='4' maxLength='15' placeholder="O'qituvchi telefon raqami *" required/>
                            <select name="courses" defaultValue='false'>
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
                            <button type="submit">O'qituvchi yaratish</button>
                    </form>
                </div>
                ): display.update ? (
                    <div className="form__div">
                    <div>
                        <h2>O'qituvchini tahrirlash</h2>
                        <span onClick={() => setDisplay({add: false, update: false})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={editTeacher}>
                            <input defaultValue={defaultVal.name} name="teachers_new_name" type="text" minLength='5' maxLength='15' placeholder="O'qituvchi yangi ismi *" required/>
                            <input defaultValue={defaultVal.pass} name="teachers_new_pass" type="text" minLength='5' maxLength='15' placeholder="O'qituvchi yangi paroli *" required/>
                            <input defaultValue={defaultVal.phone} name="teachers_new_phone" type="text" minLength='4' maxLength='15' placeholder="O'qituvchi yangi telefon raqami *" required/>
                            <select name="courses_new" defaultValue={defaultVal.courseid}>
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

export default Teachers;