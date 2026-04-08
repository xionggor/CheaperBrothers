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
/* 2. 全局 UI 动态注入系统 (V8) */
/* ========================== */
window.renderGlobalUI = function(rootPath = '') {
    const navHTML = `
    <nav class="nav-wrapper" id="navWrapper">
        <div class="nav-trigger" id="navTrigger"><canvas id="fuzzy-nav-icon"></canvas></div>
        <div class="menu-list">
            <div class="menu-bar" onclick="toggleAccordion(event, this)">
                <div class="bar-title"><div class="dot"></div>APPS</div>
                <div class="sub-content">
                    <ul class="sub-list">
                        <li class="sub-item"><a href="https://xionggor.github.io/MTA/" target="_blank">MTA TRACKER</a></li>
                        <li class="sub-item"><a href="${rootPath}PokerTracker/index.html">POKER TRACKER</a></li>
                        <li class="sub-item"><a href="https://xionggor.github.io/poker/" target="_blank">雲德社</a></li>
                        <li class="sub-item"><a href="https://xionggor.dpdns.org/" target="_blank">TP Email</a></li>
                    </ul>
                </div>
            </div>
            <div class="menu-bar" onclick="toggleAccordion(event, this)">
                <div class="bar-title"><div class="dot"></div>ART</div>
                <div class="sub-content">
                    <ul class="sub-list">
                        <li class="sub-item"><a href="${rootPath}Gallery/art-2024.html">2024 GALLERY</a></li>
                        <li class="sub-item"><a href="${rootPath}Gallery/art-2025.html">2025 GALLERY</a></li>
                    </ul>
                </div>
            </div>
            <a href="${rootPath}Shop/index.html" class="menu-bar"><div class="bar-title">SHOP</div></a>
            <a href="${rootPath}about.html" class="menu-bar"><div class="bar-title">ABOUT</div></a>
        </div>
    </nav>
    `;

    const footerHTML = `
    <footer class="global-footer" style="margin-top: 40px; position: relative; z-index: 10;">
        <a href="${rootPath}index.html">CHEAPER BROTHERS CO. 廉兄集团。</a>
    </footer>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    if (document.getElementById('fuzzy-nav-icon')) {
        new FuzzyText('fuzzy-nav-icon', { 
            fontFamily: "Manufacturing Consent", text: "■", fontSize: 40, fuzzRange: 15, baseIntensity: 0.2, enableHover: false 
        });
    }

    const wrapper = document.getElementById('navWrapper');
    const trigger = document.getElementById('navTrigger');
    if (wrapper && trigger) {
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
};

window.toggleAccordion = function(event, element) {
    if (event.target.tagName === 'A') return;
    const subContent = element.querySelector('.sub-content');
    if (!subContent) return; 
    if (element.classList.contains('expanded')) { element.classList.remove('expanded'); return; }
    document.querySelectorAll('.menu-bar').forEach(bar => bar.classList.remove('expanded'));
    element.classList.add('expanded');
};
