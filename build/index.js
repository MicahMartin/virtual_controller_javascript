// src/util/CircularBuffer.js
var mod = (n, m) => (n % m + m) % m;

class CircularBuffer {
  constructor(_capacity) {
    this.readPtr = 0;
    this.writePtr = 0;
    this.full = false;
    this.capacity = _capacity;
    this.buffer = new Array(_capacity).fill(null);
  }
  add(item) {
    this.buffer[this.writePtr] = item;
    this.readPtr = this.writePtr;
    this.writePtr = (this.writePtr + 1) % this.capacity;
  }
  at(index) {
    if (index >= this.capacity)
      throw new Error("index out of bounds");
    return this.buffer[mod(this.readPtr - index, this.capacity)];
  }
  asArray() {
    return this.buffer;
  }
}

// src/util/Input.js
var InputEnum = {
  NOINPUT: 0,
  RIGHT: 1,
  LEFT: 2,
  UP: 4,
  DOWN: 8,
  LP: 16,
  MP: 32,
  HP: 64,
  AP: 128,
  LK: 256,
  MK: 512,
  HK: 1024,
  AK: 2048,
  START: 4096,
  SELECT: 8192,
  MISC1: 16384,
  MISC2: 32768,
  DOWNLEFT: 8 | 2,
  DOWNRIGHT: 8 | 1,
  UPLEFT: 4 | 2,
  UPRIGHT: 4 | 1
};
var createInputEvent = (inputBit = -1, pressed = true, valid = true) => ({
  inputBit,
  pressed,
  valid
});

class InputFrame {
  constructor() {
    this.size = 0;
    this.buffer = new Array(16);
  }
  addEvent(event) {
    console.log(event);
    this.buffer.push(event);
    this.size++;
  }
}

// src/util/VirtualController.js
class VirtualController {
  constructor() {
    this.buffer = new CircularBuffer(10);
    this.currentState = 0;
    this.currentStickState = 0;
    this.prevState = 0;
    this.prevStickState = 0;
  }
  update(input) {
    const currentFrame = new InputFrame;
    this.prevState = this.currentState;
    this.prevStickState = this.currentState & 15;
    this.currentState = input;
    this.currentStickState = input & 15;
    if (this.prevStickState != this.currentStickState) {
      if (this.prevStickState == 0) {
        currentFrame.addEvent(createInputEvent(InputEnum.NOINPUT, false));
      } else {
        currentFrame.addEvent(createInputEvent(this.prevStickState, false));
      }
      if (this.currentStickState == 0) {
        currentFrame.addEvent(createInputEvent(InputEnum.NOINPUT, true));
      } else {
        currentFrame.addEvent(createInputEvent(this.currentStickState, true));
      }
    }
    for (let i = 4;i < 10; ++i) {
      let mask = 0;
      mask |= 1 << i;
      if (this.currentState & 1 << i && !(this.prevState & 1 << i)) {
        currentFrame.addEvent(createInputEvent(mask, true));
      } else if (!(this.currentState & 1 << i) && this.prevState & 1 << i) {
        currentFrame.addEvent(createInputEvent(mask, false));
      }
    }
    this.buffer.add(currentFrame);
  }
}
var readHardwareLayer = (keyboardState) => {
  let input = InputEnum.NOINPUT;
  let inputAxisX = 0;
  let inputAxisY = 0;
  if (keyboardState["r"]) {
    inputAxisX++;
  }
  if (keyboardState["w"]) {
    inputAxisX--;
  }
  if (keyboardState[" "]) {
    inputAxisY++;
  }
  if (keyboardState["e"]) {
    inputAxisY--;
  }
  if (keyboardState["u"]) {
    input |= InputEnum.LP;
  }
  if (keyboardState["i"]) {
    input |= InputEnum.LK;
  }
  if (keyboardState["o"]) {
    input |= InputEnum.MP;
  }
  if (keyboardState["p"]) {
    input |= InputEnum.MK;
  }
  if (inputAxisX == 1)
    input |= InputEnum.RIGHT;
  if (inputAxisX == -1)
    input |= InputEnum.LEFT;
  if (inputAxisY == 1)
    input |= InputEnum.UP;
  if (inputAxisY == -1)
    input |= InputEnum.DOWN;
  return input;
};

// index.js
var controller = new VirtualController;
var keyboardState = {};
var secondsPassed;
var oldTimeStamp;
var fps;
var canvas;
var context;
var draw = () => {
  context.fillStyle = "white";
  context.fillRect(0, 0, 200, 100);
  context.font = "25px Arial";
  context.fillStyle = "black";
  context.fillText("currentState: " + controller.currentState, 10, 30);
};
var step = (timeStamp) => {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  fps = Math.round(1 / secondsPassed);
  const input = readHardwareLayer(keyboardState);
  controller.update(input);
  draw();
  window.requestAnimationFrame(step);
};
var init = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  window.requestAnimationFrame(step);
};
window.onload = init;
window.addEventListener("keydown", (event) => {
  if (event.key === " ")
    event.preventDefault();
  keyboardState[event.key] = true;
});
window.addEventListener("keyup", (event) => {
  if (event.key === " ")
    event.preventDefault();
  keyboardState[event.key] = false;
});
