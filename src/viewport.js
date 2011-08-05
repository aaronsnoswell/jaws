var jaws = (function(jaws) {

/**
 *
 * @class A window (Rect) into a bigger canvas/image. Viewport is always contained within that given image (called the game world).
 *
 * @property width  width of viewport, defaults to canvas width
 * @property height height of viewport, defaults to canvas height
 * @property max_x  maximum x-position for viewport, defaults to canvas width
 * @property max_y  maximum y-position for viewport, defaults to canvas height 
 *
 * @example
 * // Center viewport around players position (player needs to have x/y attributes)
 * // Usefull for sidescrollers
 * viewport.centerAround(player)
 *
 * // Common viewport usage. max_x/max_y could be said to set the "game world size"
 * viewport = viewport = new jaws.Viewport({max_x: 400, max_y: 3000})
 * player = new jaws.Sprite({x:100, y:400})
 * viewport.centerAround(player)
 *
 * // Draw player relative to the viewport. If viewport is way off, player won't even show up.
 * viewport.apply( function() {
 *  player.draw()
 * });
 *
 */
jaws.Viewport = function(options) {
  this.options = options
  this.context = options.context || jaws.context
  this.width = options.width || jaws.width
  this.height = options.height || jaws.height
  this.max_x = options.max_x || jaws.width 
  this.max_y = options.max_y || jaws.height

  /** Move viewport x pixels horizontally and y pixels vertically */
  this.move = function(x, y) {
    x && (this.x += x)
    y && (this.y += y)
    this.verifyPosition()
  };
  
  /** Move viewport to given x/y */
  this.moveTo = function(x, y) {
    if(!(x==undefined)) { this.x = x }
    if(!(y==undefined)) { this.y = y }
    this.verifyPosition()
  };

  /** 
   * Returns true if item is outside viewport 
   * @example
   *
   * if( viewport.isOutside(player)) player.die();
   *
   * // ... or the more advanced:
   * bullets = new SpriteList()
   * bullets.push( bullet )
   * bullets.deleteIf( viewport.isOutside )
   *
   */
  this.isOutside = function(item) {
    return(!this.isInside(item))
  };

  /** 
   * Returns true if item is inside viewport 
   */
  this.isInside = function(item) {
    return( item.x >= this.x && item.x <= (this.x + this.width) && item.y >= this.y && item.y <= (this.y + this.height) )
  };

  /** 
   * center the viewport around item. item must respond to x and y for this to work. 
   * Usefull for sidescrollers when you wan't to keep the player in the center of the screen no matter how he moves.
   */
  this.centerAround = function(item) {
    this.x = (item.x - this.width / 2)
    this.y = (item.y - this.height / 2)
    this.verifyPosition()
  };

  /** 
  * executes given draw-callback with a translated canvas which will draw items relative to the viewport
  * 
  * @example
  *
  * viewport.apply( function() {
  *   player.draw();
  *   foo.draw();
  * });
  * 
  */
  this.apply = function(func) {
    this.context.save()
    this.context.translate(-this.x, -this.y)
    func()
    this.context.restore()
  };

  /** @private */
  this.verifyPosition = function() {
    var max = this.max_x - this.width
    if(this.x < 0)      { this.x = 0 }
    if(this.x > max)    { this.x = max }

    var max = this.max_y - this.height
    if(this.y < 0)      { this.y = 0 }
    if(this.y > max)    { this.y = max }
  };
 
  this.moveTo(options.x||0, options.y||0)
}

jaws.Viewport.prototype.toString = function() { return "[Viewport " + this.x + ", " + this.y + "," + this.width + "," + this.height + "]" }

return jaws;
})(jaws || {});

