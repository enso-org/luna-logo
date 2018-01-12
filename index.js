


class Logo {
  constructor(size=64, compatibleMode=true) {
    this.size           = size;
    this.compatibleMode = compatibleMode;
    var scaleStop = 128;
    var scaleLog  = Math.log2(scaleStop);
    this.borderWidth    = 10 - Math.pow(Math.log2(Math.min(size,128))/scaleLog,3)*scaleLog;
    this.topRadius      = 32;
    this.borderOffset   = this.borderWidth;
    this.innerRadius    = this.topRadius - this.borderWidth - this.borderOffset;
    this.atomRadius     = this.innerRadius / 2;
    this.atomDiff       = 0;
    this.d              = 4;
    this.scale          = size/64;

    if (compatibleMode) {this.ref = "xlink:href"}
    else                {this.ref = "href"}

    this.defs = ''
    this.body = `<use ${this.ref}="#logo" fill="red"/>`
  }

  generate() {
    return `
<svg height="${this.size}" width="${this.size}">
  <defs>
    <circle id="innerCircle" cx="32" cy="32" r="${this.innerRadius}"/>
    <circle id="leftAtom"    cx="${this.borderWidth + this.borderOffset +     this.atomRadius + this.atomDiff - this.d}" cy="32" r="${this.atomRadius + this.atomDiff + this.d}"/>
    <circle id="rightAtom"   cx="${this.borderWidth + this.borderOffset + 3 * this.atomRadius + this.atomDiff}" cy="32" r="${this.atomRadius - this.atomDiff}"/>
    <mask id="innerCircleMask">
      <use ${this.ref}="#innerCircle" fill="white"/>
    </mask>

    <rect id="bg" width="64" height="64" fill="white"/>
    <mask id="bgmask">
      <use ${this.ref}="#bg"/>
      <circle cx="32" cy="32" r="${32-this.borderWidth}" fill="black"/>
    </mask>

    <mask id="mainShapeMask">
      <use ${this.ref}="#bg"/>
      <use ${this.ref}="#leftAtom" fill="black"/>
      <rect cy="32" width="64" height="32" fill="black"/>
    </mask>

    <g id="border">
      <circle cx="32" cy="32" r="32" mask="url(#bgmask)"/>
    </g>

    <g id="front">
      <use ${this.ref}="#innerCircle" mask="url(#mainShapeMask)"/>
      <use ${this.ref}="#rightAtom"/>
    </g>

    <g id="logo">
    <use ${this.ref}="#border"/>
      <use ${this.ref}="#front" transform="rotate(35 32 32)"/>
    </g>

    ${this.defs}

    </defs>
    <g transform="scale(${this.scale})">${this.body}</g>
</svg>
`
  }
}

class InAppLogo extends Logo {
  constructor(size, compatibleMode) {
    super(size,compatibleMode);
    this.body = `<use ${this.ref}="#logo" fill="#AE8035"/>`
  }
}

class AppLogo extends Logo {
  constructor(size, compatibleMode) {
    super(size,compatibleMode);

    var border = 4
    var scale  = (64-2*border)/64

    this.defs = `
       <linearGradient id="cd" x1="0" y1="0" x2="0" y2="64px" gradientUnits="userSpaceOnUse">
         <stop offset="0%"   style="stop-color:#ECAE67;stop-opacity:1" />
         <stop offset="100%" style="stop-color:#E2963B;stop-opacity:1" />
       </linearGradient>
       <filter id="toShadow" x="-50%" y="-50%" width="200%" height="200%">
         <feOffset result="offOut" in="SourceAlpha" dx="0" dy="2" />
         <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
       </filter>
       <g id="txLogo" transform="translate(${border}, ${border})"><use ${this.ref}="#scalledLogo"/></g>
       <g id="scalledLogo" transform="scale(${scale})"><use ${this.ref}="#filledLogo"/></g>
       <g id="filledLogo">
         <circle cx="32" cy="32" r="30" fill="#211F1A"/>
         <use ${this.ref}="#logo" fill="url(#cd)"/>
       </g>`;
    this.body = `
        <use ${this.ref}="#txLogo" filter="url(#toShadow)" opacity="0.7"/>
        <use ${this.ref}="#txLogo"/>
      `;
  }
}

fastGenerate = (cons) => (...args) => new cons(...args).generate()

exports.generateLogo      = fastGenerate(Logo);
exports.generateAppLogo   = fastGenerate(AppLogo);
exports.generateInAppLogo = fastGenerate(InAppLogo);
