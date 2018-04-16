//
// class SVG {
//   constructor(){
//     this.defs   = [];
//     this.bodies = [];
//   }
//
//   render() {
//
//   }
// }


class Text {
  constructor(size=64, compatibleMode=true, xoff=0) {
    this.size           = size;
    this.compatibleMode = compatibleMode;
    this.borderMax      = 10
    this.borderSpread   = 0
    this.xoff           = xoff
    this.init();
  }

  init() {
    var scaleStop = 128;
    var scaleLog  = Math.log2(scaleStop);
    this.borderWidth    = this.borderMax - Math.pow(Math.log2(Math.min(this.size,128))/scaleLog,3)*scaleLog;
    this.scale          = this.size/64;

    this.d = this.borderWidth;
    this.height = 64;
    this.r = this.height/3.5;
    this.baseHeight = this.r*2;

    this.ww = 240;
    this.hh = this.size;

    this.spacing = 10;

    if (this.compatibleMode) {this.ref = "xlink:href"}
    else                     {this.ref = "href"}

    this.defs = ''
    this.body = `<use ${this.ref}="#text" fill="#AE8035"/>`
  }

  generate() {
    var widthOf_l    = this.d + this.spacing
    var widthOf_lu   = widthOf_l   + 2*this.r + this.spacing
    var widthOf_lun  = widthOf_lu  + 2*this.r + this.spacing
    var widthOf_luna = widthOf_lun + 2*this.r + this.spacing
    var docWidth = (widthOf_luna + this.xoff - this.spacing) * this.scale

    return `
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="${this.hh}" width="${docWidth}" viewBox="0 0 ${docWidth} ${this.hh}">
  <defs>

    <rect id="bg" width="${this.ww}" height="${this.hh}" fill="white"/>


    <circle id="dotT" r="${this.d/2}" cx="${this.d/2}" cy="${this.d/2}"/>
    <circle id="dotB" r="${this.d/2}" cx="${this.d/2}" cy="-${this.d/2}"/>
    <circle id="dotM" r="${this.d/2}" cx="${this.d/2}" cy="${this.d/2 + this.height - this.baseHeight}"/>

    <g id="letter_l">
      <use ${this.ref}="#dotT"/>
      <rect y="${this.d/2}" width="${this.d}" height="${this.height-this.d}"/>
      <use transform="translate(0,${this.height})" ${this.ref}="#dotB"/>
    </g>

    <mask id="letter_u_mask">
      <use ${this.ref}="#bg"/>
      <circle cx="${this.r}" cy="${this.height-this.r}" r="${this.r-this.d}" fill="black"/>
      <rect width="${this.r*2}" height="${this.height-this.r-1}" fill="black"/>
    </mask>

    <rect id="letter_u_side" y="${this.height-this.baseHeight+this.d/2}" width="${this.d}" height="${this.baseHeight-this.r-this.d/2}"/>

    <g id="letter_u">
      <use ${this.ref}="#dotM"/>
      <use ${this.ref}="#dotM" transform="translate(${this.r*2-this.d})"/>
      <circle cx="${this.r}" cy="${this.height-this.r}" r="${this.r}" mask="url(#letter_u_mask)"/>
      <use ${this.ref}="#letter_u_side"/>
      <use ${this.ref}="#letter_u_side" transform="translate(${this.r*2-this.d})"/>
    </g>

    <g id="letter_n">
      <use ${this.ref}="#letter_u" transform="rotate(180,${this.r},${this.height}) translate(0,${this.baseHeight})"/>
    </g>

    <mask id="letter_a_mask">
      <use ${this.ref}="#bg"/>
      <circle cx="${this.r}" cy="${this.height-this.r}" r="${this.r-this.d}" fill="black"/>
      <rect y="${this.height-this.r}" x="${this.r}" width="${this.r-this.d}" height="${this.r-this.d}" fill="black"/>

    </mask>

    <g id="letter_a" mask="url(#letter_a_mask)">
      <circle cx="${this.r}" cy="${this.height-this.r}" r="${this.r}"/>
      <rect y="${this.height-this.r}" x="${this.r}" width="${this.r}" height="${this.r}"/>
    </g>




    <g id="text">
       <use ${this.ref}="#letter_l"/>
       <use ${this.ref}="#letter_u" transform="translate(${widthOf_l})"/>
       <use ${this.ref}="#letter_n" transform="translate(${widthOf_lu})"/>
       <use ${this.ref}="#letter_a" transform="translate(${widthOf_lun})"/>
    </g>

    ${this.defs}

    </defs>
    <g transform="scale(${this.scale}) translate(${this.xoff})">${this.body}</g>
</svg>
`
  }
}


