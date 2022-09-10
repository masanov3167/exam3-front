import React from 'react';
import { NavLink,  Route, Routes } from 'react-router-dom';
import Courses from './courses';
import Groups from './groups';
import Students from './students';
import Teachers from './teachers';

function Admin() {
  return (
      <main className='main'>
        <ol className="sidebar">
          <NavLink className='sidebar__item' to='teachers'>O'qituvchilar</NavLink>
          <NavLink className='sidebar__item' to='/students'>O'quvchilar</NavLink>
          <NavLink className='sidebar__item' to='/'>Kurslar</NavLink>
          <NavLink className='sidebar__item' to='/groups'>Guruhlar</NavLink>
        </ol>
        <div className='content'>
            <Routes>
                <Route path='/' element={<Courses />}/>
                <Route path='/students' element={<Students />}/>
                <Route path='/groups' element={<Groups/>}/>
                <Route path='/teachers' element={<Teachers />}/>
            </Routes>
        </div>
      </main>
  );
}

export default Admin;
