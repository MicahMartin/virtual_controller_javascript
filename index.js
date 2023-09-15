import { VirtualController, pollKeyboardState } from './src/util/VirtualController';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.jsx';

const ControllerWrapper = () => {
  let oldTimeStamp;
  let secondsPassed;
  const keyboardState = {};
  const virtualController = new VirtualController();

  const [controller, setController] = useState(0);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      if (event.key === ' ') event.preventDefault();
      keyboardState[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
      if (event.key === ' ') event.preventDefault();
      keyboardState[event.key] = false;
    });

    const step = (timeStamp) => {
      const input = pollKeyboardState(keyboardState);

      virtualController.update(input);
      setController(() => virtualController.currentState);

      secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      oldTimeStamp = timeStamp;
      newFps = Math.round(1 / secondsPassed);

      setFps(newFps); // Update FPS state if needed
      window.requestAnimationFrame(step);
    };

    const init = () => window.requestAnimationFrame(step);

    window.onload = init;
  }, []);

  return (
    <div>
      <App fps={fps} controller={controller} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ControllerWrapper />
  </React.StrictMode>,
)
