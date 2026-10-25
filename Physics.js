export function updateReelsPhysics(ticker, reels, gameState, reelStrips, textures) {
  if (gameState !== 'SPINNING' && gameState !== 'STOPPING') return;

  const speed = 25 * ticker.deltaTime;
  const totalSymbols = 5;
  const symbolHeight = 100;
  const totalReelHeight = totalSymbols * symbolHeight;
  const teleportThreshold = totalReelHeight - symbolHeight;

  for (const reel of reels) {
    if (!reel.isSpinning) {
      reel.blurFilter.blurY = 0;
      continue;
    }

    reel.blurFilter.blurY = 15;

    for (let i = 0; i < reel.children.length; i++) {
      const symbol = reel.children[i];
      symbol.y += speed;

      if (symbol.y > teleportThreshold) {
        symbol.y -= totalReelHeight;
        const bg = symbol.children[0];
        bg.clear().rect(-40, 5, 80, 90).fill(0xffffff);

        const icon = symbol.children[1];
        const reelIndex = reels.indexOf(reel);
        reel.stripIndex = (reel.stripIndex + 1) % reelStrips[reelIndex].length;
        const fruitId = reelStrips[reelIndex][reel.stripIndex];
        icon.texture = textures[fruitId];
        symbol.id = fruitId;
        icon.width = 60;
        icon.height = 60;
      }
    }
  }
}