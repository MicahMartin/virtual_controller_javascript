import { VirtualController, readHardwareLayer } from "./src/util/VirtualController";

const controller = new VirtualController();
const update = () => {
  // How you choose to read from the hardware layer is up to you
  const input = readHardwareLayer();
  controller.update(input);

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${controller.state}`);
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
