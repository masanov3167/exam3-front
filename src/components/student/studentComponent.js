import React from 'react';
import { NavLink,  Route, Routes } from 'react-router-dom';
import StudentItem from './group';

function Student() {
  return (
      <main className='main'>
        <ol className="sidebar">
          <NavLink className='sidebar__item' to='/'>Guruhlar</NavLink> 
        </ol>
        <div className='content'>
        <Routes>
                <Route path='/' element={<StudentItem />}/>
            </Routes>
        </div>
      </main>
  );
}

export default Student;
