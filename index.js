import { CommandScanner } from "./src/util/CommandScanner";
import { VirtualController, pollKeyboardState } from "./src/util/VirtualController";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.js'


const controller = new VirtualController();
const keyboardState = {};

let secondsPassed;
let oldTimeStamp;
let fps;

const step = ( timeStamp ) => {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  // fps = Math.round(1 / secondsPassed);

  const input = pollKeyboardState(keyboardState);
  controller.update(input);
  window.requestAnimationFrame(step);
}

const init = () => {
  window.requestAnimationFrame(step);
  // const scanner = new CommandScanner();
  // const inputStr = "N, D, DF, F, LP";
  // const tokens = scanner.scan(inputStr);
  // console.log(tokens);
}

window.onload = init;

window.addEventListener('keydown', event => {
  if(event.key === ' ') event.preventDefault();
  keyboardState[event.key] = true;
});

window.addEventListener('keyup', event => {
  if(event.key === ' ') event.preventDefault();
  keyboardState[event.key] = false;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App controllerState={controller.currentState} />
  </React.StrictMode>,
)
