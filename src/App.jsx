
import './App.css';
import Gameboard from './component/gameboard';
import React, { useState, useEffect } from "react";




function App() {
 

  
 
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
