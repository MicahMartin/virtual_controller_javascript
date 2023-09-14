import CircularBuffer from "./CircularBuffer"
import { InputFrame } from "./Input";

export default class VirtualController {
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
