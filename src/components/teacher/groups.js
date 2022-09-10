import React,{useEffect} from "react";
import { Context } from "../context/context";
import '../admin/admincomponent.css';
import './teachercomponent.css'

const GroupOfTeachers = () =>{
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

    const [toggle, setToggle] = React.useState(false)
    const [ display, setDisplay] = React.useState(false)
    const [defaultVal, setDefaultVal] = React.useState(false)

    useEffect(() => {
		fetch(`${link}/teacher-groups`, {
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
    
    const togglerForm = id =>{
        const find = groups.data.find(a => a.id === id);
        setDefaultVal(find)
          setDisplay(true)
    }

    const addTask = e =>{
        const {title, body} = e.target;
        if(title.value.length >3 && body.value.length >5){
            fetch(`${link}/teacher-homeworks`,{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    title: title.value.trim(), 
                    body: body.value.trim(),
                    groupid: defaultVal.id
                })
            })
			.then((res) => res.json())
			.then((data) =>setToggle(!toggle))
			.catch(er => console.log(er))
        }
        setDisplay(false);
    }

    const viewTask = id =>{
        fetch(`${link}/teacher-homeworks/${id}`)
			.then((res) => res.json())
			.then((data) => setHomeworks({isFetched: true,data: data.data,error: false}) )

			.catch(er =>{
				setHomeworks({
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
                <th>Vazifa berish</th>
            </tr>
            </thead>
            <tbody className="test">
                {
                    groups.isFetched ? (
                        groups.data.map((a, index) =>(
                            <tr key={index}>
                                <td>{a.g_name}</td>
                                <td>{a.c_name}</td>
                                <td onClick={() => togglerForm(a.id)}>vazifa berish</td>
                                <td onClick={() => viewTask(a.id)}>&#x1F441;</td>
                            </tr>
                        ))
                    ):(
                        <></>
                    )
                }
            </tbody>
            
            </table>


            {
                display ? (
                    <div className="form__div">
                    <div>
                        <h2>Vazifa joylash</h2>
                        <span onClick={() => setDisplay(false)}>X</span>
                    </div>
                    <form autoComplete="off" onSubmit={addTask}>
                            <input name="title" type="text" placeholder="uyga vazifa titli *" required/>
                            <input name="body" type="text" minLength='5' maxLength='120' placeholder="uyga vazifa bodysi *" required/>
                            <button type="submit">Vazifa joylash</button>
                    </form>
                </div>
                ): homeworks.isFetched && homeworks.data.length >0 ? (
                    <div className="modal">
                        <span onClick={() => setHomeworks({isFetched: false, data:{}}) }>X</span>
                        <ol className="modal__list">
                            {
                                homeworks.data.map((a, index) =>(
                                    <li key={index} className="modal__list__item">
                                        <span><b>title:</b> {a.title} </span>
                                        <span><b>body:</b> {a.body} </span>
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

export default GroupOfTeachers;