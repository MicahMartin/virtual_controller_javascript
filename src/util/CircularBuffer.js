const mod = (n, m) => ((n % m) + m) % m;

export default class CircularBuffer {
  constructor(_capacity){
    this.readPtr = 0;
    this.writePtr = 0;
    this.size = 0;
    this.capacity = _capacity;
    this.buffer = new Array(_capacity).fill(null);
  }

  add(item){
    this.buffer[this.writePtr] = item;
    this.readPtr = this.writePtr;
    this.writePtr = (this.writePtr + 1) % this.capacity;

    if(this.size <= this.capacity) this.size++;
  }

  at(index){
    if (index >= this.capacity) throw new Error("index out of bounds");
    return this.buffer[mod((this.readPtr - index), this.capacity)];
  }

  asArray(){
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
