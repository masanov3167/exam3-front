import React,{useEffect} from "react";
import { Context } from "../context/context";
import './admincomponent.css';

const Courses = () =>{
    const {token, setToken, link} = React.useContext(Context);
    const [courses, setCourses] = React.useState({
        isFetched: false,
        isError: false,
        data:{}
    });

    const [toggle, setToggle] = React.useState(false)
    const [ display, setDisplay] = React.useState({add: false, update: false})
    const [defaultVal, setDefaultVal] = React.useState(false)

    useEffect(() => {
		fetch(`${link}/courses`, {
            method: 'GET',
            headers:{
                'Content-type': 'application/json',
                'access_token':token
            }
        })
			.then((res) => res.json())
			.then((data) =>  data.invalid_token ? setToken(false) :
				setCourses({
					isFetched: true,
					data: data.data,
					error: false,
				})
			)

			.catch(er =>{
				setCourses({
					error:true,
					isFetched:false,
				})
		});
	},[toggle]);
    
    const togglerForm = () =>{
          setDisplay({add: true, update: false})
    }
    

    const addCourse = e =>{
        e.preventDefault();
        const {course_name, course_price} = e.target;
        if(course_name.value && course_price.value.length >3){
            fetch(`${link}/courses`,{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    name: course_name.value.trim(), 
                   price: course_price.value.trim()
                })
            })
			.then((res) => res.json())
			.then((data) =>
				setToggle(!toggle)
			)
			.catch(er =>{
				setCourses({
					error:true,
					isFetched:false,
				})
			})
        }
    }

    const deleteCourse = id =>{
        fetch(`${link}/courses/${id}`,{
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
            setCourses({
                error:true,
                isFetched:false,
            })
        })
    }

    const updateCourse = id =>{
        const find = courses.data.find(a => a.id === id);
        setDefaultVal(find)
        setDisplay({add: false, update: true})
    }

    const editCourse = (e) =>{
        e.preventDefault()
        fetch(`${link}/courses/${defaultVal.id}`,{
            method: 'PUT',
            headers:{
                'Content-type': 'application/json'
            },
            body:JSON.stringify({
                name: e.target.new_name.value.trim(), 
                price: e.target.new_price.value.trim(), 
            })
        })
        .then((res) => res.json())
        .then((data) =>
            (setToggle(!toggle),
            setDisplay({add: false, update: false})
            )
        )
        .catch(er =>{
            setCourses({
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
                <th>Kurs nomi</th>
                <th>Kurs narxi</th>
            </tr>
            </thead>
            <tbody >
                {
                    courses.isFetched ? (
                        courses.data.map((a, index) =>(
                            <tr key={index}>
                                <td>{a.name}</td>
                                <td>{a.price} so'm</td>
                                <td onClick={() => updateCourse(a.id)}>&#9998;</td>
                                <td onClick={() => deleteCourse(a.id)} >x</td>
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
                        <h2>Yangi kurs yaratish</h2>
                        <span onClick={() => setDisplay({add: false, update: display.update})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={addCourse}>
                            <input name="course_name" type="text" minLength='5' maxLength='15' placeholder="kurs nomi *" required/>
                            <input name="course_price" type="number" placeholder="kurs narxi *" required/>
                            <button type="submit">kurs yaratish</button>
                    </form>
                </div>
                ): display.update ? (
                    <div className="form__div">
                    <div>
                        <h2>Guruh nomini tahrirlash</h2>
                        <span onClick={() => setDisplay({add: false, update: false})}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={editCourse}>
                            <input name="new_name" type="text" minLength='5' placeholder="yangi nomni kiriting" defaultValue={defaultVal.name || ''} maxLength='15' required/>
                            <input name="new_price" type="number" min='1000' placeholder="yangi narxni kiriting" defaultValue={defaultVal.price || ''}  required/>
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

export default Courses;