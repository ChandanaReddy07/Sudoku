import React from 'react'
import "./start.css"
 function Start({start,setStart}) {
    return (
        <div className="start">
       
          <button
            className="btn2"
            onClick={
                setStart(true)
            }
          >START</button>
    
     </div>
    )
}
export default Start