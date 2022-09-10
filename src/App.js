import React from 'react';
import Main from './pages/main';
import './index.css';
import { Context } from './components/context/context';
import Login from './components/login/login';

function App() {
  const {token} = React.useContext(Context);
    
    {
      if(token){
      return (<Main/>)
    }else{
      return (<Login />)
    }
  }
}

export default App;
