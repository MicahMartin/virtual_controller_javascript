import VirtualController from "./src/util/VirtualController";

let frameCount = 0;
const controller = new VirtualController();

const update = () => {
  frameCount++;

  let input = 0;
  controller.update(input);
}

const mainLoop = (updateFn) => {
  let lastTime = Date.now();
  for (;;) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= 1000 / 60) {
      if (updateFn()) break;
      lastTime = currentTime;
    }
  }
}
mainLoop(update);
console.log(inputBuffer.at(1));
