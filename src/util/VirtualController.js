import CircularBuffer from "./CircularBuffer"
import { InputEnum, InputFrame } from "./Input";

export class VirtualController {
  constructor(){
    this.buffer = new CircularBuffer(10);
    // represent state of each button on virtual controller with bitflags
    this.currentState = 0;
    this.prevState = 0;
  }

  update(input){
    const currentFrame = new InputFrame();

    this.prevState = this.currentState;
    this.currentState = input;

    // this.buffer.add(input);
  }
}

export const readHardwareLayer = (keyboardState) => {
  let input = InputEnum.NOINPUT;

  let inputAxisX = 0;
  let inputAxisY = 0;
  
  if(keyboardState["r"]){
    inputAxisX++;
  }
  if(keyboardState["w"]){
    inputAxisX--;
  }
  if(keyboardState["Space"]){
    inputAxisY++;
  }
  if(keyboardState["e"]){
    inputAxisY--;
  }

  if(keyboardState["u"]){
    input |= InputEnum.LP;
  }
  if(keyboardState["i"]){
    input |= InputEnum.LK;
  }
  if(keyboardState["o"]){
    input |= InputEnum.MP;
  }
  if(keyboardState["p"]){
    input |= InputEnum.MK;
  }

  if(inputAxisX == 1) input |= InputEnum.RIGHT;
  if(inputAxisX == -1) input |= InputEnum.LEFT; 

  if(inputAxisY == 1) input |= InputEnum.UP;
  if(inputAxisY == -1) input |= InputEnum.DOWN;

  return input;
}
