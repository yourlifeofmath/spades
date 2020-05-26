/**
 * Checks if a given string is a valid JSON
 * 
 * @param {String} string string to check
 * 
 * @returns true if is a valid JSON, false otherwise
 */
function isValidJson(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 
 * Execute a canvas function, converting relative coordinates to absolute coordinates on the canvas.
 * 
 * @param {context} context canvas context
 * @param {String} f canvas function to call
 * @param {Number} xstart x-coordinate of canvas area start
 * @param {Number} ystart y-coordinate of canvas area start
 * @param {Number} xend x-coordinate of canvas area end
 * @param {Number} yend y-coordinate of canvas area end
 * @param {Number} base_x max x coordinate in base terms
 * @param {Number} base_y max y coordinate in base terms
 * @param {list} args args to pass context.f function, which will be translated + resized
 * @param {boolean} resize resize coordinates or not
 * Mode of resizing is inferred from length of args:
 *  2: x, y
 *  3: arg (no resize), x, y
 *  4: x, y, width, height
 *  5: arg (no resize), x, y, width, height
 */
function draw_resize(context, f, xstart, ystart, xend, yend, base_x = 100, base_y = 100, args, resize) {
    if (args.length < 2){
        throw `Error: too few arguments given to draw_resize. f: ${f} args: ${args}`
    }
    if (args.length > 5){
        throw `Error: too many arguments given to draw_resize. f: ${f} args: ${args}`
    }
    i=0
    // If there are an odd number of args, the first arg is not resized
    if (args.length % 2 == 1){
        i=1
    }
    if (resize) {
        factor_x = (Math.floor(xend) - Math.floor(xstart))/base_x
        factor_y = (Math.floor(yend) - Math.floor(ystart))/base_y
        args[i] = args[i]*factor_x
        args[i+1] = args[i+1]*factor_y
    }
    args[i] = xstart + args[i]
    args[i+1] = ystart + args[i+1]
    // If there are >3 args, need to resize 'width' and 'height' parameters
    if (args.length > 3 && resize){
        args[i+2] = args[i+2]*factor_x
        args[i+3] = args[i+3]*factor_y
    }
    context[f].apply(context, args)
}

/**
 * 
 * Create a draw_resize function with set canvas, start/end area, base coordinates
 * 
 * @param {context} context canvas context
 * @param {Number} xstart x-coordinate of canvas area start
 * @param {Number} ystart y-coordinate of canvas area start
 * @param {Number} xend x-coordinate of canvas area end
 * @param {Number} yend y-coordinate of canvas area end
 * @param {*} base_x 
 * @param {*} base_y 
 */
function draw_function(context, xstart, ystart, xend, yend, base_x = 100, base_y = 100){
    return (f, args, resize=true) => draw_resize(context, f, xstart, ystart, xend, yend, base_x, base_y, args, resize)
}