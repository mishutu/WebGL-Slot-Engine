import { Container, Graphics, Sprite, BlurFilter } from "pixi.js";

export function createReels(app, textures, reelStrips, windowMask, centerX, centerY) {
  const reels = [];
  const REEL_WIDTH = 120;
  const symbolHeight = 100;

  for (let i = 0; i < 5; i++) {
    const reelContainer = new Container();
    reelContainer.x = centerX + (i - 2) * REEL_WIDTH;
    reelContainer.y = centerY - 150;
    reelContainer.mask = windowMask;
    app.stage.addChild(reelContainer);

    for (let j = 0; j < 5; j++) {
      const symbolContainer = new Container();
      symbolContainer.y = j * symbolHeight;

      const bg = new Graphics().rect(-40, 5, 80, 90).fill(0xffffff);

      const randomId = reelStrips[i][Math.floor(Math.random() * reelStrips[i].length)];

      const icon = new Sprite(textures[randomId]);
      symbolContainer.id = randomId;
      icon.anchor.set(0.5);
      icon.x = 0;
      icon.y = 50;
      icon.width = 60;
      icon.height = 60;

      symbolContainer.addChild(bg);
      symbolContainer.addChild(icon);
      reelContainer.addChild(symbolContainer);
    }
    reelContainer.stripIndex = Math.floor(Math.random() * reelStrips[i].length);
    const blurFilter = new BlurFilter();
    blurFilter.blurX = 0;
    blurFilter.blurY = 0;

    reelContainer.filters = [blurFilter];

    reelContainer.blurFilter = blurFilter;
    reels.push(reelContainer);
  }
  return reels;
}