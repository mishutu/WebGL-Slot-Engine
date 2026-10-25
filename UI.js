import { Text, Graphics } from "pixi.js";

export function createBalanceText(app, balance) {
  const balanceText = new Text({
    text: `Balance: $${balance}`,
    style: {
      fontFamily: 'serif',
      fontSize: 34,
      fill: 0xffffff,
      fontWeight: 'bold'
    }
  });

  balanceText.x = 20;
  balanceText.y = 20;
  app.stage.addChild(balanceText);

  return balanceText;
}

export function createSpinButton(app, centerX, centerY) {
  const spinButton = new Graphics().rect(-75, -25, 150, 50).fill('blue');
  spinButton.x = centerX;
  spinButton.y = centerY + 220;
  spinButton.eventMode = 'static';
  spinButton.cursor = 'pointer';
  app.stage.addChild(spinButton);

  return spinButton;
}