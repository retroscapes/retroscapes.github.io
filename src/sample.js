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

  _geometry () {
    return new retroscapes.Geometry({
      "orientation": { "tilt": 30 },
      "unit": 30
    });
  }

  _determineCenter () {
    const ps = new URLSearchParams(window.location.search);
    const x = ps.get("x");
    const y = ps.get("y");
    this.center = {
      "x": (x != null) ? parseInt(x) : Math.floor(Math.random() * 10000),
      "y": (y != null) ? parseInt(y) : Math.floor(Math.random() * 10000)
    };
    return this.center;
  }

  _getProjection () {
    return this.projection;
  }

  _setProjection (projection) {
    this.projection = projection;
    this.render.setProjection(projection);
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
      "light": { "top": 20, "left": -15, "right": -60 },
      "effects": [
        new retroscapes.EffectPlateSquare(
          function () { return self._getProjection(); }
        )
      ],
      "cache": true,
      "precedence": false
    });

    this._draw();
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

  _alignment (vps) {
    // Determine the bounds of the rendered blocks.
    const bounds = this._getPlateBounds();

    // Determine the dimensinons of the canvas element.
    const canvasElement = document.getElementById(this.canvasElementId);
    canvasElement.style.marginLeft = '0px';
    canvasElement.style.marginTop = '0px';
    const canvasRect = canvasElement.getBoundingClientRect();

    // Useful terms for the calculations below.
    const xLen = bounds.xMax - bounds.xMin;
    const yLen = bounds.yMax - bounds.yMin;

    // Shift the canvas element to accommodate for the extent to which
    // the rendered landscape deviates from the exact center of the canvas.
    const xMid = bounds.xMin + (0.5 * xLen);
    const xOffset = 2 * ((0.5 * canvasRect.width) - xMid);
    const yMid = bounds.yMin + (0.5 * yLen);
    const yOffset = (0.5 * canvasRect.height) - yMid;
    canvasElement.style.marginLeft = xOffset + 'px';
    canvasElement.style.marginTop = yOffset + 'px';
  }

  reinitialize () {
    const center = this._getProjection().getCenter();
    this._setProjection(this._geometry());
    const vps = this.render.render(center, this.scapes, this.feed);
    this._alignment(vps);
  }

  _draw () {
    const center = this._determineCenter();
    document.getElementById(this.canvasElementId).style.opacity = 0;
    document.getElementById('logo').style.opacity = 0;
    document.getElementById('links').style.opacity = 0;
    const vps = this.render.render(center, this.scapes, this.feed);
    this._alignment(vps);
    document.getElementById(this.canvasElementId).style.opacity = 1;
    const self = this;
    this.render.renderGradually(
      center,
      this.scapes,
      this.feed,
      function () {
        document.getElementById("logo").style.opacity = 1;
        document.getElementById("links").style.opacity = 1;
        self.reinitialize();
      }
    );
  }

  _redraw (center) {
    center = (center == null) ? this._getProjection().getCenter() : center;
    this._setProjection(this._geometry());
    const c = (center == null) ? this._determineCenter() : center;
    const vps = this.render.render(c, this.scapes, this.feed);
    this._alignment(vps);
    this.render.render(center, this.scapes, this.feed);
    this.reinitialize();
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
