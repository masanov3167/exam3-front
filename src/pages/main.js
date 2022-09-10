import React from 'react';
import Admin from '../components/admin/adminComponent';
import { Context } from '../components/context/context';
import Student from '../components/student/studentComponent';
import Teacher from '../components/teacher/teacherComponent';

function Main() {
    const {setToken, role} = React.useContext(Context);
if(!role){
    setToken(false)
}
  return (
    <div className="app">
      <header className="header">
         <div className='header__logo'>Najot ta'lim</div>
         <div className='header__info marquee'><p>Najot ta'lim o'quv markazining crm sistemasiga hush kelibsiz!</p></div>
      </header>
      {
        role && role === 'admin' ? <Admin/> : role === 'teacher' ? <Teacher />: role === 'student' ? <Student /> : <></>
      }
    </div>
  );
}

export default Main;
