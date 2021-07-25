
import './App.css';
import Gameboard from './component/gameboard';

window.gridHistory=window.gridHistory||[]


function App() {
 
  
  var x=Array.from({length: 9},()=> Array.from({length: 9}, () => '1'))
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
