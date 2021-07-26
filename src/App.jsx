
import './App.css';
import Gameboard from './component/gameboard';
import React, { useState, useEffect } from "react";
import Start from './component/start';
window.gridHistory=window.gridHistory||[]


function App() {
 

  var [level,setLevel]=useState(null)
  var [start,setStart]=useState(false)

  
 
  return (


    <div className="App" >
    
    <p className="title1" style={{fontSize: "40px"}}>
      &nbsp;SUDOKU&nbsp;GAME&nbsp;
    </p>
   <Gameboard/>
    
   
    </div>
  );
}

export default App;
