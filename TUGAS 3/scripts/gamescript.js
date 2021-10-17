function sprite(options) {
  var that = {},
    frameIndex = 0,
    tickCount = 0,
    tickPerFrame = options.tickPerFrame || 0,
    numberOfFrame = options.numberOfFrame || 1;

  that.context = options.context;
  that.w = options.w;
  that.h = options.h;
  that.img = options.img;
  that.x = options.x;
  that.y = options.y;
  that.scaleRatio = 1;

  that.update = function () {
    tickCount += 1;

    if (tickCount > tickPerFrame) {
      tickCount = 0;

      if (frameIndex < numberOfFrame - 1) {
        frameIndex += 1;
      } else {
        frameIndex = 0;
      }
    }
  };

  that.render = function () {
    that.context.drawImage(
      that.img,
      (frameIndex * that.w) / numberOfFrame,
      0,
      that.w / numberOfFrame,
      that.h,
      that.x,
      that.y,
      that.w / numberOfFrame,
      that.h
    );
  };

  return that;
}

//init var
var sasuke,
  sasukeImage,
  canvas,
  score = 0,
  itachi = [],
  numItachi = 2;

canvas = document.getElementById("cnv");
canvas.width = 1024;
canvas.height = 480;

sasukeImage = new Image();

sasuke = sprite({
  context: canvas.getContext("2d"),
  w: 1740,
  h: 210,
  img: sasukeImage,
  numberOfFrame: 6,
  tickPerFrame: 4,
  x: 0,
  y: canvas.height - 210,
});

sasukeImage.src = "../assets/character/sasuke.png";

for (var i = 0; i < numItachi; i++) {
  spawnItachi();
}

function drawText() {
  var context = canvas.getContext("2d");

  //Score
  context.font = "bold 20px Consolas";
  context.textAlign = "start";
  context.fillStyle = "black";
  context.fillText("Score: " + score, canvas.width - 150, 40);
}

function spawnItachi() {
  var itachiIndex, itachiImage;

  itachiImage = new Image();
  itachiIndex = itachi.length;

  //Create Sprite
  itachi[itachiIndex] = sprite({
    context: canvas.getContext("2d"),
    w: 1740,
    h: 210,
    img: itachiImage,
    numberOfFrame: 6,
    tickPerFrame: 4,
  });

  itachiImage.src = "../assets/character/itachi.png";

  itachi[itachiIndex].x = canvas.width + Math.random() * (canvas.width * 3);
  itachi[itachiIndex].y = canvas.height - 220;
  itachi[itachiIndex].scaleRatio = Math.random() * 0.5 + 0.5;
}

function destroyItachi(param) {
  for (var i = 0; i < itachi.length; i++) {
    if (itachi[i] === param) {
      itachi[i] = null;
      itachi.splice(i, 1);
      break;
    }
  }
}

gameLoop();
function gameLoop() {
  requestAnimationFrame(gameLoop);
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  drawText();

  if (sasuke.x < 0) {
    sasuke.x = 0;
  }
  if (sasuke.x > canvas.width - 174) {
    sasuke.x = canvas.width - 174;
  }

  //Draw Itachi
  for (var i = 0; i < itachi.length; i++) {
    itachi[i].update();
    itachi[i].x -= 3;
    itachi[i].render();

    //Respawn Itachi Jika Keluar Canvas
    if (itachi[i].x < -128) {
      destroyItachi(itachi[i]);
      setTimeout(spawnItachi, 1000);
      score++;
    }
  }

  sasuke.update();
  sasuke.render();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    sasuke.x -= 10;
  } else if (e.key === "ArrowRight") {
    sasuke.x += 10;
  }
});
