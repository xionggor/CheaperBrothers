/* ========================== */
/* 1. FUZZY TEXT 模糊字体类 */
/* ========================== */
class FuzzyText {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.text = options.text || "";
    this.fontSize = options.fontSize || 80;
    this.fontWeight = options.fontWeight || 400;
    this.fontFamily = options.fontFamily || 'sans-serif';
    this.color = options.color || '#fff';
    this.baseIntensity = options.baseIntensity || 0.18;
    this.hoverIntensity = options.hoverIntensity || 0.5;
    this.fuzzRange = options.fuzzRange || 30;
    this.enableHover = options.enableHover !== false;
    this.ctx = this.canvas.getContext('2d');
    this.offscreen = document.createElement('canvas');
    this.offCtx = this.offscreen.getContext('2d');
    this.isHovering = false;
    this.animationFrameId = null;
    
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    
    this.init();
  }
  
  async init() {
    try { await document.fonts.load(`400 ${this.fontSize}px "${this.fontFamily}"`); } catch(e) {}
    await document.fonts.ready;
    setTimeout(() => { this.resize(); this.startAnimation(); }, 100);
    if (this.enableHover) {
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
      this.canvas.addEventListener('touchstart', () => this.isHovering = true);
      this.canvas.addEventListener('touchend', () => this.isHovering = false);
    }
    window.addEventListener('resize', this.resize);
  }
  
  resize() {
    const isSmallIcon = this.canvas.id === 'fuzzy-nav-icon';
    const screenWidth = window.innerWidth;
    let responsiveSize = this.fontSize;
    if(!isSmallIcon && screenWidth < 600) { responsiveSize = this.fontSize * 0.6; }
    
    const fontString = `${this.fontWeight} ${responsiveSize}px "${this.fontFamily}"`;
    this.offCtx.font = fontString;
    const metrics = this.offCtx.measureText(this.text);
    const width = Math.ceil(metrics.width);
    const height = Math.ceil(responsiveSize * 1.5); 
    
    this.offscreen.width = width + 10; 
    this.offscreen.height = height;
    this.offCtx.font = fontString;
    this.offCtx.fillStyle = this.color;
    this.offCtx.textBaseline = 'middle';
    this.offCtx.fillText(this.text, 5, height / 2);

    this.width = this.offscreen.width + this.fuzzRange * 2;
    this.height = this.offscreen.height;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    if(isSmallIcon) {
        this.canvas.style.width = '35px';
        this.canvas.style.height = '35px';
    }
  }
  
  handleMouseMove() { this.isHovering = true; }
  handleMouseLeave() { this.isHovering = false; }
  
  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const intensity = this.isHovering ? this.hoverIntensity : this.baseIntensity;
    const tightHeight = this.offscreen.height;
    const offscreenWidth = this.offscreen.width;
    for (let j = 0; j < tightHeight; j++) {
      const dx = Math.floor(intensity * (Math.random() - 0.5) * this.fuzzRange);
      this.ctx.drawImage(this.offscreen, 0, j, offscreenWidth, 1, dx + this.fuzzRange, j, offscreenWidth, 1);
    }
    this.animationFrameId = requestAnimationFrame(this.animate);
  }
  
  startAnimation() { if (!this.animationFrameId) this.animate(); }
}

/* ========================== */
/* 2. 全局导航栏逻辑 (V7) */
/* ========================== */
document.addEventListener('DOMContentLoaded', () => {
    // 自动渲染导航栏图标
    if(document.getElementById('fuzzy-nav-icon')) {
        new FuzzyText('fuzzy-nav-icon', { 
            fontFamily: "Manufacturing Consent", 
            text: "■", fontSize: 40, fuzzRange: 15, baseIntensity: 0.2, enableHover: false 
        });
    }

    const wrapper = document.getElementById('navWrapper');
    const trigger = document.getElementById('navTrigger');
    
    if(wrapper && trigger) {
        trigger.addEventListener('mouseenter', () => wrapper.classList.add('active'));
        wrapper.addEventListener('mouseleave', () => {
            wrapper.classList.remove('active');
            document.querySelectorAll('.menu-bar').forEach(bar => bar.classList.remove('expanded'));
        });
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('active');
        });
    }
});

// 手风琴折叠菜单逻辑
window.toggleAccordion = function(event, element) {
    if (event.target.tagName === 'A') return;
    const subContent = element.querySelector('.sub-content');
    if (!subContent) return; 
    if (element.classList.contains('expanded')) {
        element.classList.remove('expanded');
        return;
    }
    document.querySelectorAll('.menu-bar').forEach(bar => bar.classList.remove('expanded'));
    element.classList.add('expanded');
};
