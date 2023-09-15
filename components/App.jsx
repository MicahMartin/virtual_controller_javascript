import { useState, useEffect } from 'react'
import './App.css'

const App = ({controller, keyboardState, fps}) => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="card">
        <p>
          controller state is controller { controller } fps {fps}
        </p>
      </div>
    </>
  )
}

export default App;
