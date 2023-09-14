// Token ENum
const TokenEnum = {
  NEUTRAL: 0,
  FORWARD: 1,
  BACK: 2,
  UP: 3,
  DOWN: 4,
  UPFORWARD:5 ,
  UPBACK:6 ,
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
  END: 21,
};

const TokenStringEnum = {
  [TokenEnum.NEUTRAL]: "NEUTRAL",
  [TokenEnum.FORWARD]: "FORWARD",
  [TokenEnum.BACK]: "BACK",
  [TokenEnum.UP]: "UP",
  [TokenEnum.DOWN]: "DOWN",
  [TokenEnum.UPFORWARD]:"UPFORWARD" ,
  [TokenEnum.UPBACK]:"UPBACK" ,
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
  [TokenEnum.END]: "END",
};

export class CommandScanner {
  constructor(){
    this.currentStr = '';
    this.strPtr = 0;
    this.scannerStart = 0;
  }

  scan(inputString){
    this.currentStr = inputString;
    this.strPtr = 0;
    this.scannerStart = this.strPtr;
    const returnVect = [];

    while(!this.isAtEnd()){
      this.skipWhitespace();
      this.scannerStart = this.strPtr;
      const c = this.advance();

      if (this.isAlpha(c)){
        while(this.isAlpha(this.peek())){
          console.log("is alpha");
          this.advance();
        }

        returnVect.push(this.makeToken(this.getInputType()));
        this.scannerStart = this.strPtr;
      };

      if (this.isDigit(c)){
        while(this.isDigit(this.peek())){
          this.advance();
        }

        returnVect.push(this.makeToken(TokenEnum.NUMBER));
        this.scannerStart = this.strPtr;
      };

      switch (c) {
        case '~': 
          returnVect.push(this.makeToken(TokenEnum.RELEASED)); 
          this.scannerStart = this.strPtr;
          break;
        case '*': 
          returnVect.push(this.makeToken(TokenEnum.HELD));
          this.scannerStart = this.strPtr;
          break;
        case '@': 
          returnVect.push(this.makeToken(TokenEnum.ANY));
          this.scannerStart = this.strPtr;
          break;
        case '!': 
          returnVect.push(this.makeToken(TokenEnum.NOT));
          this.scannerStart = this.strPtr;
          break;
        case '&': 
          returnVect.push(this.makeToken(TokenEnum.AND));
          this.scannerStart = this.strPtr;
          break;
        case '|': 
          returnVect.push(this.makeToken(TokenEnum.OR));
          this.scannerStart = this.strPtr;
          break;
        case ',':
          returnVect.push(this.makeToken(TokenEnum.DELIM));
          this.scannerStart = this.strPtr;
          break;
      }
    }

    returnVect.push(this.makeToken(TokenEnum.END));
    return returnVect;
  };

  getInputType(){
    switch (this.currentStr[this.scannerStart]) {
      case 'N': return TokenEnum.NEUTRAL;
      case 'F': return TokenEnum.FORWARD;
      case 'B': return TokenEnum.BACK;
      case 'U': { 
        if (this.strPtr - this.scannerStart > 1) {
          switch (this.currentStr[this.scannerStart+1]) {
            case 'F': return TokenEnum.UPFORWARD;
            case 'B': return TokenEnum.UPBACK;
          }
        }
        return TokenEnum.UP;
      }
      case 'D': {
        if (this.strPtr - this.scannerStart > 1) {
          switch (this.currentStr[this.scannerStart+1]) {
            case 'F': return TokenEnum.DOWNFORWARD;
            case 'B': return TokenEnum.DOWNBACK;
          }
        }
        return TokenEnum.DOWN;
      }
      case 'L': {
        if (this.strPtr - this.scannerStart > 1) {
          switch (this.currentStr[this.scannerStart+1]) {
            case 'P': return TokenEnum.LP;
            case 'K': return TokenEnum.LK;
          }
        }
      }
      break; 
      case 'M': {
        if (this.strPtr - this.scannerStart > 1) {
          switch (this.currentStr[this.scannerStart+1]) {
            case 'P': return TokenEnum.MP;
            case 'K': return TokenEnum.MK;
          }
        }
      }
      break;
    }
  };

  makeToken(type){
    return {
      type,
      start: this.scannerStart,
      length: this.strPtr - this.scannerStart,
      tokenKey: TokenStringEnum[type],
    };
  };

  isAtEnd(){
    return this.strPtr === this.currentStr.length;
  };

  peek(){
    return this.currentStr[this.strPtr];
  };

  peekNext(){
    if (this.isAtEnd()) return '\0';
    return this.currentStr[this.strPtr+1];
  };

  advance(){
    this.strPtr++;
    return this.currentStr[this.strPtr - 1];
  };

  match(expected){
    if (this.isAtEnd()) return false;
    if (this.currentStr[this.strPtr] != expected) return false;

    this.strPtr++;
    return true;
  };

  skipWhitespace(){
    for (;;) {
      const c = this.peek();
      switch (c) {
        case ' ':
        case '\r':
        case '\t':
          this.advance();
          break;
        default:
          return;
      }
    }
  };

  isAlpha(c){
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  };

  isDigit(c){
    return c >= '0' && c <= '9';
  };
}
