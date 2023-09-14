import CircularBuffer from "./src/util/CircularBuffer";

const inputBuffer = new CircularBuffer(10);

let frameCount = 0;

const update = () => {
  frameCount++;
  if (frameCount == 120) {
    console.log(inputBuffer.asArray());
    console.log(`quitting`);
    return 1;
  }
  inputBuffer.add(Math.floor(Math.random() * (10 - 1)) + 1);
  console.log(inputBuffer.at(0));
}

const mainLoop = (updateFn) => {
  let lastTime = Date.now();
  for (;;) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= 1000 / 60) {
      if ( updateFn() ) break;
      lastTime = currentTime;
    }
  }
}
mainLoop(update);
console.log(inputBuffer.at(1));
