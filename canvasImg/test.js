(function(){
  // 基础配置
  var config = {
    width: 800,                   // 设置canvas的宽
    height: 600,                  // 设置canvas的高
    imgSrc: '../img/img0.png',    // 图片路径
    maxScale: 4.0,                // 最大放大倍数
    minScale: 0.2,                // 最小放大倍数
    step: 0.1                     // 每次放大、缩小 倍数的变化值
  };

  // 标记是否移动事件
  var isMove = false;

  var imgStatus = {
    scale: 1.0,
    rotate: 0
  };
  var lastStatus = {};

  var resetBtn = document.getElementById("resetBtn");
  var bigBtn = document.getElementById("bigBtn");
  var smallBtn = document.getElementById("smallBtn");
  var leftRotate = document.getElementById("leftRotate");
  var rightRotate = document.getElementById("rightRotate");
  var canvas = document.getElementById("canvas");
  canvas.width = config.width;
  canvas.height = config.height;
  var context = canvas.getContext("2d");

  var img = new Image();
  img.src = config.imgSrc;

  img.onload = function() {
    lastStatus = {
      imgX: (-1 * img.width) / 2,
      imgY: (-1 * img.height) / 2,
      mouseX: 0,
      mouseY: 0,
      translateX: canvas.width / 2,
      translateY: canvas.height / 2,
      scale: 1.0,
      rotate: 0
    };
    drawImgByStatus(canvas.width / 2, canvas.height / 2);
  };

  resetBtn.onclick = function() {
    lastStatus = {
      imgX: (-1 * img.width) / 2,
      imgY: (-1 * img.height) / 2,
      mouseX: 0,
      mouseY: 0,
      translateX: canvas.width / 2,
      translateY: canvas.height / 2,
      scale: 1.0,
      rotate: 0
    };
    imgStatus = {
      scale: 1.0,
      rotate: 0
    };
    drawImgByStatus(canvas.width / 2, canvas.height / 2);
  }

  bigBtn.onclick = function() {
    imgStatus.scale = (imgStatus.scale >= config.maxScale) ? config.maxScale : imgStatus.scale + config.step;
    drawImgByStatus(lastStatus.translateX, lastStatus.translateY);
  }

  smallBtn.onclick = function() {
    imgStatus.scale = (imgStatus.scale <= config.minScale) ? config.minScale : imgStatus.scale - config.step;
    drawImgByStatus(lastStatus.translateX, lastStatus.translateY);
  }

  leftRotate.onclick = function() {
    var rotate = (parseInt(imgStatus.rotate / 90, 10) * 90) - 90;
    imgStatus.rotate = rotate;
    drawImgByStatus(lastStatus.translateX, lastStatus.translateY);
  }

  rightRotate.onclick = function() {
    var rotate = (parseInt(imgStatus.rotate / 90, 10) * 90) + 90;
    imgStatus.rotate = rotate;
    drawImgByStatus(lastStatus.translateX, lastStatus.translateY);
  }

  canvas.onmousedown = function(e) {
    isMove = true;
    canvas.style.cursor = "move";

    var box = windowToCanvas(e.clientX, e.clientY);
    lastStatus.mouseX = box.x;
    lastStatus.mouseY = box.y;
  }

  canvas.onmouseout = function(e) {
    isMove = false;
    canvas.style.cursor = "default";
  }

  canvas.onmouseup = function(e) {
    isMove = false;
    canvas.style.cursor = "default";
  }

  canvas.onmousemove = function(e) {
    if (isMove) {
      var box = windowToCanvas(e.clientX, e.clientY);
      drawImgByMove(box.x, box.y);
    }
  }

  canvas.onmousewheel = function(e) {
    if (e.wheelDelta > 0) {
      imgStatus.scale = (imgStatus.scale >= config.maxScale) ? config.maxScale : imgStatus.scale + config.step;
    } else {
      imgStatus.scale = (imgStatus.scale <= config.minScale) ? config.minScale : imgStatus.scale - config.step;
    }
    var mXY = windowToCanvas(e.clientX, e.clientY);
    drawImgByStatus(mXY.x, mXY.y);
  }

  function drawImgByMove(x, y) {
    lastStatus.translateX = lastStatus.translateX + (x - lastStatus.mouseX);
    lastStatus.translateY = lastStatus.translateY + (y - lastStatus.mouseY);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(lastStatus.translateX, lastStatus.translateY);
    context.rotate((imgStatus.rotate * Math.PI) / 180);
    context.scale(imgStatus.scale, imgStatus.scale);
    context.drawImage(img, lastStatus.imgX, lastStatus.imgY, img.width, img.height);
    context.restore();

    lastStatus.mouseX = x;
    lastStatus.mouseY = y;
  }

  function drawImgByStatus(x, y) {
    var imgX = lastStatus.imgX - ((x - lastStatus.translateX) / lastStatus.scale);
    var imgY = lastStatus.imgY - ((y - lastStatus.translateY) / lastStatus.scale);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(x, y);
    context.rotate((imgStatus.rotate * Math.PI) / 180);
    context.scale(imgStatus.scale, imgStatus.scale);
    context.drawImage(img, imgX, imgY, img.width, img.height);
    context.restore();

    lastStatus.imgX = imgX;
    lastStatus.imgY = imgY;
    lastStatus.translateX = x;
    lastStatus.translateY = y;
    lastStatus.scale = imgStatus.scale;
    lastStatus.rotate = imgStatus.rotate;
  }

  /**
  * 计算相对于canvas左上角的坐标值
  */
  function windowToCanvas(x, y) {
    var box = canvas.getBoundingClientRect();
    return {
      x: x - box.left,
      y: y - box.top
    };
  }
 })();
