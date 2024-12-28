let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });

    paper.addEventListener('mousedown', (e) => this.handleMouseDown(e, paper));
    paper.addEventListener('touchstart', (e) => this.handleTouchStart(e, paper), { passive: false });

    window.addEventListener('mouseup', () => this.handleMouseUp());
    window.addEventListener('touchend', () => this.handleTouchEnd());

    paper.addEventListener('gesturestart', (e) => this.handleGestureStart(e));
    paper.addEventListener('gestureend', () => this.handleGestureEnd());
  }

  handleMouseMove(e) {
    if (!this.rotating) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    this.updatePosition(e.clientX, e.clientY);
  }

  handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    if (!this.rotating) {
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    this.updatePosition(touch.clientX, touch.clientY);
  }

  handleMouseDown(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    if (e.button === 0) {
      this.mouseTouchX = e.clientX;
      this.mouseTouchY = e.clientY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    }
    if (e.button === 2) {
      this.rotating = true;
    }
  }

  handleTouchStart(e, paper) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    const touch = e.touches[0];
    this.mouseTouchX = touch.clientX;
    this.mouseTouchY = touch.clientY;
    this.prevMouseX = this.mouseTouchX;
    this.prevMouseY = this.mouseTouchY;
  }

  handleMouseUp() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  handleTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  handleGestureStart(e) {
    e.preventDefault();
    this.rotating = true;
  }

  handleGestureEnd() {
    this.rotating = false;
  }

  updatePosition(x, y) {
    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      const paper = document.querySelector(`[style*="z-index: ${highestZ - 1};"]`);
      if (paper) {
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
