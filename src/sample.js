class Sample { // eslint-disable-line no-unused-vars
  /* eslint-disable no-undef */
  /* Base/template for sample application demonstrating use of the
     retroscapes library.
   */
  constructor (canvasElementId) {
    this.canvasElementId = canvasElementId;

    this.feed = new retroscapes.Feed({
      "quantity": 32, "d": 8, "pAnchor": 0.03, "pTethered": 0.9
    });
    this.center = { "x": null, "y": null };
    this.projection = null;
  }

  _effects () {
    return [new retroscapes.EffectPlateSquare(1, { "x": -3, "y": -3 })];
  }

  _light () {
    return { "top": 20, "left": -15, "right": -60 };
  }

  _geometry () {
    return new retroscapes.Geometry({
      "orientation": { "tilt": 30 },
      "unit": 30
    });
  }

  _determineCenter () {
    this.center = this.canvas.projection().alignCanvasCoordinatesToGrid({
      "x": Math.floor(Math.random() * 10000),
      "y": Math.floor(Math.random() * 10000)
    });
    return this.center;
  }

  _getProjection () {
    return this.projection;
  }

  _setProjection (projection) {
    this.projection = projection;
    this.render.setProjection(projection);
  }

  _getPlateBounds () {
    const vps = this.render.rendered;
    const bounds = { "xMin": null, "xMax": null, "yMin": null, "yMax": null };
    for (let i = 0; i < vps.length; i++) {
      if (vps[i].v.coordinates.z === 0) {
        const x = vps[i].p.coordinates.x;
        const y = vps[i].p.coordinates.y;
        bounds.xMin = (bounds.xMin == null) ? x : Math.min(x, bounds.xMin);
        bounds.yMin = (bounds.yMin == null) ? y : Math.min(y, bounds.yMin);
        bounds.xMax = (bounds.xMax == null) ? x : Math.max(x, bounds.xMax);
        bounds.yMax = (bounds.yMax == null) ? y : Math.max(y, bounds.yMax);
      }
    }
    return bounds;
  }

  _getPlateCenter () {
    const bounds = this._getPlateBounds();
    const proj = this.projection;
    return {
      "x": (bounds.xMin + bounds.xMax) / 2,
      "y": ((bounds.yMin + bounds.yMax) / 2) - (0.75 * (proj.uY + proj.uZ))
    };
  }

  initialize () {
    this.scapes = this._build();
    this.projection = this._geometry();
    const self = this;
    this.canvas = new retroscapes.Canvas(
      document.getElementById(this.canvasElementId),
      function () { return self._getProjection(); },
      function (center) { self._redraw(center); },
      [
        new retroscapes.InteractionDrag(),
        new retroscapes.InteractionNudge(
          function () { return self._getPlateCenter(); }
        )
      ]
    );

    this.render = new retroscapes.Render({
      "canvas": document.getElementById(this.canvasElementId),
      "feed": this.feed,
      "projection": this._getProjection(),
      "background": new retroscapes.Color([255, 255, 255]),
      "light": this._light(),
      "effects": this._effects(),
      "cache": true,
      "precedence": false
    });

    this._draw();
  }

  reinitialize () {
    const center = this._getProjection().getCenter();
    this._setProjection(this._geometry());
    this.render.render(center, this.scapes, this.feed);
  }

  _draw () {
    const center = this._determineCenter();
    this.render.render(center, this.scapes, this.feed);
  }

  _redraw (center) {
    center = (center == null) ? this._getProjection().getCenter() : center;
    this._setProjection(this._geometry());
    this.render.render(center, this.scapes, this.feed);
  }

  _build () {
    class Example extends retroscapes.Scape {
      render () {
        return ["world"];
      }

      world (cs, fr) {
        return [];
      }
    }

    return new Example();
  }
}
