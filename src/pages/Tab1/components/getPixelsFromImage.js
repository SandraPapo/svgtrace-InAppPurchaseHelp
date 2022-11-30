// write an async function that gets the pixels from an given image path and returns them as an array by using canvas

export async function getPixelsFromImage(imagePath) {
    console.log("imagePath: ", imagePath);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = imagePath;

    // await until the image is loaded
    return new Promise(resolve => {
        img.onload = function () {
            canvas.width = this.width;
            canvas.height = this.height;
            context.drawImage(this, 0, 0);
            const imageData = context.getImageData(0, 0, this.width, this.height);
            // get the rgba values of the image
            const data = imageData.data;
            // create an array of the rgba values
            const pixels = [];
            for (let i = 0; i < data.length; i += 4) {
                pixels.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
            }
            resolve(pixels);
        }
    });



}
