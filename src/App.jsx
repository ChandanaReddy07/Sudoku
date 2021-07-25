
import './App.css';
import Gameboard from './component/gameboard';

window.gridHistory=window.gridHistory||[]


function App() {
 
  let gridHistory=[]
  gridHistory.push("hahh")
  let lastState = window.gridHistory.splice(gridHistory.length - 1, 1);
  gridHistory.push("hlo")
  console.log(gridHistory)
 

  var x=Array.from({length: 9},()=> Array.from({length: 9}, () => '1'))
  return (
    <div className="App">
  
    
    <Gameboard/>
   

    </div>
  );
}

export default App;
