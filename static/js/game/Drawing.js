/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author Kenneth Li (kennethli.3470@gmail.com)
 * @todo Add explosion drawing.
 */

/**
 * Creates a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 * @constructor
 */
function Drawing(context, images) {
  this.context = context;

  this.images = images;
};

Drawing.NAME_FONT = '14px Helvetica';
Drawing.NAME_COLOR = 'black';

Drawing.HP_COLOR = 'green';
Drawing.HP_MISSING_COLOR = 'red';

Drawing.BASE_IMG_URL = '/static/img/';
Drawing.IMG_KEYS = [
  'self_tank', 'self_turret', 'other_tank', 'other_turret',
  'shield', 'bullet', 'tile'
];
Drawing.IMG_SRCS = {
  'self_tank': Drawing.BASE_IMG_URL + 'self_tank.png',
  'self_turret': Drawing.BASE_IMG_URL + 'self_turret.png',
  'other_tank': Drawing.BASE_IMG_URL + 'other_tank.png',
  'other_turret': Drawing.BASE_IMG_URL + 'other_turret.png',
  'shield': Drawing.BASE_IMG_URL + 'shield.png',
  'bullet': Drawing.BASE_IMG_URL + 'bullet.png',
  'tile': Drawing.BASE_IMG_URL + 'tile.png'
};
Drawing.TILE_SIZE = 100;

/**
 * Factory method for creating a Drawing object.
 * @param {CanvasRenderingContext2D} context The context this object will
 *   draw to.
 */
Drawing.create = function(context) {
  var images = {}
  for (key in Drawing.IMG_KEYS) {
    images[key] = new Image();
    images[key].src = Drawing.IMG_SRCS[key];
  }
  return new Drawing(context, images);
}

/**
 * Clears the canvas.
 */
Drawing.prototype.clear = function() {
  this.context.clearRect(0, 0, Constants.CANVAS_WIDTH,
                         Constants.CANVAS_HEIGHT);
};

/**
 * Draws a tank to the canvas.
 * @param {boolean} isSelf Tells if I should draw a green tank (self)
 *   or a red tank (other player).
 * @param {[number, number]} coords The coordinates of the center of the
 *   tank.
 * @param {number} orientation The orientation of the tank from 0 to
 *   2 * PI.
 * @param {number} turretAngle The angle of the turret from 0 to 2 * PI.
 * @param {string} name The name of the player associated with this tank.
 * @param {number} health The current health of the tank.
 */
Drawing.prototype.drawTank = function(isSelf, coords, orientation,
                                      turretAngle, name, health,
                                      hasShield) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.textAlign = 'center';
  this.context.font = Drawing.NAME_FONT;
  this.context.fillStyle = Drawing.NAME_COLOR;
  this.context.fillText(name, 0, -50);
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  for (var i = 0; i < 10; i++) {
    if (i < health) {
      this.context.fillStyle = Drawing.HP_COLOR;
      this.context.fillRect(-25 + 5 * i, -42, 5, 4);
    } else {
      this.context.fillStyle = Drawing.HP_MISSING_COLOR;
      this.context.fillRect(-25 + 5 * i, -42, 5, 4);
    }
  }
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var tank = null;
  if (isSelf) {
    tank = this.images['self_tank'];
  } else {
    tank = this.images['other_tank'];
  }
  this.context.drawImage(tank, -tank.width / 2, -tank.height / 2);
  this.context.restore();

  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(turretAngle);
  var turret = null;
  if (isSelf) {
    turret = this.images['self_turret'];
  } else {
    turret = this.images['other_turret'];
  }
  this.context.drawImage(turret, -turret.width / 2, -turret.height / 2);
  this.context.restore();

  if (hasShield != null && hasShield != undefined) {
    this.context.save()
    this.context.translate(coords[0], coords[1]);
    var shield = this.images['shield'];
    this.context.drawImage(shield, -shield.width / 2, -shield.height / 2);
    this.context.restore();
  }
};

/**
 * Draws a bullet.
 * @param {[number, number]} coords The coordinates of the center of the
 *   bullet.
 * @param {number} orientation The orientation of the bullet from 0 to 2 * PI
 */
Drawing.prototype.drawBullet = function(coords, orientation) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  this.context.rotate(orientation);
  var bullet = this.images['bullet'];
  this.context.drawImage(bullet, -bullet.width / 2, -bullet.height / 2);
  this.context.restore();
}

/**
 * Draws a powerup.
 * @param {[number, number]} coords The coordinates of the center of the
 *   powerup
 */
Drawing.prototype.drawPowerup = function(coords, name) {
  this.context.save();
  this.context.translate(coords[0], coords[1]);
  var powerup = new Image();
  /**
   * TODO: store all powerup images during initialization
   */
  powerup.src = Drawing.BASE_IMG_URL + name + '.png';
  this.context.drawImage(powerup, -powerup.width / 2, -powerup.height / 2);
  this.context.restore();
}

/**
 * Draws the background tiles.
 * @param {[number, number]} topLeft The coordinates of the top-leftmost
 *   point to start laying down the tiles from.
 * @param {[number, number]} bottomRight The coordinates of the
 *   bottom-rightmost point to stop laying the tiles down at.
 */
Drawing.prototype.drawTiles = function(topLeft, bottomRight) {
  this.context.save();
  var tile = this.images['tile'];
  for (var x = topLeft[0]; x < bottomRight[0]; x += Drawing.TILE_SIZE) {
    for (var y = topLeft[1]; y < bottomRight[1]; y += Drawing.TILE_SIZE) {
      this.context.drawImage(tile, x, y);
    }
  }
  this.context.restore();
}
