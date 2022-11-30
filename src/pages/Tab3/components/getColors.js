//colorTheif to get colors

import ColorThief from '../../../../node_modules/colorthief/dist/color-thief.mjs'

export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function intToRGBA(int) {
    return {
        r: (int >> 24) & 255,
        g: (int >> 16) & 255,
        b: (int >> 8) & 255,
        a: int & 255
    };
}

// get the x,y pixel color from an uint8ClampedArray
function getPixelColor(data, x, y, width) {
    const offset = (y * width + x) * 4;
    return intToRGBA(data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3]);
}




export function getColors(path, numberOfColors) {
    // set image path
    const img = new Image();
    img.src = path;



    return new Promise(resolve => {
        // try catch to catch errors

        img.onload = function () {
            // create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // draw the image on the canvas
            const context = canvas.getContext('2d');
            // context.drawImage(img, 0, 0, img.width, img.height);

            
            // if image is too big, compress it
            const size = 1000;
            if (img.width > size || img.height > size) {
              // get the image ratio
              const ratio = img.width / img.height;
              // use the ratio to calculate the new width and height of the image so it fits in the 1000x1000 box
              canvas.width = ratio > 1 ? size : size * ratio;
              canvas.height  = ratio > 1 ? size / ratio : size;
          }
             
            

            context.drawImage(img, 0, 0, canvas.width, canvas.height);


            // get the image data
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // log the data
            console.log("the data is: ", data);

            // loop through the uint8ClampedArray and get the color count of each color
            const colorCount = {};
            for (let i = 0; i < data.length; i += 16) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                const alpha = data[i + 3];

                // skip transparent pixels
                if (alpha === 0) {
                    continue;
                }

                // convert the color to a hex string
                const color = rgbToHex(red, green, blue);

                // if the color is in the colorCount object, increment the count
                if (color in colorCount) {
                    colorCount[color]++;
                } else {
                    // otherwise, set the count to 1
                    colorCount[color] = 1;
                }
            }

            // group together the colors that are close to each other (within 10%) and keep track of the count
            const colorGroups = {};
            for (const color in colorCount) {
                // get the red, green, and blue values of the color
                const red = parseInt(color.substring(1, 3), 16);
                const green = parseInt(color.substring(3, 5), 16);
                const blue = parseInt(color.substring(5, 7), 16);

                // loop through the colorGroups object
                let colorGroupFound = false;
                for (const colorGroup in colorGroups) {
                    // get the red, green, and blue values of the color group
                    const colorGroupRed = parseInt(colorGroup.substring(1, 3), 16);
                    const colorGroupGreen = parseInt(colorGroup.substring(3, 5), 16);
                    const colorGroupBlue = parseInt(colorGroup.substring(5, 7), 16);

                    // if the color is within 10% of the color group, add it to the color group
                    if (
                        Math.abs(red - colorGroupRed) <= 25 &&
                        Math.abs(green - colorGroupGreen) <= 25 &&
                        Math.abs(blue - colorGroupBlue) <= 25
                    ) {
                        colorGroups[colorGroup] += colorCount[color];
                        colorGroupFound = true;
                        break;
                    }
                }

                // if the color is not within 10% of any color group, create a new color group
                if (!colorGroupFound) {
                    colorGroups[color] = colorCount[color];
                }
            }
            // print the color groups
            console.log("bruh: ", colorGroups);


            // sort the color groups by count
            const sortedColorGroups = Object.keys(colorGroups).sort(function (a, b) {
                return colorGroups[b] - colorGroups[a];
            });



            // log the color groups with the count
            console.log("the color groups are: ", sortedColorGroups);

            // count the total count of all elements in the color groups
            let total = 0;
            for (const color in colorGroups) {
                total += colorGroups[color];
            }

            // remove the colors that are less than 1% from sortedColorGroups
            const filteredColorGroups = sortedColorGroups.filter(function (color) {
                return colorGroups[color] / total >= 0.05;
            });

            // log the filtered color groups with the count as a percentage
            console.log("the filtered color groups as a percentage are: ", filteredColorGroups.map(function (color) {
                return color + " (" + Math.round(colorGroups[color] / total * 100) + "%)";
            }));


            // get the top numberOfColors colors
            const topColors = filteredColorGroups.slice(0, numberOfColors);

            // convert the colors to [r,g,b]
            const colors = topColors.map(function (color) {
                return [
                    parseInt(color.substring(1, 3), 16),
                    parseInt(color.substring(3, 5), 16),
                    parseInt(color.substring(5, 7), 16)
                ];
            });


            // log the top colors
            console.log("the top colors are: ", colors);

            // // delete the canvas element
            // canvas.remove();

            // // delete the context
            // context.remove();

            // // delete the image data
            // imageData.remove();

            resolve(colors);
            // resolve(colorPalette);
        }



    });


    // const colors = [];
    // for (let i = 0; i < data.length; i += 4) {
    //     const red = data[i];
    //     const green = data[i + 1];
    //     const blue = data[i + 2];
    //     const alpha = data[i + 3];
    //     const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    //     colors.push(color);
    // }


}


export async function getColorsOld(path, numberOfColors) {
    const colorThief = new ColorThief();
    // set image path
    const img = new Image();
    img.src = path;
    // get the color palette from the image
    return new Promise(resolve => {
        img.onload = function () {

            const colorPalette = colorThief.getPalette(img, numberOfColors)

            // map each rgb color in palette to a hex value
            // slice color palatte to only get the first 2 colors

            // const hexPalette = colorPalette.slice(0,numberOfColors).map(color => {
            //     return rgbToHex(color[0], color[1], color[2]);
            // })

            // console.log(hexPalette);
            resolve(colorPalette);
        }
    });

}



export function closestColor(hex, COLORS, numLayers) {
    //rgba['r']
    const rgba = intToRGBA(hex)

    const r = rgba['r'];
    const g = rgba['g'];
    const b = rgba['b'];
    var cr = COLORS[0][0];
    var cg = COLORS[0][1];
    var cb = COLORS[0][2];

    var minIndex = 0;
    var minColorDiff = Math.abs(((r - cr) ** 2) * 0.3 + ((g - cg) ** 2) * 0.59 + ((b - cb) ** 2) * 0.11);



    for (let i = 1; i < numLayers; i++) {
        cr = COLORS[i][0];
        cg = COLORS[i][1];
        cb = COLORS[i][2];

        const colorDiff = Math.abs(((r - cr) ** 2) * 0.3 + ((g - cg) ** 2) * 0.59 + ((b - cb) ** 2) * 0.11);
        // console.log('colorDif, min',colorDiff, ',' ,minColorDiff);

        if (colorDiff <= minColorDiff) {
            minColorDiff = colorDiff;
            minIndex = i;
        }
    }


    return { r: COLORS[minIndex][0], g: COLORS[minIndex][1], b: COLORS[minIndex][2], a: 1 };

}