class Logo {
  constructor(size=64, compatibleMode=true) {
    this.size           = size;
    this.compatibleMode = compatibleMode;
    this.borderMax      = 10
    this.borderSpread   = 0
    this.init();
  }

  init() {
    var scaleStop = 128;
    var scaleLog  = Math.log2(scaleStop);
    this.borderWidth    = this.borderMax - Math.pow(Math.log2(Math.min(this.size,128))/scaleLog,3)*scaleLog;
    this.topRadius      = 32;
    this.borderOffset   = this.borderWidth - this.borderSpread;
    this.innerRadius    = this.topRadius - this.borderWidth - this.borderOffset;
    this.atomRadius     = this.innerRadius / 2;
    this.atomDiff       = 0;
    this.d              = 4;
    this.scale          = this.size/64;

    if (this.compatibleMode) {this.ref = "xlink:href"}
    else                     {this.ref = "href"}

    this.defs = ''
    this.body = `<use ${this.ref}="#logo" fill="red"/>`
  }

  generate() {
    return `
<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="${this.size}" width="${this.size}" viewBox="0 0 ${this.size} ${this.size}">
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

class MinimalBlackLogo extends Logo {
  constructor(size, compatibleMode) {
    super(size,compatibleMode);
    this.borderMax = 10
    this.borderSpread = 0
    this.init()
    this.body = `<use ${this.ref}="#logo" fill="black"/>`
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

class BlackBackgroundLogo extends Logo {
  constructor(size, compatibleMode) {
    super(size,compatibleMode);

    var border = 4
    var scale  = (64-2*border)/64

    this.defs = `
       <linearGradient id="cd" x1="0" y1="0" x2="0" y2="64px" gradientUnits="userSpaceOnUse">
         <stop offset="0%"   style="stop-color:#ECAE67;stop-opacity:1" />
         <stop offset="100%" style="stop-color:#E2963B;stop-opacity:1" />
       </linearGradient>
       <g id="txLogo" transform="translate(${border}, ${border})"><use ${this.ref}="#scalledLogo"/></g>
       <g id="scalledLogo" transform="scale(${scale})"><use ${this.ref}="#filledLogo"/></g>
       <g id="filledLogo">
         <use ${this.ref}="#logo" fill="url(#cd)"/>
       </g>`;
    this.body = `
        <rect id="bg" width="64" height="64" fill="#211F1A"/>
        <use ${this.ref}="#txLogo"/>
      `;
  }
}

class WhiteBackgroundLogo extends Logo {
  constructor(size, compatibleMode) {
    super(size,compatibleMode);

    var border = 4
    var scale  = (64-2*border)/64

    this.defs = `
       <linearGradient id="cd" x1="0" y1="0" x2="0" y2="64px" gradientUnits="userSpaceOnUse">
         <stop offset="0%"   style="stop-color:#FAAF67;stop-opacity:1" />
         <stop offset="100%" style="stop-color:#EB9139;stop-opacity:1" />
       </linearGradient>
       <g id="txLogo" transform="translate(${border}, ${border})"><use ${this.ref}="#scalledLogo"/></g>
       <g id="scalledLogo" transform="scale(${scale})"><use ${this.ref}="#filledLogo"/></g>

       <g id="filledLogo">
         <use ${this.ref}="#logo" fill="url(#cd)"/>
       </g>`;
    this.body = `
        <use ${this.ref}="#txLogo"/>
      `;
  }
}

fastGenerate = (cons) => (...args) => new cons(...args).generate()

exports.generateLogo                = fastGenerate(Logo);
exports.generateAppLogo             = fastGenerate(AppLogo);
exports.generateInAppLogo           = fastGenerate(InAppLogo);
exports.generateMinimalBlackLogo    = fastGenerate(MinimalBlackLogo);
exports.generateBlackBackgroundLogo = fastGenerate(BlackBackgroundLogo);
exports.generateWhiteBackgroundLogo = fastGenerate(WhiteBackgroundLogo);
exports.generateInAppLogoWithText   = (size, mode) => exports.generateInAppLogo(size, mode)+exports.generateText(size,mode,20);

exports.generateText             = fastGenerate(Text);
