// src/util/CommandScanner.js
var TokenEnum = {
  NEUTRAL: 0,
  FORWARD: 1,
  BACK: 2,
  UP: 3,
  DOWN: 4,
  UPFORWARD: 5,
  UPBACK: 6,
  DOWNFORWARD: 7,
  DOWNBACK: 8,
  LP: 9,
  LK: 10,
  MP: 11,
  MK: 12,
  NUMBER: 13,
  RELEASED: 14,
  HELD: 15,
  AND: 16,
  OR: 17,
  ANY: 18,
  NOT: 19,
  DELIM: 20,
  END: 21
};
var TokenStringEnum = {
  [TokenEnum.NEUTRAL]: "NEUTRAL",
  [TokenEnum.FORWARD]: "FORWARD",
  [TokenEnum.BACK]: "BACK",
  [TokenEnum.UP]: "UP",
  [TokenEnum.DOWN]: "DOWN",
  [TokenEnum.UPFORWARD]: "UPFORWARD",
  [TokenEnum.UPBACK]: "UPBACK",
  [TokenEnum.DOWNFORWARD]: "DOWNFORWARD",
  [TokenEnum.DOWNBACK]: "DOWNBACK",
  [TokenEnum.LP]: "LP",
  [TokenEnum.LK]: "LK",
  [TokenEnum.MP]: "MP",
  [TokenEnum.MK]: "MK",
  [TokenEnum.NUMBER]: "NUMBER",
  [TokenEnum.RELEASED]: "RELEASED",
  [TokenEnum.HELD]: "HELD",
  [TokenEnum.AND]: "AND",
  [TokenEnum.OR]: "OR",
  [TokenEnum.ANY]: "ANY",
  [TokenEnum.NOT]: "NOT",
  [TokenEnum.DELIM]: "DELIM",
  [TokenEnum.END]: "END"
};

