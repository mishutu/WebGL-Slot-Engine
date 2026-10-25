import { Application, Graphics, Assets, Sprite, Container, Text, BlurFilter } from "pixi.js";
import gsap from "gsap";
import { calculateWin } from "./Evaluator";
import { createReels } from "./Reels";
import { createBalanceText, createSpinButton } from "./UI";
import { updateReelsPhysics } from "./Physics";

(async () => {
  const app = new Application();
  await app.init({ background: 'red', resizeTo: window });
  document.body.appendChild(app.canvas);
  app.canvas.style.position = 'absolute';


  const assetUrls = [
    './assets/set1_01.png',
    './assets/set1_02.png',
    './assets/set1_03.png',
    './assets/set1_04.png',
    './assets/set1_08.png',
    './assets/wild.png'
  ];

  const textures = await Promise.all(assetUrls.map(url => Assets.load(url)));

  const reelStrips = [[0, 1, 2, 2, 3, 1, 0, 0, 0, 4, 3, 4, 0, 0, 0], [0, 1, 2, 3, 4, 2, 3, 5, 1, 4, 2, 0, 0, 0, 1, 3], [2, 3, 1, 4, 4, 3, 2, 1, 0, 0, 5, 0, 1, 0, 3, 0], [2, 1, 1, 4, 4, 3, 0, 3, 2, 5, 1, 0, 3, 4, 2, 0], [0, 0, 2, 3, 1, 2, 3, 1, 4, 4, 3, 2, 2, 1, 1]];

  let gameState = 'IDLE';
  let balance = 1000;
  const bet = 50;

  const centerX = app.screen.width / 2;
  const centerY = app.screen.height / 2;

  const balanceText = createBalanceText(app, balance);

  const windowMask = new Graphics().rect(-300, -150, 700, 300).fill(0xffffff);
  windowMask.x = centerX;
  windowMask.y = centerY;
  app.stage.addChild(windowMask);

  const reels = createReels(app, textures, reelStrips, windowMask, centerX, centerY);

  const payline = new Graphics().rect(-280, -50, 560, 3).fill('lime');
  payline.x = centerX;
  payline.y = centerY + 50;
  app.stage.addChild(payline);

  app.ticker.add((ticker) => {
    updateReelsPhysics(ticker, reels, gameState, reelStrips, textures);
  });

  const spinButton = createSpinButton(app, centerX, centerY);

  spinButton.on("pointerdown", () => {

    if (gameState !== 'IDLE') return;

    if (balance < bet) {
      console.log("Insufficient funds!");
      return;
    }

    balance -= bet;
    balanceText.text = `Balance: $${balance}`;

    gameState = 'SPINNING';

    for (const reel of reels) {
      reel.isSpinning = true
      for (const symbol of reel.children) {
        gsap.killTweensOf(symbol);
        const icon = symbol.children[1];
        icon.width = 60;
        icon.height = 60
        gsap.killTweensOf(icon);
      }
    };

    for (let i = 0; i < reels.length; i++) {
      setTimeout(() => {
        const reel = reels[i];
        reel.isSpinning = false;
        gameState = 'STOPPING';

        const sortedSymbols = [...reel.children].sort((a, b) => a.y - b.y);
        const topSymbol = sortedSymbols[0];
        const nextSlotY = Math.ceil(topSymbol.y / 100) * 100;
        let forwardOffset = nextSlotY - topSymbol.y;

        if (forwardOffset < 50) forwardOffset += 100;

        for (let j = 0; j < reel.children.length; j++) {
          const symbol = reel.children[j];
          let finalY = symbol.y + forwardOffset;

          if (finalY >= 400) {
            symbol.y -= 500;
            finalY -= 500;
          }

          gsap.to(symbol, {
            y: finalY,
            duration: 0.5,
            ease: 'back.out(1.5)',
            onComplete: () => {
              if (i === reels.length - 1 && j === reel.children.length - 1) {
                gameState = 'EVALUATING';
                const middleRow = [];
                for (const reel of reels) {
                  for (let i = 0; i < reel.children.length; i++) {
                    const symbol = reel.children[i];
                    if (Math.round(symbol.y === 100)) {
                      middleRow.push(symbol);
                    }
                  }
                }

                const winData = calculateWin(middleRow, bet);

                if (winData.isWin) {
                  const winText = new Text({
                    text: `YOU WON $${winData.winAmount}`,
                    style: {
                      fontFamily: 'Arial',
                      fontSize: 64,
                      fill: 0xffd700,
                      fontWeight: 'bold',

                      dropShadow: true,
                      dropShadowColor: 0x000000,
                      dropShadowBlur: 4,
                      dropShadowAngle: Math.PI / 6,
                      dropShadowDistance: 5
                    }
                  });

                  winText.anchor.set(0.5);
                  winText.x = centerX;
                  winText.y = centerY;
                  app.stage.addChild(winText);

                  gsap.to(winText, {
                    y: winText.y - 100,
                    alpha: 0,
                    duration: 2,
                    onComplete: () => {
                      winText.destroy();
                    }

                  });

                  balance += winData.winAmount;
                  balanceText.text = `Balance: $${balance}`;

                  console.log(`WINNER! Paid out $${winData.winAmount}`);

                  for (let i = 0; i < winData.matchCount; i++) {
                    const icon = middleRow[i].children[1];
                    gsap.to(icon, {
                      width: 80,
                      height: 80,
                      duration: 0.3,
                      yoyo: true,
                      repeat: -1
                    });
                  }
                }
                gameState = 'IDLE';
              }
            }
          });
        }
      }, 400 + (i * 500));
    }

  });
})();

