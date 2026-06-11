/* ========================================== */
/* 1. FUZZY TEXT 模糊字体类 (负责左上角的动画图标) */
/* ========================================== */
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

/* ========================================== */
/* 2. 全局 UI 动态注入系统 (包含导航、页脚、颜色样式) */
/* ========================================== */
window.renderGlobalUI = function(rootPath = '') {
    
    // --- [2.1 颜色与主题样式设置区] ---
    // 如果下次要修改颜色，直接在这里替换 Hex 代码 (#开头的颜色值)
    const themeStyles = `
    <style>
        /* 导航栏整体背景 (深黑色) 和 主文字颜色 (纯白色) */
        .nav-wrapper {
            background-color: #121212 !important; 
            color: #ffffff !important; 
        }
        
        /* 一级菜单模块背景 (深灰色) 和 底部边框 (稍亮的灰色) */
        .menu-bar {
            background-color: #1e1e1e !important;
            border-bottom: 1px solid #333333 !important;
        }

        /* 鼠标悬浮和高亮时的颜色 (科技蓝色) */
        .menu-bar:hover, .sub-item a:hover {
            color: #3b82f6 !important; 
        }

        /* 菜单标题前面的小圆点颜色 (科技蓝色) */
        .bar-title .dot {
            background-color: #3b82f6 !important;
        }

        /* 二级菜单的链接文字颜色 (浅灰色) */
        .sub-item a {
            color: #b0b0b0 !important;
        }

        /* 底部 Footer 链接默认颜色 (中灰色) */
        .global-footer a {
            color: #888888 !important; 
        }
        /* 底部 Footer 鼠标悬浮颜色 (科技蓝色) */
        .global-footer a:hover {
            color: #3b82f6 !important; 
        }
    </style>
    `;

    // --- [2.2 顶部导航栏 HTML 结构区] ---
    // 修改菜单名称、增加或删除链接在这里操作
    const navHTML = themeStyles + `
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
            
            <a href="${rootPath}about.html" class="menu-bar"><div class="bar-title">ABOUT</div></a>
            
        </div>
    </nav>
    `;

    // --- [2.3 底部版权 Footer HTML 结构区] ---
    const footerHTML = `
    <footer class="global-footer" style="margin-top: 40px; position: relative; z-index: 10;">
        <a href="${rootPath}index.html">CHEAPER BROTHERS CO. 廉兄集团。</a>
    </footer>
    `;

    // 将上面写好的 HTML 注入到网页中
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // --- [2.4 模糊图标初始化设置] ---
    // 修改左上角 "■" 图标的颜色、大小在这里操作
    if (document.getElementById('fuzzy-nav-icon')) {
        new FuzzyText('fuzzy-nav-icon', { 
            fontFamily: "Manufacturing Consent", 
            text: "■", 
            fontSize: 40, 
            fuzzRange: 15, 
            baseIntensity: 0.2, 
            enableHover: false,
            color: "#3b82f6" // <--- 图标已修改为蓝色
        });
    }

    // --- [2.5 导航栏鼠标悬浮与点击逻辑] ---
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

/* ========================================== */
/* 3. 菜单手风琴展开/收起 逻辑处理 */
/* ========================================== */
window.toggleAccordion = function(event, element) {
    if (event.target.tagName === 'A') return;
    const subContent = element.querySelector('.sub-content');
    if (!subContent) return; 
    if (element.classList.contains('expanded')) { element.classList.remove('expanded'); return; }
    document.querySelectorAll('.menu-bar').forEach(bar => bar.classList.remove('expanded'));
    element.classList.add('expanded');
};
