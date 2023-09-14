import { CommandScanner } from "./src/util/CommandScanner";
import { InputEnum } from "./src/util/Input";
import { VirtualController, pollKeyboardState } from "./src/util/VirtualController";

const controller = new VirtualController();
const keyboardState = {};

let secondsPassed;
let oldTimeStamp;
let fps;

let canvas;
let context;

const draw = () => {
  context.fillStyle = 'white';
  context.fillRect(0, 0, 200, 100);
  context.font = '25px Arial';
  context.fillStyle = 'black';
  context.fillText("currentState: " + controller.currentState, 10, 30);
}

const step = ( timeStamp ) => {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  fps = Math.round(1 / secondsPassed);

  const input = pollKeyboardState(keyboardState);
  controller.update(input);
  draw();
  window.requestAnimationFrame(step);
}

const init = () => {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  window.requestAnimationFrame(step);
  const scanner = new CommandScanner();
  const inputStr = "N, D, DF, F, LP";
  const tokens = scanner.scan(inputStr);
  console.log(tokens);
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
