import React from 'react';
import { NavLink,  Route, Routes } from 'react-router-dom';
import GroupOfTeachers from './groups';
import StudentOfTeachers from './students';

function Teacher() {
  return (
      <main className='main'>
        <ol className="sidebar">
          <NavLink className='sidebar__item' to='/students'>O'quvchilar</NavLink>
          <NavLink className='sidebar__item' to='/'>Guruhlar</NavLink> 
        </ol>
        <div className='content'>
        <Routes>
                <Route path='/' element={<GroupOfTeachers />}/>
                <Route path='/students' element={<StudentOfTeachers />}/>
            </Routes>
        </div>
      </main>
  );
}

export default Teacher;
