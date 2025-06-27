// 스타워즈 효과
const $starWrapper = $('#starWrapper');
const $canvas = $('#warpCanvas');
const canvas = $canvas[0];
const ctx = canvas.getContext('2d');
const $header = $('#header');
const $footer = $('#footer');

let width = $(window).width();
let height = $(window).height();

const headerHeight = $header.outerHeight();
const footerHeight = $footer.outerHeight();

canvas.width = width;
canvas.height = height - 2;
$starWrapper.css('min-height', height - 2);

const numStars = 500;
/*
100 : 매우 적음 (허전함)
200~300 : 적당함 (부드럽고 가볍게)
400~500	: 꽉 차 보임 (기본)
1000+ : 고사양, 리소스 사용 많음
*/
const stars = [];

for (let i = 0; i < numStars; i++) {
stars.push({
    x: Math.random() * width - width / 2,
    y: Math.random() * height - height / 2,
    z: Math.random() * width,
    pz: 0,
});
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    for (let star of stars) {
        star.pz = star.z;
        star.z -= 10;

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

animate();

$(window).on('resize', function () {
    width = $(window).width();
    height = $(window).height();
    canvas.width = width;
    canvas.height = height - 2;
    $starWrapper.css('min-height', height - 2);
});




// 시나리오 스와이핑
$(document).ready(function () {
    $('.score_area.ver_slide').each(function () {
        const $list = $(this);
        const $items = $list.children('li');
        const itemHeight = $items.first().outerHeight(true);
        let intervalId;
        $list.css({ position: 'relative', top: 0 });
        function startRolling() {
            intervalId = setInterval(() => {
                $list.animate({ top: `-=${itemHeight}px` }, 600, function () {
                $list.append($list.children('li').first());
                $list.css('top', 0);
                });
            }, 2500);
        }
        function stopRolling() {
            clearInterval(intervalId);
        }
        startRolling();
        $list.on('mouseenter', stopRolling);
        $list.on('mouseleave', startRolling);
    });
  $('.score_area.ver_swiping').each(function () {
    const $list = $(this);
    const itemHeight = $list.children('li').first().outerHeight(true);
    let intervalId;
    let startY = 0;
    let deltaY = 0;
    let isDragging = false;
    let isAnimating = false;

    $list.css({ position: 'relative', top: 0 });

    function startRolling() {
      intervalId = setInterval(() => {
        if (!isAnimating) scrollDown();
      }, 3000);
    }

    function stopRolling() {
      clearInterval(intervalId);
    }

    function scrollDown() {
      if (isAnimating) return;
      isAnimating = true;

      $list.stop(true).animate({ top: -itemHeight }, 400, function () {
        $list.append($list.children('li').first());
        $list.css('top', 0);
        isAnimating = false;
      });
    }

    function scrollUp() {
      if (isAnimating) return;
      isAnimating = true;

      $list.stop(true);
      $list.prepend($list.children('li').last());
      $list.css('top', -itemHeight);
      $list.animate({ top: 0 }, 400, function () {
        $list.css('top', 0);
        isAnimating = false;
      });
    }

    startRolling();

    $list.on('mouseenter', stopRolling);
    $list.on('mouseleave', startRolling);

    // 터치 이벤트
    $list.on('touchstart', function (e) {
      stopRolling();
      startY = e.originalEvent.touches[0].clientY;
      deltaY = 0;
    });

    $list.on('touchmove', function (e) {
      deltaY = e.originalEvent.touches[0].clientY - startY;
    });

    $list.on('touchend', function () {
      handleSwipe();
    });

    // 마우스 이벤트
    $list.on('mousedown', function (e) {
      stopRolling();
      isDragging = true;
      startY = e.clientY;
      deltaY = 0;
    });

    $(document).on('mousemove', function (e) {
      if (!isDragging) return;
      deltaY = e.clientY - startY;
    });

    $(document).on('mouseup', function () {
      if (!isDragging) return;
      handleSwipe();
      isDragging = false;
    });

    function handleSwipe() {
      if (Math.abs(deltaY) < 30 || isAnimating) return;

      if (deltaY > 30) scrollUp();
      else if (deltaY < -30) scrollDown();

      deltaY = 0;
      startRolling();
    }
  });
});
