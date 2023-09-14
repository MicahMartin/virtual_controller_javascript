export const InputEnum = {
  NOINPUT : 0,

  RIGHT : 0x1,
  LEFT : 0x2,
  UP : 0x4,
  DOWN : 0x8,

  LP  : 0x10,
  MP : 0x20,
  HP : 0x40,
  AP : 0x80,

  LK  : 0x100,
  MK : 0x200,
  HK : 0x400,
  AK : 0x800,

  START : 0x1000,
  SELECT : 0x2000,
  MISC1 : 0x4000,
  MISC2 : 0x8000,

  DOWNLEFT : (0x8|0x2),
  DOWNRIGHT : (0x8|0x1),
  UPLEFT : (0x4|0x2),
  UPRIGHT : (0x4|0x1),
};

export const createInputEvent = (inputBit = -1, pressed = true, valid = true) => ({
  inputBit,
  pressed,
  valid,
});

export class InputFrame {
  constructor(){
    this.size = 0;
    this.buffer = new Array(16);
  }

  addEvent(event){
    console.log(event);
    this.buffer.push(event);
    this.size++;
  }
};
