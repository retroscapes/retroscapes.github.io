class Splash extends Sample { // eslint-disable-line no-unused-vars, no-undef
  /* eslint-disable no-undef */
  /* Example application demonstrating use of the retroscapes library
     to render the interactive splash landscape.
   */
  constructor (canvasElementId) {
    super(canvasElementId);

    this.night = false;
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

    this._navigation(xLen, yLen, canvasRect);
  }

  _navigation (xLen, yLen, canvasRect) {
    // Useful terms for the calculations below.
    const canvasWidthHalf = canvasRect.width / 2;
    const canvasMidX = canvasRect.left + canvasWidthHalf;

    // Shift the navigation elements (logo and links) based on the
    // position of the rendered landscape.
    const logo = document.getElementById("logo");
    const links = document.getElementById("links");
    if (window.innerWidth > 900) {
      const logoTop = (canvasRect.height / 2) + 54;
      const logoLeft = canvasMidX - (xLen / 2) - 28;
      const linksTop = logoTop;
      const linksLeft = canvasRect.right - canvasWidthHalf + (0.985 * yLen) - 125;

      logo.style.position = 'absolute';
      logo.style.left = logoLeft + 'px';
      logo.style.top = logoTop + 'px';
      logo.style.fontSize = '80px';
      logo.style.transform = 'rotate(26.5deg) skew(25deg)';
      logo.style.filter = (
        this.night
          ? 'drop-shadow(4px -3px 1px #FFFFFF)'
          : 'drop-shadow(4px -3px 0px #000000)'
      );
      logo.style.color = this.night ? '#DBAF48' : '#FCCA56';

      links.style.position = 'absolute';
      links.style.float = 'right';
      links.style.left = linksLeft + 'px';
      links.style.top = linksTop + 'px';
      links.style.fontSize = '42px';
      links.style.fontWeight = 'bold';
      links.style.transform = 'rotate(-28deg) skew(-28deg)';
      links.style.filter = (
        this.night
          ? 'drop-shadow(-4px -3px 1px #FFFFFF)'
          : 'drop-shadow(-4px -3px 0px #000000)'
      );
      const es = document.getElementsByClassName("button");
      for (let i = 0; i < es.length; i++) {
        if (this.night) {
          es[i].classList.add("night-a");
          es[i].classList.remove("day-a");
        } else {
          es[i].classList.add("day-a");
          es[i].classList.remove("night-a");
        }
      }
    } else {
      const logoTop = canvasRect.height - 285 + 0.5 * yLen;
      const logoLeft = canvasRect.left + (canvasRect.width / 2) - 110 - 20;
      const linksTop = logoTop + 65;
      const linksLeft = canvasRect.left + (canvasRect.width / 2) + 55 - 20;

      logo.style.position = 'absolute';
      logo.style.float = 'none';
      logo.style.left = logoLeft + 'px';
      logo.style.top = logoTop + 'px';
      logo.style.fontSize = '60px';
      logo.style.fontWeight = 'normal';
      logo.style.transform = 'none';
      logo.style.filter = (
        this.night
          ? 'drop-shadow(2px 2px 1px #555555)'
          : 'drop-shadow(2px 2px 1px #000000)'
      );

      links.style.position = 'absolute';
      links.style.float = 'none';
      links.style.left = linksLeft + 'px';
      links.style.top = linksTop + 'px';
      links.style.fontSize = '26px';
      links.style.fontWeight = 'normal';
      links.style.transform = 'none';
      links.style.filter = (
        this.night
          ? 'drop-shadow(1px 1px 1px #888888)'
          : 'drop-shadow(1px 2px 1px #000000)'
      );
      const es = document.getElementsByClassName("button");
      for (let i = 0; i < es.length; i++) {
        if (this.night) {
          es[i].classList.add("night-a");
          es[i].classList.remove("day-a");
        } else {
          es[i].classList.add("day-a");
          es[i].classList.remove("night-a");
        }
      }
    }
    logo.style.display = 'block';
    links.style.display = 'block';
  }

  setUrl () {
    const c = this.canvas.projection().getCenter();
    window.location.search = "?x=" + Math.floor(c.x) + "&y=" + Math.floor(c.y);
  }

  toggleNight () {
    const switch_ = document.getElementById("switch");
    this.night = !this.night;
    if (this.night) {
      switch_.classList.remove("far");
      switch_.classList.remove("fa-moon");
      switch_.classList.add("fas");
      switch_.classList.add("fa-sun");
      document.body.style.background = "#000000";
      document.getElementById(this.canvasElementId).style.background = "#000000";
      this.render.background = new retroscapes.Color([0, 0, 0]);
      this.render.light = { "top": -15, "left": 10, "right": 0 };
      document.getElementById("footer").style.boxShadow = "0px 0px 15px #777777";
    } else {
      switch_.classList.remove("fas");
      switch_.classList.remove("fa-sun");
      switch_.classList.add("far");
      switch_.classList.add("fa-moon");
      document.body.style.background = "#FFFFFF";
      document.getElementById(this.canvasElementId).style.background = "#FFFFFF";
      this.render.background = new retroscapes.Color([255, 255, 255]);
      this.render.light = { "top": 20, "left": -15, "right": -60 };
      document.getElementById("footer").style.boxShadow = "0px 0px 15px #CCCCCC";
    }
    this.render.resetCache();
    this.scapes = this._build();
    this._redraw();
  }

  _build () {
    // Concise synonyms for classes from the retroscapes library.
    const Color = retroscapes.Color;
    const Concept = retroscapes.Concept;
    const Concepts = retroscapes.Concepts;

    let blue = new Color([30, 90, 195]);
    let cyan = new Color([130, 150, 240]);
    let ecru = new Color([155, 165, 120]);
    let sage = new Color("#8ABD91");
    let fern = new Color("#8ABD91").darker(6);
    let clay = new Color([115, 90, 93]);
    let gray = new Color([155, 145, 155]);
    let salt = new Color(gray).lighter(50);
    const coal = new Color([0, 0, 0]);
    const ruby = new Color([255, 0, 0]);
    let bulb = null;

    if (this.night) {
      blue = new Color(blue).darker(35);
      cyan = new Color(cyan).darker(50);
      ecru = new Color(ecru).darker(100);
      sage = new Color(sage).darker(40);
      fern = new Color(fern).darker(55);
      clay = new Color(clay).darker(60);
      gray = new Color(gray).darker(60);
      salt = new Color(salt).darker(50);
      bulb = new Color([252, 227, 0]);
    }

    const block = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": ecru.lighter(50) }
      },
      "coordinates": { "z": 0, "o": 0 }
    });

    const ground = new Concept({
      "dimensions": { "height": 0 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": ecru.lighter(50) }
      },
      "coordinates": { "z": 0, "o": 0 }
    });

    const building = new Concepts({
      "base": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": {
          "mesial": {
            "face": {},
            "edge": { "color": coal, "lineWidth": 0.5, "lineDash": [] }
          },
          "lateral": {
            "face": {},
            "edge": { "color": coal, "lineWidth": 0.5, "lineDash": [] }
          },
          "top": {
            "face": {},
            "edge": { "color": coal, "lineWidth": 0.5, "lineDash": [] }
          }
        },
        "coordinates": { "z": 1, "o": 1 }
      }),
      "tower": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": {
          "mesial": {
            "face": {},
            "edge": { "color": coal, "lineWidth": 0.5, "lineDash": [] }
          },
          "lateral": {
            "face": {},
            "edge": { "color": coal, "lineWidth": 0.5, "lineDash": [] }
          },
          "top": {
            "face": {},
            "edge": { "color": coal, "lineWidth": 0.5, "lineDash": [] }
          }
        },
        "coordinates": { "z": 0, "o": 2 }
      }),
      "antenna": new Concept({
        "dimensions": { "height": 0.6 },
        "form": { "shape": "prism" },
        "look": {
          "mesial": {
            "face": { "color": gray },
            "edge": { "color": coal, "lineWidth": 0.2, "lineDash": [] }
          },
          "lateral": {
            "face": { "color": gray },
            "edge": { "color": coal, "lineWidth": 0.2, "lineDash": [] }
          },
          "top": {
            "face": { "color": ruby, "luminosity": 1 },
            "edge": { "color": ruby, "lineWidth": 0.5, "lineDash": [], "luminosity": 1 }
          }
        },
        "coordinates": { "z": 0, "o": 3 },
        "scales": { "x": 0.1, "y": 0.1, "z": 1 }
      })
    });

    const shore = new Concept({
      "dimensions": { "height": 0.2 },
      "form": { "shape": "prism" },
      "look": {
        "mesial": { "face": { "color": ecru } },
        "lateral": { "face": { "color": ecru } },
        "top": {
          "face": { "color": ecru.lighter(50), "within": "15%" },
          "edge": { "color": ecru.lighter(30), "lineWidth": 1.05, "lineDash": [] }
        }
      },
      "coordinates": { "z": 1, "o": 0 }
    });

    const greenery = new Concept({
      "dimensions": {
        "height": 0, "quantity": 10, "radius": 0.4, "spread": 0.8, "positional": true
      },
      "form": { "shape": "cloud", "particle": "point" },
      "look": {
        "face": { "color": new Color([0, 0, 0, 0]) },
        "edge": { "color": fern, "lineWidth": 1, "lineDash": [] },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const ocean = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": blue, "within": "10%" }
      },
      "coordinates": { "z": 0, "o": 0 },
      "scales": { "x": 1, "y": 1, "z": 1 }
    });

    const foam = new Concept({
      "dimensions": {
        "height": 0, "quantity": 2, "radius": 0.5, "spread": 0.6, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color([0, 0, 0, 0]) },
        "edge": {
          "color": new Color(cyan),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const populated = new retroscapes.Anchors(8, 0.02, [2, 2]);
    const verdant = new retroscapes.Anchors(8, 0.02, [2, 2]);

    class Example extends retroscapes.Scape {
      render () {
        return ["world"];
      }

      world (cs, fr) {
        cs = this.coordinates(cs);
        if (this.isCity(fr)) {
          return this.isCityIsolated(fr) ? this.shore(cs, fr) : this.city(cs, fr);
        } else {
          return this.isShore(fr) ? this.shore(cs, fr) : this.ocean(cs, fr);
        }
      }

      city (cs, fr) {
        const fc = fr.center();

        const ground_ = ground.instance();
        ground_.$.coordinates.update(cs);
        ground_.$.feed = fc;
        ground_.setFaceColor_(
          new Color(ecru.lighter(50)).nearby(16, fc.randReals(3)).darker(20)
        );

        const building_ = building.instance();
        building_.$.coordinates = cs;

        building_.base.$.feed = fr.up();
        const baseHeight = 0.2 + 0.3 * (fc.randReal([cs.x + 3 * cs.y, 7 * cs.y]));
        const offsetsBase = {
          "x": -1 + (2 * fc.randReal([cs.x])),
          "y": -1 + (2 * fc.randReal([cs.y]))
        };
        building_.base.$.coordinates.z = 1;
        building_.base.$.scales.update({
          "x": 1 - (0.4 * fc.randReal([cs.x])),
          "y": 1 - (0.4 * fc.randReal([cs.y]))
        });
        building_.base.$.offsets.update(offsetsBase);

        if (populated.anchored(cs)) {
          ground_.$.dimensions.height = 1;
          building_.base.$.dimensions.height = baseHeight;
          building_.base.setFaceColor_(
            new Color(
              [gray, salt][
                fc.randReal([cs.y, cs.x]) > 0.3 ? 0 : 1
              ]
            ).nearby(5, fr.left().randReals(3))
          );

          building_.tower.$.feed = fr.down();
          const hMax =
            (!this.isCityIsolated(fr))
              ? (this.isCitySurrounded(fr) ? 3 : 1)
              : 1;
          const towerHeight = 1 + (hMax * (fc.randReal([cs.x, 2 * cs.y])));
          building_.tower.$.dimensions.height = towerHeight;

          const scaleBound = 0.7 * fc.randReal([cs.x]);
          building_.tower.$.coordinates.z = 1 + baseHeight;
          building_.tower.$.scales.update({
            "x": 1 - 0.1 - (scaleBound),
            "y": 1 - 0.1 - (
              ((1 - (scaleBound / 0.7)) * 0.5) + (0.2 * fc.randReal([cs.y]))
            )
          });
          building_.tower.$.offsets.update({
            "x": 0.7 * offsetsBase.x,
            "y": 0.7 * offsetsBase.y
          });
          building_.tower.setFaceColor_(
            new Color(building_.base.$.look.top.face.color).nearby(
              8, fr.right().randReals(3)
            )
          );
          if (
            Math.abs(offsetsBase.x) < 0.4 &&
            Math.abs(offsetsBase.y) < 0.4 &&
            towerHeight > 1
          ) {
            building_.antenna.$.dimensions.height = 0.2 * towerHeight;
            building_.antenna.$.coordinates.z = 1 + baseHeight + towerHeight;
          } else {
            delete building_.antenna;
          }

          const hasLine = fc.randReal([cs.x, 2 * cs.y]);
          if (hasLine < 0.5) {
            building_.tower.$.look.mesial.setLine({
              "color": (
                bulb == null
                  ? new Color(
                    building_.tower.$.look.top.face.color
                  ).lighterOrDarker(hasLine < 0.25 ? -30 : -60)
                  : bulb
              ),
              "lineWidth": 1,
              "quantity": 2 + (
                (hasLine > 0.2)
                  ? Math.round(3.5 * hasLine)
                  : building_.tower.$.dimensions.height * 5
              ),
              "margin": 0.1,
              "orientation": ((hasLine > 0.2) ? "vertical" : "horizontal")
            });
          }
        } else {
          ground_.$.dimensions.height = 1.2;

          const baseColor =
            new Color(clay).lighter(35).nearby(15, fr.up().randReals(3));
          const spot = {
            "color": (
              bulb == null
                ? new Color(baseColor).lighterOrDarker(
                  fc.randReal([cs.y, cs.x]) > 0.5 ? 50 : -50
                )
                : bulb
            ),
            "size": 1.2,
            "ratio": 0.75,
            "quantity": 20 + (20 * fc.randReal([cs.y, cs.x])),
            "arrangement": "regular",
            "probability": 0.8
          };
          building_.base.$.coordinates.z = 1.2;
          building_.base.$.dimensions.height = baseHeight + 0.25;
          building_.base.setFaceColor_(baseColor);
          building_.base.$.look.mesial.setSpot(spot);
          building_.base.$.look.lateral.setSpot(spot);
          building_.base.$.scales.update({
            "x": 0.9 * building_.base.$.scales.x * building_.tower.$.scales.x,
            "y": 0.9 * building_.base.$.scales.y * building_.tower.$.scales.y
          });

          delete building_.tower;
          delete building_.antenna;
        }

        return [ground_, building_];
      }

      shore (cs, fr) {
        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fr.center();
        block_.setFaceColor_(
          new Color(ecru).lighter(50).nearby(
            16, fr.center().randReals(3)
          ).darker(20)
        );

        const shore_ = shore.instance();
        shore_.$.coordinates.update(cs);
        shore_.$.feed = fr.center();
        let instances = [];
        if (fr.countAround(this.isCity) <= 1 && fr.randReal([cs.y, cs.x]) > 0.1) {
          shore_.$.look.top.setFaceColor_(new Color(sage));
          shore_.$.look.top.setEdgeColor(new Color(sage).darker(5));

          if (verdant.anchored(cs)) {
            const greenery_ = greenery.instance();
            greenery_.$.coordinates.update(cs);
            greenery_.$.feed = fr.center();
            instances = [block_, shore_, greenery_];
          } else {
            instances = [block_, shore_];
          }
        } else {
          shore_.$.look.top.setPattern({ "rows": 2, "columns": 2 });
          instances = [block_, shore_];
        }

        return instances;
      }

      ocean (cs, fr) {
        const ocean_ = ocean.instance();
        ocean_.$.coordinates.update(cs);
        ocean_.$.feed = fr.center();
        ocean_.setFaceColor_(
          new Color(ocean_.$.look.face.color).nearby(12, fr.center().randReals(3))
        );

        if (this.isOceanDeep(fr)) {
          const foam_ = foam.instance();
          foam_.$.coordinates.update(cs);
          foam_.$.feed = fr.center();
          return [ocean_, foam_];
        } else {
          return [ocean_];
        }
      }

      isCity (fx) {
        return fx.randBoolWithProb(0.11);
      }

      isCityIsolated (fr) {
        return this.isCity(fr) && fr.noneOnAxes(this.isCity);
      }

      isCitySurrounded (fr) {
        return this.isCity(fr) && fr.allOnAxes(this.isCity);
      }

      isShore (fr) {
        return !this.isCity(fr) && fr.countOnRing(this.isCity) > 0;
      }

      isOceanDeep (fr) {
        return (
          fr.relative(1, 1).randBoolWithProb(0.3) &&
          fr.countAround(this.isCity) === 0
        );
      }
    }

    return new Example();
  }
}
