import { useState, useEffect } from 'react'
import './App.css'

const App = ({controller, keyboardState, fps}) => {
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
