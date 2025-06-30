const $canvas = $('#warpCanvas');
const canvas = $canvas[0];
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const stars = [];

let speed = 2;
let starCount = 100;

function createStar() {
  return {
    x: Math.random() * width - width / 2,
    y: Math.random() * height - height / 2,
    z: Math.random() * width,
    pz: 0,
  };
}

function populateStars(count) {
  stars.length = 0;
  for (let i = 0; i < count; i++) {
    stars.push(createStar());
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  for (let star of stars) {
    star.pz = star.z;
    star.z -= speed;

    if (star.z < 1) {
      star.z = width;
      star.x = Math.random() * width - width / 2;
      star.y = Math.random() * height - height / 2;
      star.pz = star.z;
    }

    const sx = (star.x / star.z) * width / 2 + width / 2;
    const sy = (star.y / star.z) * height / 2 + height / 2;
    const px = (star.x / star.pz) * width / 2 + width / 2;
    const py = (star.y / star.pz) * height / 2 + height / 2;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }

  requestAnimationFrame(animate);
}

function fastStars() {
  speed = 10;
  starCount = 400;
  populateStars(starCount);
}

function slowStars() {
  speed = 2;
  starCount = 100;
  populateStars(starCount);
}

$('#btn_faster').on('click', function () {
  fastStars();
});

$('#btn_slower').on('click', function () {
  slowStars();
});

// 초기 세팅
populateStars(starCount);
animate();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});