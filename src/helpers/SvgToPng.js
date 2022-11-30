// make a function that converts an svg to a png


export function svgToPng(svg, width, height, callback) {

    var canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

                  // scale the canvas so its at least 1500px wide
              // if the width is less than 1500px, scale the canvas to 1500px
              if (canvas.width < 1500) {
                canvas.width = 1500;
                // scale the height of the canvas to match the width
                canvas.height = (1500 / width) * height;
              }

    var ctx = canvas.getContext('2d');
    var img = new Image();
    var svgAsXML = (new XMLSerializer).serializeToString(svg);

    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL("image/png"));
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgAsXML);
}






