var potrace = require('potrace');
 
export function potraceWrapper(image) {
potrace.trace(image, function(err, svg) {
  if (err) throw err;
    console.log(svg);
});
}