const { createCanvas, loadImage } = require('canvas')
const fs = require('fs')
const sizeOf = require('image-size')

let images = []
const unformattedDir = './images/unformatted/'
const formattedDir = './images/formatted/'

class Image {
  constructor(path, name, w, h, t) {
    this.path = path
    this.name = name
    this.width = w
    this.height = h
    this.type = t
  }
}

// Step 1 : Get Images from Folder
const getImages = () => {
  let files = fs.readdirSync(unformattedDir)
  return files
}

// Step 2 : Set size of image objects to image dimensions
const setSizes = (files) => {
  return files.map((imgName) => {
    let imgPath = `${unformattedDir}${imgName}`
    let { height, width, type } = sizeOf(imgPath)
    return new Image(imgPath, imgName, width, height, type)
  })
}

// Step 3 : Create canvas image file for image
let drawStuff = (img) => {
  let { name, path, width, height } = img
  let { cWidth, cHeight } = getCanvasDimensions(width, height)
  const canvas = createCanvas(cWidth, cHeight)
  const context = canvas.getContext('2d')

  context.fillStyle = '#fff'
  context.fillRect(0, 0, cWidth, cHeight)

  loadImage(path).then((image) => {
    context.drawImage(
      image,
      (cWidth - width) / 2,
      (cHeight - height) / 2,
      width,
      height
    )
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`${formattedDir}${name}`, buffer)
  })
}

const getCanvasDimensions = (width, height) => {
  let cWidth = width
  let cHeight = height
  if (cWidth > cHeight) {
    cHeight = cWidth
  } else {
    cWidth = cHeight
  }
  return { cWidth, cHeight }
}

let files = getImages()
let imgArray = setSizes(files)
imgArray.map((imgObj) => {
  drawStuff(imgObj)
})
