/**
 * The retroscapes library helps define and build isometric renderings of
 * procedurally generated landscapes, with particular support for the HTML
 * Canvas API.
 *
 * Version: 0.1.0
 * Web: https://github.com/retroscapes
 */
(function(global) {
  'use strict';

  function sha256(input) {
    const rotr = function (v, a) { return (v >>> a) | (v << (32 - a)); };
    const mod2to32 = Math.pow(2, 32), result = '', int32s = [], bitLength = input.length * 8;
    const k = [
      1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075,
      -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716,
      -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
      -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895,
      666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259,
      -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
      430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
      1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998
    ];
    var d = [
      1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225,
      -876896931, 1654270250, -1856437926, 355462360, 1731405415, -1900787065, -619958771, 1203062813,
      -1369468586, -814971437, 796084093, 1830299338, -1958489001, -480201322, 474308610, 1863934769,
      -649150799, 214214161, 639484402, 1477814206, 1891102055, -1588511639, 1157183029, 1913507325,
      -1268304226, -902689931, 887149614, 1237834173, -2018788878, -1000103172, -331365389, 656899949,
      1628171250, 1948300446, -771913165, -461949548, 153196534, 458427541, -2036505790, -286970289,
      285697673, 570139515, 1135321014, 1974073629, -2043654119, -674397837, 134086911, 933187903,
      1723224488, 1984608322, -1531941919, -1017672683, -761910701, 503553856, -2055504914, -1566838050
    ];
    var i, j;

    if (input instanceof Uint8Array) {
      var bytes = Array.from(input);
      bytes.push(128);
      while (bytes.length % 64 - 56)
        bytes.push(0);
      input = new Uint8Array(bytes);
    } else {
      input += '\x80';
      while (input.length % 64 - 56)
        input += '\x00';
    }

    for (i = 0; i < input.length; i++) {
      j = (input instanceof Uint8Array) ? input[i] : input.charCodeAt(i);
      int32s[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    int32s[int32s.length] = (bitLength / mod2to32) | 0;
    int32s[int32s.length] = (bitLength)

    for (j = 0; j < int32s.length; ) {
      const w = int32s.slice(j, j += 16);
      const d_ = d;
      d = d.slice(0, 8);
      for (i = 0; i < 64; i++) {
        const i2 = i + j, w15 = w[i - 15], w2 = w[i - 2], a = d[0], e = d[4];
        const t1 =
          d[7] +
          (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & d[5]) ^ ((~e) & d[6])) +
          k[i] + (
            w[i] =
              (i < 16) ?
                w[i] :
                ((
                  w[i - 16] + (rotr(w15, 7) ^ rotr(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] + (rotr(w2, 17) ^ rotr(w2, 19) ^ (w2 >>> 10))
                ) | 0)
          );
        const t2 =
          (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & d[1]) ^ (a & d[2]) ^ (d[1] & d[2]));
        d = [(t1 + t2) | 0].concat(d);
        d[4] = (d[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) {
        d[i] = (d[i] + d_[i]) | 0;
      }
    }

    var output = new Uint8Array(8*4), c = 0;
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        output[c++] = (d[i] >> (j * 8)) & 255;
      }
    }
    return output;
  }

  class FeedCell extends Uint8Array {
    randReal(vs) {
      var index = vs[0] * 17;
      for (var i = 1; i < vs.length; i++) {
        if (i % 2 == 0) {
          index += 7 * vs[i];
        } else {
          index *= 3 * vs[i];
        }
      }
      return this[Math.abs(Math.floor(index)) % this.length] / 255;
    }

    randReals(n) {
      var rs = [];
      for (var i = 0; i < n; i++) {
        rs.push(this[i] / 255);
      }
      return rs;
    }

    randBoolWithProb(probability, offset) {
      offset = (offset == null) ? 0 : offset;
      return (((this[offset] + (this[offset] == 0 ? 1 : 0)) * 37) % 256) < (probability * 256);
    }
  }

  class FeedRegion {
    center() {
      return this[0][0];
    }

    randReal(vs) {
      return this[0][0].randReal(vs);
    }

    randBoolWithProb(probability, offset) {
      return this[0][0].randBoolWithProb(probability, offset);
    }

    relative(x, y) {
      return this[x][y];
    }

    up() {
      return this[-1][-1];
    }

    down() {
      return this[1][1];
    }

    left() {
      return this[-1][1];
    }

    right() {
      return this[1][-1];
    }

    countOnRing(p) {
      var c = 0;
      c += p(this[0][-1]) ? 1 : 0;
      c += p(this[1][-1]) ? 1 : 0;
      c += p(this[1][0]) ? 1 : 0;
      c += p(this[1][1]) ? 1 : 0;
      c += p(this[0][1]) ? 1 : 0;
      c += p(this[-1][1]) ? 1 : 0;
      c += p(this[-1][0]) ? 1 : 0;
      c += p(this[-1][-1]) ? 1 : 0;
      return c;
    }

    countAround(p) {
      const d = 2;
      var c = 0;
      for (var dx = -d; dx < d; dx++) {
        for (var dy = -d; dy < d; dy++) {
          if ((dx != 0 || dy != 0) && p(this[dx][dy])) {
            c += 1;
          }
        }
      }
      return c;
    }

    countOnAxes(p) {
      var c = 0;
      c += p(this[0][-1]) ? 1 : 0;
      c += p(this[1][0]) ? 1 : 0;
      c += p(this[0][1]) ? 1 : 0;
      c += p(this[-1][0]) ? 1 : 0;
      return c;
    }

    allOnAxes(p) {
      return this.countOnAxes(p) == 4;
    }

    noneOnAxes(p) {
      return this.countOnAxes(p) == 0;
    }
  }

  class Feed {
    constructor(configuration) {
      this.xPos = [sha256('a')];
      this.xNeg = [sha256('b')];
      this.yPos = [sha256('c')];
      this.yNeg = [sha256('d')];
      this.cache = {};
      this.configuration = configuration;
      this.cacheFeedCells = {};
      this.cacheFeedRegions = {};
    }

    at(coordinates, quantity) {
      var xs = (coordinates.x < 0) ? this.xNeg : this.xPos;
      var ys = (coordinates.y < 0) ? this.yNeg : this.yPos;

      for (var i = xs.length; i <= Math.abs(coordinates.x); i++) {
        xs.push(sha256(xs[i - 1]));
      }
      for (var i = ys.length; i <= Math.abs(coordinates.y); i++) {
        ys.push(sha256(ys[i - 1]));
      }

      // For quantities beyond 32^2, the sequence will repeat.
      var rs = new FeedCell(32), j = 0;
      for (var i = 0; i < quantity; i++) {
        rs[i] = (
          xs[Math.abs(coordinates.x)][i % 32] +
          ys[Math.abs(coordinates.y)][(i + j) % 32]
        ) % 256;
        if (i % 32 == 31) {
          j = (j + 1) % 32;
        }
      }
      return rs;
    }

    around(coordinates, d) {
      var t = 0, c = 0;
      for (var x = coordinates.x - d; x < coordinates.x + d; x++) {
        for (var y = coordinates.y - d; y < coordinates.y + d; y++) {
          var r = this.at({"x": x, "y": y}, 1);
          t += (isNaN(r[0]) ? 0 : r[0]);
          c += (isNaN(r[0]) ? 0 : 1);
        }
      }
      return Math.min(Math.floor(t / c), 255);
    }

    nearest(coordinates) {
      const quantity = this.configuration.quantity;
      const d = this.configuration.d;
      const pAnchor = this.configuration.pAnchor;
      const pTethered = this.configuration.pTethered;
      var dist = null;
      var r = this.at({"x": coordinates.x, "y": coordinates.y}, quantity);
      var r0 = r[0] + (r[0] == 0 ? 1 : 0);
      const tethered = ((r0 * 17) % 256) < (pTethered * 256);
      if (((r0 * 103) % 256) < (pAnchor * 256)) {
        return r;
      }
      for (var x = coordinates.x - d; x < coordinates.x + d; x++) {
        for (var y = coordinates.y - d; y < coordinates.y + d; y++) {
          var o = this.at({"x": x, "y": y}, quantity);
          if ( ((((o[0] + (o[0] == 0 ? 1 : 0)) * 103) % 256) < (pAnchor * 256))
            && tethered
             ) {
            var d_ = Math.pow(coordinates.x - x, 2) + Math.pow(coordinates.y - y, 2);
            if (dist == null || d_ < dist) {
              r = o;
              dist = d_;
            }
          }
        }
      }
      return r;
    }

    feedCellAt(x, y) {
      var fc = this.cacheFeedCells[x + "," + y];
      if (fc == null) {
        fc = this.nearest({"x": x, "y": y});
        this.cacheFeedCells[x + "," + y] = fc;
      }
      return fc;
    }

    feedRegionAt(coordinates) {
      const x = coordinates.x, y = coordinates.y;
      const cs = coordinates.toCSV();
      if (cs in this.cacheFeedRegions) {
        return this.cacheFeedRegions[cs];
      } else {
        var fr = new FeedRegion();

        for (var dx = -2; dx <= 2; dx++) {
          fr[dx] = {};
          for (var dy = -2; dy <= 2; dy++) {
            fr[dx][dy] = this.feedCellAt(x + dx, y + dy);
          }
        }

        this.cacheFeedRegions[cs] = fr;
        return fr;
      }
    }
  }

  class Vector {
    constructor(o) {
      this.update(o);
    }

    update(o) {
      for (var attribute in o) {
        this[attribute] = o[attribute];
      }
    }

    toCSV() {
      var vs = [];
      for (var attribute in this) {
        const value = this[attribute];
        if (!isNaN(value)) {
          vs.push(value);
        }
      }
      return vs.join(",");
    }
  }

  class Color extends Array {
    constructor(parameter) {
      super();

      // Convert hex color code.
      if (typeof parameter === 'string' || parameter instanceof String) {
        parameter = Color.fromHex(parameter);
      }

      for (var i = 0; i < parameter.length; i++) {
        this.push(parameter[i]);
      }

      // Add an opacity value if it is not present.
      if (this.length == 3) {
        this.push(1.0);
      }
    }

    static hexCharCodeToIntAt(s, i) {
      var c = s.charCodeAt(i);
      return (c >= 48 && c < 58) ? c - 48 : c - 87;
    }

    static fromHex(h) {
      h = h.toLowerCase();
      return [
        (Color.hexCharCodeToIntAt(h, 1) * 16) + Color.hexCharCodeToIntAt(h, 2),
        (Color.hexCharCodeToIntAt(h, 3) * 16) + Color.hexCharCodeToIntAt(h, 4),
        (Color.hexCharCodeToIntAt(h, 5) * 16) + Color.hexCharCodeToIntAt(h, 6)
      ];
    }

    static rgbRandom() {
      return Color([
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        255
      ]);
    }

    static max(c1, c2) {
     return new Color([
        Math.max(c1[0], c2[0]),
        Math.max(c1[1], c2[1]),
        Math.max(c1[2], c2[2]),
        Math.max(c1[3], c2[3])
      ]);
    }

    nearby(d, rs) {
      return new Color([
        Math.min(255, Math.max(0, Math.floor(this[0] - d + (2 * d * rs[0])))),
        Math.min(255, Math.max(0, Math.floor(this[1] - d + (2 * d * rs[1])))),
        Math.min(255, Math.max(0, Math.floor(this[2] - d + (2 * d * rs[2])))),
        this[3]
      ]);
    }

    darker(p) {
      return new Color([
        Math.max(0, this[0] - Math.floor((this[0] * p) / 100)),
        Math.max(0, this[1] - Math.floor((this[1] * p) / 100)),
        Math.max(0, this[2] - Math.floor((this[2] * p) / 100)),
        this[3]
      ]);
    }

    lighter(p) {
      return new Color([
        Math.min(255, this[0] + Math.floor(((255-this[0])*p)/100)),
        Math.min(255, this[1] + Math.floor(((255-this[1])*p)/100)),
        Math.min(255, this[2] + Math.floor(((255-this[2])*p)/100)),
        this[3]
      ]);
    }

    lighterOrDarker(p, l) {
      if (l == null || l == true) {
        return p > 0 ? this.lighter(Math.abs(p)) : this.darker(Math.abs(p));
      } else {
        return this;
      }
    };

    rgb() {
      return 'rgb(' + [
        this[0],
        this[1],
        this[2]
      ].join(",") + ')';
    };

    rgba(c) {
      return 'rgba(' + (
        (c == null) ?
        [this[0], this[1], this[2], this[3]] :
        [
          (c.r == null) ? this[0] : c.r,
          (c.g == null) ? this[1] : c.g,
          (c.b == null) ? this[2] : c.b,
          (c.a == null) ? this[3] : c.a
        ]
      ).join(",") + ')';
    }
  }

  class Surface {
    constructor(o) {
      for (var a in o) {
        this[a] = o[a];
      }
    }

    components(order) {
      return [this, this, this];
    }

    setColor(c) {
      this.color = c;
    }

    setStroke(s) {
      this.stroke = s;
    }

    solid(feed, args) {
      return this.color;
    }
  }

  class Surfaces {
    constructor(surfaces) {
      for (var a in surfaces) {
        this[a] = new Surface(surfaces[a]);
      }
    }

    components(order) {
      return [this.mesial, this.lateral, this.top];
    }

    setColor(c) {
      this.mesial.color = c;
      this.lateral.color = c;
      this.top.color = c;
    }

    setStroke(s) {
      this.mesial.color = s;
      this.lateral.color = s;
      this.top.color = s;
    }
  }

  class Concept {
    constructor(o) {
      if (o.type === 'atom') {
        this.$ = o;
        this.$.coordinates = new Vector((o.coordinates == null) ? {"x": 0, "y":0, "z": 0} : o.coordinates);
        this.$.scales = new Vector((o.scales == null) ? {"x": 1, "y":1, "z": 1} : o.scales);
        this.$.offsets = new Vector((o.offsets == null) ? {"x": 0, "y":0, "z": 0} : o.offsets);

        if (this.$.surface != null) {
          this.$.surface = (this.$.surface.type != null) ?
            new Surface(this.$.surface) :
            new Surfaces(this.$.surface);
        }
      } else {
        for (var a in o) {
          this[a] = o[a];
        }
        this.$ = {};
      }
    }

    instance() {
      var es = {}, count = 0;
      for (var a in this) {
        if (a != '$') {
          es[a] = this[a].instance();
          count += 1;
        }
      }
      return new Concept(
        (count == 0) ?
        JSON.parse(JSON.stringify(this)).$ :
        es
      );
    }

    isCompound() {
      return this.$.type != 'atom';
    }

    setColor(c) {
      if (this.isCompound()) {
        for (var a in this) {
          if (this[a].setColor != null) {
            this[a].setColor(c);
          }
        }
      } else {
        if (this.$.surface != null) {
          this.$.surface.setColor(c);
        }
      }
    }

    setStroke(s) {
      if (this.isCompound()) {
        for (var a in this) {
          if (this[a].setStroke != null) {
            this[a].setStroke(s);
          }
        }
      } else {
        if (this.$.surface != null) {
          this.$.surface.setStroke(s);
        }
      }
    }
  }

  class Instance {
    constructor(o) {
      for (var a in o) {
        var v = o[a];
        if (a == 'surface') {
          v = (v.type != null) ? new Surface(v) : new Surfaces(v);
        }
        this[a] = v;
      }
    }

    surfaceComponents(order) {
      return this.surface.components(order);
    }
  }

  class Scape {
    coordinates(cs) {
      return cs;
    }

    render() {
      return [];
    }
  }

  class Geometry {
    constructor(parameters) {
      this.dimensions = parameters.dimensions;
      this.orientation = parameters.orientation;
      this.unit = (parameters.unit == null) ? 30 : parameters.unit;
      this.theta = ((Math.PI/2) * this.orientation.tilt) / 90; // From profile view to top view.
      this.tilt = Math.sin(this.theta);
      this.tiltNorm = this.tilt / Math.SQRT2;
      this.uX = this.unit / Math.SQRT2;
      this.uY = this.uX * this.tilt;
      this.uZ = this.unit * Math.sin((Math.PI/2) - this.theta);
    }

    setDimensions(dimensions) {
      this.dimensions = dimensions;
    }

    aspect() {
      return this.dimensions.width / this.dimensions.height;
    }

    setCenter(coordinates) {
      this.center = new Vector(coordinates);
      this.centerGrid = this.getCenterGrid();
    }

    getCenter() {
      return (this.center != null && this.center != undefined) ?
        this.center :
        new Vector({
          "x": Math.floor(this.dimensions.width / 2),
          "y": Math.floor(this.dimensions.height / 2)
        });
    }

    getCenterGrid() {
      var center = this.getCenter();
      return this.canvasToPlaneGrid({
        "x": this.dimensions.width - center.x,
        "y": this.dimensions.height - center.y
      });
    }

    getOffsetFromCenterGrid(coordinates) {
      const center = this.getCenterGrid();
      return {
        "x": coordinates.x - center.x,
        "y": coordinates.y - center.y
      };
    }

    canvasToPlane(coordinates) {
      const x = (((coordinates.x - this.uX) - (this.dimensions.width / 2)) / (this.uX * 2));
      const y = ((coordinates.y - (this.dimensions.height / 2)) / (this.uY * 2));
      return new Vector({"x": 1 + x + y, "y": - x + y});
    }

    canvasToPlaneGrid(coordinates) {
      coordinates = this.canvasToPlane(coordinates);
      return new Vector({"x": Math.floor(coordinates.x), "y": Math.floor(coordinates.y)});
    }

    gridPlaneCellVisibleMap(func, maxHeight) {
      maxHeight = (maxHeight == null) ? 7 : maxHeight;
      const gridWidthHalf = Math.floor((this.dimensions.width / this.uX) / 2);
      const gridHeight = Math.floor(this.dimensions.height / this.uY);
      var c = this.getCenter();
      const topLeft = this.canvasToPlaneGrid({
        "x": (this.dimensions.width / 2) - c.x,
        "y": (this.dimensions.height / 2) - c.y
      });
      const heightAccountingOffset = Math.floor((maxHeight * this.uZ) / this.uY);
      for (var i = -2; i < gridHeight + 5 + heightAccountingOffset; i++) {
        for (var j = Math.floor(i/2); j < gridWidthHalf + 3 + Math.floor(i/2); j++) {
          func(new Vector({"x": topLeft.x + j, "y": topLeft.y + i - j}));
        }
      }
    }
  }

  class Effect {
    render(coordinates) {
      return true;
    }

    color(coordinates, color, stroke) {
      return color;
    }
  }

  // Wrapper class for a canvas element.
  class Canvas {
    constructor(canvas, projection, click) {
      this.projection = projection;
      this.canvas = canvas;
      this.click = click;

      const self = this;
      this.canvas.addEventListener('click', function(e) { self.eventOnClick(e); });
    }

    eventOnClick(e) {
      this.click();
    }
  }

  class Render {
    constructor(parameters) {
      // HTML canvas element reference.
      this.canvas = parameters.canvas;

      // Randomness feed.
      this.feed = parameters.feed;

      // Geometric parameters.
      this.projection = parameters.projection;

      // Visual rendering parameters.
      this.background = (parameters.background) == null ? "#ffffff" : parameters.background;

      this.light =
        (parameters.light == null) ?
        {"top": 100, "left": 80, "right": 50} :
        parameters.light;

      this.effects = (parameters.effects == null) ? [] : parameters.effects;
      for (var i = 0; i < this.effects.length; i++) {
        this.effects[i].projection = this.projection;
      }

      // Rendering pipeline parameters.
      this.precedence = (parameters.precedence == null) ? false : parameters.precedence;

      // State.
      this.rendering = false;
    }

    initialize(center) {
      if (this.projection.dimensions == null) {
        // Match canvas pixel to in-browser rendered pixel.
        var dimensions = {
          "width": this.canvas.clientWidth, "height": this.canvas.clientHeight
        };
        this.projection.setDimensions(dimensions);
      }

      if (center != null && center != undefined)
        this.projection.setCenter(center);

      // Set number of pixels to match current dimensions and the center.
      this.canvas.width = this.projection.dimensions.width;
      this.canvas.height = this.projection.dimensions.height;

      // Set the background color.
      this.context = this.canvas.getContext('2d');
      this.context.fillStyle = new Color(this.background).rgb();
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setProjection(projection) {
      this.projection = projection;
      for (var i = 0; i < this.effects.length; i++) {
        this.effects[i].projection = this.projection;
      }
      this.canvas.projection = projection;
    }

    project(v) {
      const g = this.projection;
      var x = v.coordinates.x;
      var y = v.coordinates.y;
      var z = v.coordinates.z;

      if (v.scales != null && v.offsets != null) {
        if (v.scales.x != null && v.offsets.x != null) {
          x = x + (((1 - v.scales.x) / 2) * v.offsets.x);
        }
        if (v.scales.y != null && v.offsets.y != null) {
          y = y + (((1 - v.scales.y) / 2) * v.offsets.y);
        }
      }

      return {
        "coordinates": {
          "x": g.getCenter().x + (x * g.uX) - (y * g.uX),
          "y": g.getCenter().y + (y * g.uY) + (x * g.uY) - (z * g.uZ)
        },
        "dimensions": {
          "height": g.uZ * v.dimensions.height
        },
        "feed": v.feed
      };
    }

    stroke(surface, coordinates) {
      const stroke = surface.stroke;
      const c_ = new Color(stroke.color);
      const c = this.effectsOnColor(c_, coordinates, true);
      this.context.strokeStyle = c.rgb();
      this.context.setLineDash(stroke.lineDash);
      this.context.lineWidth = stroke.lineWidth;
      this.context.stroke();
      this.context.setLineDash([]);
    }

    prismEnd(surface, gs, v, p, scale, offset, color, bottom) {
      const g = this.projection;
      var s = (scale == null) ? {"x":1, "y":1} : scale;
      var o = (offset == null) ? {"x":0, "y":0} : offset;
      s = {"x": s.x * v.scales.x, "y": s.y * v.scales.y};
      o = {"x": o.x * v.scales.x, "y": o.y * v.scales.y};
      const yd = (p.dimensions.height * ((1 - v.scales.z)/2));
      const h = (bottom === true) ? 0 : p.dimensions.height * v.scales.z;
      const x = (g.uX * ((1 - v.scales.x)/2)) - (g.uX * ((1 - v.scales.y)/2)) +
        p.coordinates.x - gs.uX + ((Math.SQRT2/2)*o.x) - (o.y/Math.SQRT2);
      const y = -((1 + v.offsets.z) * yd) + (g.uY * ((1 - v.scales.x)/2)) +
        (g.uY * ((1 - v.scales.y)/2)) + p.coordinates.y +
        (o.x*g.tiltNorm) + (o.y*g.tiltNorm) - h;
      const shape = {
        "lft": {"x": x + ((1 - s.y) * gs.uX), "y": y  - gs.uY + (gs.uY*s.y)},
        "bot": {
          "x": x + (s.x * gs.uX) + ((1 - s.y) * gs.uX),
          "y": y + (gs.uY * s.x) - (gs.uY * (1 - s.y))
        },
        "rgt": {"x": x + gs.uX + (s.x * gs.uX), "y": y  - ((1 - s.x) * gs.uY)},
        "top": {"x": x + gs.uX, "y": y  - gs.uY}
      };
      if ( (shape.top.y < this.projection.dimensions.height || shape.bot.y > 0)
        && (shape.lft.x < this.projection.dimensions.width || shape.rgt.x > 0)
         ) {
        var c_ = (color == null) ? surface.color : color;
        c_ = new Color(c_).lighterOrDarker(this.light.top, surface.lit);
        c_ = this.effectsOnColor(c_, p.coordinates);
        this.context.fillStyle = c_.rgba();
        this.context.strokeStyle = "rgba(0,0,0,0)";

        this.context.beginPath();
        this.context.moveTo(shape.lft.x, shape.lft.y);
        this.context.lineTo(shape.top.x, shape.top.y);
        this.context.lineTo(shape.rgt.x, shape.rgt.y);
        this.context.lineTo(shape.bot.x, shape.bot.y);
        this.context.lineTo(shape.lft.x, shape.lft.y);
        this.context.fill();

        if ("stroke" in surface) {
          this.stroke(surface, p.coordinates);
        }
      }
    }

    prismTop(surface, gs, v, p, scale, offset, color) {
      this.prismEnd(surface, gs, v, p, scale, offset, color, false);
    }

    prismLeft(surface, gs, v, p, scale, offset, color) {
      const g = this.projection;
      const s = (scale == null) ? {"x":1, "y":1} : scale;
      const o = (offset == null) ? {"x":0, "y":0} : offset;
      const s_ = {"x": s.x * v.scales.x, "y": s.y * v.scales.y};
      const o_ = {"x": o.x * v.scales.x, "y": o.y * v.scales.y};
      const yd = (p.dimensions.height * ((1 - v.scales.z)/2));
      const h = p.dimensions.height * v.scales.z;
      const x = (g.uX * ((1 - v.scales.x)/2)) - (g.uX * ((1 - v.scales.y)/2)) +
        p.coordinates.x - gs.uX +
        (o.x / Math.SQRT2)      + gs.uX*(1 - v.scales.y);
      const y = -((1 + v.offsets.z) * yd) + (g.uY * ((1 - v.scales.x)/2)) +
        (g.uY * ((1 - v.scales.y)/2)) + p.coordinates.y +
        o.y + (o.x * g.tiltNorm) - h    - gs.uY*(1 - v.scales.y);
      const shape = {
        "toplft": {"x": x, "y": y},
        "botlft": {"x": x, "y": y + s.y * h},
        "botrgt": {"x": x + (s_.x * gs.uX), "y": y + s.y * h + ((s_.x * gs.uY))},
        "toprgt": {
          "x": x + (s_.x * gs.uX),
          "y": y + s.y * h + ((s_.x * gs.uY) + (s.y * (-h)))
        }
      };
      if ( (shape.toplft.y < this.projection.dimensions.height || shape.botrgt.y > 0)
        && (shape.toplft.x < this.projection.dimensions.width || shape.botrgt.x > 0)
         ) {
        var c_ = (color == null) ? surface.color: color;
        c_ = new Color(c_).lighterOrDarker(this.light.left, surface.lit);
        c_ = this.effectsOnColor(c_, p.coordinates);
        this.context.fillStyle = c_.rgb();
        this.context.strokeStyle = "rgba(0,0,0,0)";

        this.context.beginPath();
        this.context.moveTo(shape.toplft.x, shape.toplft.y);
        this.context.lineTo(shape.botlft.x, shape.botlft.y);
        this.context.lineTo(shape.botrgt.x, shape.botrgt.y);
        this.context.lineTo(shape.toprgt.x, shape.toprgt.y);
        this.context.lineTo(shape.toplft.x, shape.toplft.y);
        this.context.fill();

        if ("stroke" in surface) {
          this.stroke(surface, p.coordinates);
        }
      }
    }

    prismRight(surface, gs, v, p, scale, offset, color) {
      const g = this.projection;
      const s = (scale == null) ? {"x":1, "y":1} : scale;
      const o = (offset == null) ? {"x":0, "y":0} : offset;
      const s_ = {"x": s.x * v.scales.x, "y": s.y * v.scales.y};
      const o_ = {"x": o.x * v.scales.x, "y": o.y * v.scales.y};
      const yd = (p.dimensions.height * ((1 - v.scales.z)/2));
      const h = p.dimensions.height * v.scales.z;
      const x = (g.uX * ((1 - v.scales.x)/2)) - (g.uX * ((1 - v.scales.y)/2)) +
        p.coordinates.x - gs.uX + (o_.x/Math.SQRT2)        -
        gs.uX*(1 - v.scales.x);
      const y =
        -((1 + v.offsets.z) * yd) + (g.uY * ((1 - v.scales.x)/2)) +
        (g.uY * ((1 - v.scales.y)/2)) + p.coordinates.y + o_.y - (o_.x * g.tiltNorm) -
        h    - gs.uY*(1 - v.scales.x);
      const omvsy = (1 - v.scales.y);
      const xo = gs.uX * omvsy;
      const yo = - gs.uY * (1 - v.scales.y);
      const columns = (surface.columns == null) ? 1 : surface.columns;
      const sx = s.x * (1 + ((columns - 1) * (1 - v.scales.y)));

      const shape = {
        "toplft": {"x": x + gs.uX + xo, "y": y + yo + gs.uY},
        "toprgt": {
          "x": x + gs.uX + (sx * gs.uX),
          "y": y + yo + gs.uY + ((omvsy - sx) * gs.uY)
        },
        "botrgt": {
          "x": x + gs.uX + (sx * gs.uX),
          "y": y + yo + gs.uY + ((omvsy - sx) * gs.uY) + (s.y * h)
        },
        "botlft": {"x": x + gs.uX + xo, "y": y + yo + (s.y * h) + gs.uY}
      };
      if ( (shape.toprgt.y < this.projection.dimensions.height || shape.botlft.y > 0)
        && (shape.botlft.x < this.projection.dimensions.width || shape.botrgt.x > 0)
         ) {
        var c_ = (color == null) ? surface.color : color;
        c_ = new Color(c_).lighterOrDarker(this.light.right, surface.lit);
        c_ = this.effectsOnColor(c_, p.coordinates);
        this.context.fillStyle = c_.rgb();
        this.context.strokeStyle = "rgba(0,0,0,0)";

        this.context.beginPath();
        this.context.moveTo(shape.toplft.x, shape.toplft.y);
        this.context.lineTo(shape.toprgt.x, shape.toprgt.y);
        this.context.lineTo(shape.botrgt.x, shape.botrgt.y);
        this.context.lineTo(shape.botlft.x, shape.botlft.y);
        this.context.lineTo(shape.toplft.x, shape.toplft.y);
        this.context.fill();

        if ("stroke" in surface) {
          this.stroke(surface, p.coordinates);
        }
      }
    }

    prism(v) {
      const g = this.projection;
      const p = this.project(v);
      var hs = [v.dimensions.height, v.dimensions.height, 1];
      var sides = ["prismLeft", "prismRight", "prismTop"];
      var surfaces = v.surfaceComponents(true);
      for (var side = 0; side < sides.length; side++) {
        var surface = surfaces[side];
        if (surface.type == "solid") {
          this[sides[side]](surface, g, v, p, {"x": 1, "y": 1}, {"x": 0, "y": 0}, surface.solid());
        }
      }
      return p;
    }

    instances(e, es, attrs) {
      es = (es == null) ? [] : es;
      attrs = (attrs == null) ? {} : attrs;
      if (e.$ != null && e.$.type === 'atom') {
        e.$.coordinates = ("coordinates" in e.$) ? e.$.coordinates : {};
        if ("coordinates" in attrs) {
          if (!("x" in e.$.coordinates)) {
            e.$.coordinates.x = attrs.coordinates.x;
          }
          if (!("y" in e.$.coordinates)) {
            e.$.coordinates.y = attrs.coordinates.y;
          }
        }
        es.push(new Instance(e.$));
      } else if (e.$ != null && e.$.type !== 'atom') {
        if ("coordinates" in e.$) {
          attrs.coordinates = ("coordinates" in attrs) ? attrs.coordinates : {};
          if ("x" in e.$.coordinates) {
            attrs.coordinates.x = e.$.coordinates.x;
          }
          if ("y" in e.$.coordinates) {
            attrs.coordinates.y = e.$.coordinates.y;
          }
        }

        for (var a in e) {
          if (a != '$') {
            this.instances(e[a], es, attrs);
          }
        }
      } else if (Array.isArray(e)) {
        for (var a in e) {
          this.instances(e[a], es);
        }
      }
      return es;
    }

    effectsOnColor(color, coordinates, stroke) {
      stroke = (stroke == null) ? false : stroke;
      for (var i = 0; i < this.effects.length; i++) {
        color = this.effects[i].color(coordinates, color, stroke);
      }
      return color;
    }

    prepare(center, ss, fi) {
      // Initialize the canvas.
      this.initialize(center);

      this.context.fillStyle = new Color(this.background).rgb();
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      var vs = []; // Rendered instances.
      if (ss != null) {
        const self = this;
        for (var i = 0; i < ss.render().length; i++) {
          const scape = ss.render()[i];
          this.projection.gridPlaneCellVisibleMap(function(coordinates) {

            // Determine whether any active effects indicate that the
            // current coordinates should not be rendered.
            var render = true;
            if (self.effects != null) {
              for (var j = 0; j < self.effects.length; j++) {
                render = render && self.effects[j].render(coordinates);
              }
            }

            if (render) {
              var es = null, fr = null;

              // Apply coordinate transformation, if one was supplied.
              const coordinates_ = ss.coordinates(coordinates);

              // Either re-prepare or use the cache when possible.
              fr = self.feed.feedRegionAt(coordinates_);
              es = self.instances(ss[scape](coordinates, fr));

              // Add the evaluated instances to the pipeline.
              for (var j = 0; j < es.length; j++) {
                if (es[j].render != false) {
                  vs.push(es[j]);
                }
              }
            }
          });
        }
      }

      // Sort values so that they are rendered with correct occlusions.
      // Precedence of the `x` and `y` dimensions does not matter, so choose
      // it at random.
      if (Math.random() > 0.5) {
        vs.sort(function (a, b) {
          var a = a.coordinates, b = b.coordinates;
          const do_ = a.o - b.o, dz = a.z - b.z, dy = a.y - b.y, dx = a.x - b.x;
          return (dx == 0) ? ((dy == 0) ? ((dz == 0) ? do_ : dz) : dx) : dy;
        });
      } else {
        vs.sort(function (a, b) {
          var a = a.coordinates, b = b.coordinates;
          const do_ = a.o - b.o, dz = a.z - b.z, dy = a.y - b.y, dx = a.x - b.x;
          return (dx == 0) ? ((dy == 0) ? ((dz == 0) ? do_ : dz) : dy) : dx;
        });
      }

      return vs;
    }

    render(center, ss, fi, precedence) {
      precedence = (precedence == null) ? this.precedence : precedence;
      this.bounds = {"xMin": null, "yMin": null, "xMax": null, "yMax": null};
      const vs = this.prepare(center, ss, fi), vps = [];
      if (!precedence) {
        for (var i = 0; i < vs.length; i++) {
          const v = vs[i];
          const p = this[v.form.shape](v);
          vps.push({"v":v, "p":p});
        }
      } else {
        var precedence_ = {};
        for (var i = 0; i < vs.length; i++) {
          const v = vs[i];
          const cs = v.coordinates.toCSV();
          if (!(cs in precedence_)) {
            const p = this[v.form.shape](v);
            vps.push({"v":v, "p":p});
          }
          precedence_[cs] = true;
        }
      }
      return vps;
    }

    renderGradually(center, ss, fi, callback, tick, batch, vs, index) {
      this.rendering = true;
      tick = (tick == null) ? 1 : tick;
      batch = (batch == null) ? 16 : batch;
      if (vs == null && index == null) {
        vs = this.prepare(center, ss, fi);
        index = 0;
      }
      const self = this;
      setTimeout(function () {
        for (var i = 0; i < batch; i++) {
          if (index >= vs.length) {
            break;
          }
          const v = vs[index];
          const p = self[v.form.shape](v);
          index += 1;
        }
        if (index < vs.length) {
          self.renderGradually(center, ss, fi, callback, tick, batch, vs, index);
        } else {
          self.rendering = false;
          if (callback != null) {
            callback();
          }
        }
      }, tick);
    }
  }

  var retroscapes = {
    // Exported classes.
    "FeedCell": FeedCell,
    "FeedRegion": FeedRegion,
    "Feed": Feed,
    "Vector": Vector,
    "Color": Color,
    "Surface": Surface,
    "Surfaces": Surfaces,
    "Concept": Concept,
    "Instance": Instance,
    "Scape": Scape,
    "Geometry": Geometry,
    "Effect": Effect,
    "Cache": Cache,
    "Canvas": Canvas,
    "Render": Render,

    // Library metadata.
    "version": "0.1.0"
  };

  global.retroscapes = retroscapes;
})(this);
