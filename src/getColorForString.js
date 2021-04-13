import rgbToHsv from "./rgbToHsv"
import hsvToRgb from "./hsvToRgb"
import getContrastRatio from "./getContrastRatio"

// cache the calculated colors
let colorForString = {
  "": [0, 0, 0],
}

const defaultOptions = {
  contrast: 35,
}

function getColorForString(str = "", options = {}) {
  options = Object.assign({}, defaultOptions, options)
  const cacheKey = str + JSON.stringify(options)
  if (colorForString[cacheKey]) {
    return colorForString[cacheKey] || [0, 0, 0]
  }
  if (!str) {
    return colorForString[cacheKey] || [0, 0, 0]
  }
  const letters = str.split("")
  // get the hash
  const hash = letters.reduce((hash, l) => {
    const val = l.charCodeAt()
    return val * val * val * val + hash
  }, 0)
  // int to rgb
  const c = (hash & 0x00ffffff).toString(16).toUpperCase()
  const hex = "000000".substring(0, 6 - c.length) + c
  const int = parseInt(hex, 16)
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255

  const [hue, sat, val] = rgbToHsv(r, g, b)
  // value to 35 for contrast
  const rgb = hsvToRgb(hue, sat, Math.min(val, options.contrast || 35))
  colorForString[cacheKey] = rgb
  return rgb
}

const alphabets = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
]

export function getReadableColorForString(
  str,
  backgroundColor,
  mininumContrastRatio = 1.5,
  maxAttemp = 5
) {
  let attemp = 0
  let color = null
  let tmpStr = str
  while (attemp < maxAttemp) {
    color = getColorForString(tmpStr, { contrast: 200 })
    if (getContrastRatio(color, backgroundColor) >= mininumContrastRatio) {
      break
    }
    tmpStr = `${tmpStr}${alphabets[attemp]}`
    attemp += 1
  }
  return color
}

export default getColorForString
