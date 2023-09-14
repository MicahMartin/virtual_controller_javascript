import { VirtualController, readHardwareLayer } from "./src/util/VirtualController";

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
  context.fillText("FPS: " + fps, 10, 30);
}

const step = ( timeStamp ) => {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  fps = Math.round(1 / secondsPassed);

  const input = readHardwareLayer(keyboardState);
  controller.update(input);

  draw();
  window.requestAnimationFrame(step);
}

const init = () => {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  window.requestAnimationFrame(step);
}

window.onload = init;

window.addEventListener('keydown', event => {
  if(event.key === 'Space') event.preventDefault();

  keyboardState[event.key] = true;
});

window.addEventListener('keyup', event => {
  if(event.key === 'Space') event.preventDefault();

  keyboardState[event.key] = false;
});
