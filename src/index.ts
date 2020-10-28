class Menu {
  private menu: HTMLElement = document.querySelector('.menu');
  private menuContents: HTMLElement = this.menu.querySelector('.menu__contents');
  private menuToggleButton: HTMLElement = this.menu.querySelector('.menu__toggle');
  private menuTitle: HTMLElement = this.menu.querySelector('.menu__title');
  private expanded: boolean = true;
  private animate: boolean = false;
  private duration: number = 200;
  private frameTime: number = 1000 / 60;
  private nFrames: number = Math.round(this.duration / this.frameTime);
  private collapsed = { x: 0, y: 0 };

  constructor() {
    this.calculateScales();
    this.createEaseAnimations();
    this.addEventListeners();
    this.collapse();
    this.activate();
  }

  private activate() {
    this.menu.classList.add('menu--active');
    this.animate = true;
  }

  private toggle() {
    if (this.expanded) {
      this.collapse();
      return;
    }

    this.expand();
  }

  private collapse() {
    if (!this.expanded) {
      return;
    }

    this.expanded = false;

    const { x, y } = this.collapsed;
    const invX = 1 / x;
    const invY = 1 / y;

    this.menu.style.transform = `scale(${x}, ${y})`;
    this.menuContents.style.transform = `scale(${invX}, ${invY})`;

    if (!this.animate) {
      return;
    }

    this.applyAnimation(false);
  }

  expand() {
    if (this.expanded) {
      return;
    }

    this.expanded = true;

    this.menu.style.transform = 'scale(1, 1)';
    this.menuContents.style.transform = 'scale(1, 1)';

    if (!this.animate) {
      return;
    }

    this.applyAnimation(true);
  }

  private applyAnimation(expand: boolean) {
    this.menu.classList.remove('menu--expanded');
    this.menu.classList.remove('menu--collapsed');
    this.menuContents.classList.remove('menu__contents--expanded');
    this.menuContents.classList.remove('menu__contents--collapsed');

    window.getComputedStyle(this.menu).transform;

    if (expand) {
      this.menu.classList.add('menu--expanded');
      this.menuContents.classList.add('menu__contents--expanded');
      return;
    }

    this.menu.classList.add('menu--collapsed');
    this.menuContents.classList.add('menu__contents--collapsed');
  }

  private addEventListeners() {
    this.menuToggleButton.addEventListener('click', () => this.toggle());
  }

  private calculateScales() {
    const collapsed = this.menuTitle.getBoundingClientRect();
    const expanded = this.menu.getBoundingClientRect();

    this.collapsed = {
      x: collapsed.width / expanded.width,
      y: collapsed.height / expanded.height
    }
  }

  private createEaseAnimations() {
    let menuEase = document.querySelector('.menu-ease');
    if (menuEase) {
      return menuEase;
    }

    menuEase = document.createElement('style');
    menuEase.classList.add('menu-ease');

    const menuExpandAnimation = [];
    const menuExpandContentsAnimation = [];
    const menuCollapseAnimation = [];
    const menuCollapseContentsAnimation = [];
    const percentIncrement = 100 / this.nFrames;

    Array
      .from(Array(this.nFrames).keys())
      .forEach(val => {
        const step = this.ease(val / this.nFrames).toFixed(5);
        const percentage = (val * percentIncrement).toFixed(5);
        const startX = this.collapsed.x;
        const startY = this.collapsed.y;
        const endX = 1;
        const endY = 1;

        this.append({
          percentage,
          step,
          startX,
          startY,
          endX,
          endY,
          outerAnimation: menuExpandAnimation,
          innerAnimation: menuExpandContentsAnimation
        });

        this.append({
          percentage,
          step,
          startX: 1,
          startY: 1,
          endX: this.collapsed.x,
          endY: this.collapsed.y,
          outerAnimation: menuCollapseAnimation,
          innerAnimation: menuCollapseContentsAnimation
        });
      });

    menuEase.textContent = `
      @keyframes menuExpandAnimation {
        ${menuExpandAnimation.join('')}
      }
      @keyframes menuExpandContentsAnimation {
        ${menuExpandContentsAnimation.join('')}
      }
      @keyframes menuCollapseAnimation {
        ${menuCollapseAnimation.join('')}
      }
      @keyframes menuCollapseContentsAnimation {
        ${menuCollapseContentsAnimation.join('')}
      }`;

    document.head.appendChild(menuEase);
    return menuEase;
  }

  private ease(v, pow = 4) {
    v = this.clamp(v, 0, 1);

    return 1 - Math.pow(1 - v, pow);
  }

  private clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  private append({
    percentage,
    step,
    startX,
    startY,
    endX,
    endY,
    outerAnimation,
    innerAnimation }: any) {

    const xScale = (startX + (endX - startX) * step).toFixed(5);
    const yScale = (startY + (endY - startY) * step).toFixed(5);

    const invScaleX = (1 / xScale).toFixed(5);
    const invScaleY = (1 / yScale).toFixed(5);

    outerAnimation.push(`
  ${percentage}% {
    transform: scale(${xScale}, ${yScale});
  }`);

    innerAnimation.push(`
  ${percentage}% {
    transform: scale(${invScaleX}, ${invScaleY});
  }`);
  }
}

new Menu();
