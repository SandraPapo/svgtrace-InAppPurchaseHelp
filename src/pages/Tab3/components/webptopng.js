// convert image from webp to png

export async function webpToPng(file) {
//promise
return new Promise(async resolve => {

// convert a webp image to png format using canvas

// create a canvas element
const canvas = document.createElement('canvas');
canvas.width = file.width;
canvas.height = file.height;

// draw the image on the canvas
const context = canvas.getContext('2d');
context.drawImage(file, 0, 0, file.width, file.height);

// get the image data
// const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
// const data = imageData.data;

// save the image as a png file

const png = await canvas.toDataURL('image/png');

// return the png image
resolve( png);

});

}