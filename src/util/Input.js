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

const InputEnumString = {
  [InputEnum.NOINPUT] : "NOINPUT",

  [InputEnum.RIGHT] : "RIGHT",
  [InputEnum.LEFT] : "LEFT",
  [InputEnum.UP] : "UP",
  [InputEnum.DOWN] : "DOWN",

  [InputEnum.LP]  : "LP",
  [InputEnum.MP] : "MP",
  [InputEnum.HP] : "HP",
  [InputEnum.AP] : "AP",

  [InputEnum.LK]  : "LK",
  [InputEnum.MK] : "MK",
  [InputEnum.HK] : "HK",
  [InputEnum.AK] : "AK",

  [InputEnum.START] : "START",
  [InputEnum.SELECT] : "SELECT",
  [InputEnum.MISC1] : "MISC1",
  [InputEnum.MISC2] : "MISC2",

  [InputEnum.DOWNLEFT] : "DOWNLEFT",
  [InputEnum.DOWNRIGHT] : "DOWNRIGHT",
  [InputEnum.UPLEFT] : "UPLEFT",
  [InputEnum.UPRIGHT] : "UPRIGHT",
};

export const createInputEvent = (inputBit, pressed) => ({
  inputBit,
  pressed,
  key: InputEnumString[inputBit]
});

export class InputFrame {
  constructor(){
    this.size = 0;
    this.buffer = new Array(16);
  }

  addEvent(event){
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
