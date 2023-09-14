import CircularBuffer from "./CircularBuffer"
import { InputEnum, InputFrame } from "./Input";

export const readHardwareLayer = () => {
  let input = 0;

  let inputAxisX = 0;
  let inputAxisY = 0;
  
  if(inputAxisX == 1) input |= InputEnum.RIGHT;
  if(inputAxisX == -1) input |= InputEnum.LEFT; 

  if(inputAxisY == 1) input |= InputEnum.UP;
  if(inputAxisY == -1) input |= InputEnum.DOWN;

  return input;
}

export class VirtualController {
  constructor(){
    this.buffer = new CircularBuffer(10);
    // represent state of each button on virtual controller with bitflags
    this.state = 0;
  }

  update(input){
    const currentFrame = new InputFrame();
    this.buffer.add(input);
  }
}
