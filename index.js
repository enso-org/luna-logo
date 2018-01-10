
exports.generate = function (size=64, compatibleMode=true) {

  var borderWidth  = 10 - Math.log2(Math.min(size,128))
  var topRadius    = 32;
  var borderOffset = borderWidth-1;
  var innerRadius  = topRadius - borderWidth - borderOffset;
  var atomRadius   = innerRadius / 2;
  var atomDiff     = 0;
  var d            = 4;

  var ref = null;
  if (compatibleMode) {ref = "xlink:href"}
  else                {ref = "href"}

  var html = `
  <svg height="${size}" width="${size}">
    <defs>
      <circle id="innerCircle" cx="32" cy="32" r="${innerRadius}"/>
      <circle id="leftAtom"    cx="${borderWidth + borderOffset +     atomRadius + atomDiff - d}" cy="32" r="${atomRadius + atomDiff + d}"/>
      <circle id="rightAtom"   cx="${borderWidth + borderOffset + 3 * atomRadius + atomDiff}" cy="32" r="${atomRadius - atomDiff}"/>
      <mask id="innerCircleMask">
        <use ${ref}="#innerCircle" fill="white"/>
      </mask>

      <rect id="bg" width="64" height="64" fill="white"/>
      <mask id="bgmask">
        <use ${ref}="#bg"/>
        <circle cx="32" cy="32" r="${32-borderWidth}" fill="black"/>
      </mask>

      <mask id="mainShapeMask">
        <use ${ref}="#bg"/>
        <use ${ref}="#leftAtom" fill="black"/>
        <rect cy="32" width="64" height="32" fill="black"/>
      </mask>

      <g id="border">
        <circle cx="32" cy="32" r="32" mask="url(#bgmask)"/>
      </g>

      <g id="front">
        <use ${ref}="#innerCircle" mask="url(#mainShapeMask)"/>
        <use ${ref}="#rightAtom"/>
      </g>

      <g id="logo">
      <use ${ref}="#border"/>
        <use ${ref}="#front" transform="rotate(35 32 32)"/>
      </g>

    </defs>
    <use ${ref}="#logo" fill="#b3802c" transform="scale(${size/64})"/>

  </svg>
  `
  return html
}