class CommandScanner {
  constructor() {
    this.currentStr = "";
    this.strPtr = 0;
    this.scannerStart = 0;
  }
  scan(inputString) {
    this.currentStr = inputString;
    this.strPtr = 0;
    this.scannerStart = this.strPtr;
    const returnVect = [];
    while (!this.isAtEnd()) {
      this.skipWhitespace();
      this.scannerStart = this.strPtr;
      const c = this.advance();
      if (this.isAlpha(c)) {
        while (this.isAlpha(this.peek())) {
          console.log("is alpha");
          this.advance();
        }
        returnVect.push(this.makeToken(this.getInputType()));
        this.scannerStart = this.strPtr;
      }
      if (this.isDigit(c)) {
        while (this.isDigit(this.peek())) {
          this.advance();
        }
        returnVect.push(this.makeToken(TokenEnum.NUMBER));
        this.scannerStart = this.strPtr;
      }
      switch (c) {
        case "~":
          returnVect.push(this.makeToken(TokenEnum.RELEASED));
          this.scannerStart = this.strPtr;
          break;
        case "*":
          returnVect.push(this.makeToken(TokenEnum.HELD));
          this.scannerStart = this.strPtr;
          break;
        case "@":
          returnVect.push(this.makeToken(TokenEnum.ANY));
          this.scannerStart = this.strPtr;
          break;
        case "!":
          returnVect.push(this.makeToken(TokenEnum.NOT));
          this.scannerStart = this.strPtr;
          break;
        case "&":
          returnVect.push(this.makeToken(TokenEnum.AND));
          this.scannerStart = this.strPtr;
          break;
        case "|":
          returnVect.push(this.makeToken(TokenEnum.OR));
          this.scannerStart = this.strPtr;
          break;
        case ",":
          returnVect.push(this.makeToken(TokenEnum.DELIM));
          this.scannerStart = this.strPtr;
          break;
      }
    }
    returnVect.push(this.makeToken(TokenEnum.END));
    return returnVect;
  }
  getInputType() {
    switch (this.currentStr[this.scannerStart]) {
      case "N":
        return TokenEnum.NEUTRAL;
      case "F":
        return TokenEnum.FORWARD;
      case "B":
        return TokenEnum.BACK;
      case "U": {
        if (this.strPtr - this.scannerStart > 1) {
          switch (this.currentStr[this.scannerStart + 1]) {
            case "F":
              return TokenEnum.UPFORWARD;
            case "B":
              return TokenEnum.UPBACK;
          }
        }
        return TokenEnum.UP;
      }
      case "D": {
        if (this.strPtr - this.scannerStart > 1) {
          switch (this.currentStr[this.scannerStart + 1]) {
            case "F":
              return TokenEnum.DOWNFORWARD;
            case "B":
              return TokenEnum.DOWNBACK;
          }
        }
        return TokenEnum.DOWN;
      }
      case "L":
        {
          if (this.strPtr - this.scannerStart > 1) {
            switch (this.currentStr[this.scannerStart + 1]) {
              case "P":
                return TokenEnum.LP;
              case "K":
                return TokenEnum.LK;
            }
          }
        }
        break;
      case "M":
        {
          if (this.strPtr - this.scannerStart > 1) {
            switch (this.currentStr[this.scannerStart + 1]) {
              case "P":
                return TokenEnum.MP;
              case "K":
                return TokenEnum.MK;
            }
          }
        }
        break;
    }
  }
  makeToken(type) {
    return {
      type,
      start: this.scannerStart,
      length: this.strPtr - this.scannerStart,
      tokenKey: TokenStringEnum[type]
    };
  }
  isAtEnd() {
    return this.strPtr === this.currentStr.length;
  }
  peek() {
    return this.currentStr[this.strPtr];
  }
  peekNext() {
    if (this.isAtEnd())
      return "\0";
    return this.currentStr[this.strPtr + 1];
  }
  advance() {
    this.strPtr++;
    return this.currentStr[this.strPtr - 1];
  }
  match(expected) {
    if (this.isAtEnd())
      return false;
    if (this.currentStr[this.strPtr] != expected)
      return false;
    this.strPtr++;
    return true;
  }
  skipWhitespace() {
    for (;; ) {
      const c = this.peek();
      switch (c) {
        case " ":
        case "\r":
        case "\t":
          this.advance();
          break;
        default:
          return;
      }
    }
  }
  isAlpha(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z";
  }
  isDigit(c) {
    return c >= "0" && c <= "9";
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
var InputEnumString = {
  [InputEnum.NOINPUT]: "NOINPUT",
  [InputEnum.RIGHT]: "RIGHT",
  [InputEnum.LEFT]: "LEFT",
  [InputEnum.UP]: "UP",
  [InputEnum.DOWN]: "DOWN",
  [InputEnum.LP]: "LP",
  [InputEnum.MP]: "MP",
  [InputEnum.HP]: "HP",
  [InputEnum.AP]: "AP",
  [InputEnum.LK]: "LK",
  [InputEnum.MK]: "MK",
  [InputEnum.HK]: "HK",
  [InputEnum.AK]: "AK",
  [InputEnum.START]: "START",
  [InputEnum.SELECT]: "SELECT",
  [InputEnum.MISC1]: "MISC1",
  [InputEnum.MISC2]: "MISC2",
  [InputEnum.DOWNLEFT]: "DOWNLEFT",
  [InputEnum.DOWNRIGHT]: "DOWNRIGHT",
  [InputEnum.UPLEFT]: "UPLEFT",
  [InputEnum.UPRIGHT]: "UPRIGHT"
};
var createInputEvent = (inputBit, pressed) => ({
  inputBit,
  pressed,
  key: InputEnumString[inputBit]
});

class InputFrame {
  constructor() {
    this.size = 0;
    this.buffer = new Array(16);
  }
  addEvent(event) {
    this.buffer[this.size] = event;
    this.size++;
  }
  *[Symbol.iterator]() {
    let currentIndex = 0;
    while (currentIndex < this.size) {
      yield this.buffer[currentIndex];
      currentIndex++;
    }
  }
}

// src/util/CircularBuffer.js
var mod = (n, m) => (n % m + m) % m;

class CircularBuffer {
  constructor(_capacity) {
    this.readPtr = 0;
    this.writePtr = 0;
    this.size = 0;
    this.capacity = _capacity;
    this.buffer = new Array(_capacity).fill(null);
  }
  add(item) {
    this.buffer[this.writePtr] = item;
    this.readPtr = this.writePtr;
    this.writePtr = (this.writePtr + 1) % this.capacity;
    if (this.size <= this.capacity)
      this.size++;
  }
  at(index) {
    if (index >= this.capacity)
      throw new Error("index out of bounds");
    return this.buffer[mod(this.readPtr - index, this.capacity)];
  }
  asArray() {
    return this.buffer;
  }
  *[Symbol.iterator]() {
    let currentIndex = 0;
    while (currentIndex < this.size) {
      yield this.at(currentIndex);
      currentIndex++;
    }
  }
}

// src/util/VirtualController.js
class VirtualController {
  constructor() {
    this.buffer = new CircularBuffer(60);
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
    for (let i = 4;i < 10; i++) {
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
  wasPressed(input, strict, index, pressed) {
    if (index >= this.buffer.size)
      return false;
    const inputFrame = this.buffer.at(index);
    for (const event of inputFrame) {
      if (pressed && event.pressed || !pressed && !event.pressed) {
        if (input <= 10 && strict)
          return input === (event.inputBit & 15);
        return event.inputBit & input;
      }
    }
    return false;
  }
  wasPressedBuffer(input, strict, pressed, searchLen = 4) {
    for (let i = 0;i < searchLen; i++) {
      if (this.wasPressed(input, strict, i, pressed))
        return true;
    }
    return false;
  }
  wasReleased(input, strict = true, index = 0) {
    return this.wasPressed(input, strict, index, false);
  }
  isPressed(input, strict = true) {
    if (input < 16 && strict)
      return input === (this.currentState & 15);
    return this.currentState & input;
  }
}
var pollKeyboardState = (keyboardState) => {
  let input = InputEnum.NOINPUT;
  let inputAxisX = 0;
  let inputAxisY = 0;
  if (keyboardState["r"])
    inputAxisX++;
  if (keyboardState["w"])
    inputAxisX--;
  if (keyboardState[" "])
    inputAxisY++;
  if (keyboardState["e"])
    inputAxisY--;
  if (keyboardState["u"])
    input |= InputEnum.LP;
  if (keyboardState["i"])
    input |= InputEnum.LK;
  if (keyboardState["o"])
    input |= InputEnum.MP;
  if (keyboardState["p"])
    input |= InputEnum.MK;
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
  const input = pollKeyboardState(keyboardState);
  controller.update(input);
  draw();
  window.requestAnimationFrame(step);
};
var init = () => {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  window.requestAnimationFrame(step);
  const scanner = new CommandScanner;
  const inputStr = "N, D, DF, F, LP";
  const tokens = scanner.scan(inputStr);
  console.log(tokens);
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
