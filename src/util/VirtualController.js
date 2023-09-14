import CircularBuffer from "./CircularBuffer"
import { InputEnum, InputFrame, createInputEvent} from "./Input";

export class VirtualController {
  constructor(){
    this.buffer = new CircularBuffer(60);
    // represent state of each button on virtual controller with bitflags
    this.currentState = 0;
    this.currentStickState = 0;

    this.prevState = 0;
    this.prevStickState = 0;
  }

  update(input){
    const currentFrame = new InputFrame();

    this.prevState = this.currentState;
    this.prevStickState = this.currentState & 0x0F;

    this.currentState = input;
    this.currentStickState = input & 0x0F;

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

    for (let i = 4; i < 10; i++) {
      let mask = 0;
      mask |= (1 << i);

      if (this.currentState & (1 << i) && !(this.prevState & (1 << i))) {
        currentFrame.addEvent(createInputEvent(mask, true));
      } else if (!(this.currentState & (1 << i)) && (this.prevState & (1 << i))) {
        currentFrame.addEvent(createInputEvent(mask, false));
      }
    }

    this.buffer.add(currentFrame);
  }
  
  wasPressed(input, strict, index, pressed){
    if (index >= this.buffer.size) return false;
    const inputFrame = this.buffer.at(index);

    for (const event of inputFrame) {
      if (pressed && event.pressed || !pressed && !event.pressed) {
        if (input <= 10 && strict) return input === (event.inputBit & 0x0F);
        return event.inputBit & input;
      }
    }
    return false;
  }

  wasPressedBuffer(input, strict, pressed, searchLen = 4){
    for (let i = 0; i < searchLen; i++) {
      if (this.wasPressed(input, strict, i, pressed)) return true;
    }
    return false;
  }

  wasReleased(input, strict = true, index = 0){
    return this.wasPressed(input, strict, index, false);
  }

  isPressed(input, strict = true){
    if (input < 16 && strict) return input === (this.currentState & 0x0F);

    return this.currentState & input;
  }
}

export const pollKeyboardState = (keyboardState) => {
  let input = InputEnum.NOINPUT;

  let inputAxisX = 0;
  let inputAxisY = 0;
  
  if(keyboardState["r"]) inputAxisX++; 
  if(keyboardState["w"]) inputAxisX--; 
  if(keyboardState[" "]) inputAxisY++; 
  if(keyboardState["e"]) inputAxisY--;

  if(keyboardState["u"]) input |= InputEnum.LP; 
  if(keyboardState["i"]) input |= InputEnum.LK; 
  if(keyboardState["o"]) input |= InputEnum.MP; 
  if(keyboardState["p"]) input |= InputEnum.MK; 

  if(inputAxisX == 1) input |= InputEnum.RIGHT;
  if(inputAxisX == -1) input |= InputEnum.LEFT; 

  if(inputAxisY == 1) input |= InputEnum.UP;
  if(inputAxisY == -1) input |= InputEnum.DOWN;

  return input;
}
