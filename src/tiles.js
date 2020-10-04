class Tile extends Sample { // eslint-disable-line no-unused-vars,no-undef
  /* eslint-disable no-undef */
  /* Base/template for a small-scale sample application.
   */

  _effects () {
    return [new retroscapes.EffectPlateSquare(1, { "x": -4, "y": -4 })];
  }

  _geometry () {
    return new retroscapes.Geometry({
      "orientation": { "tilt": 30 },
      "unit": 22
    });
  }

  _determineCenter () {
    this.center = this.canvas.projection().alignCanvasCoordinatesToGrid({
      "x": Math.floor(Math.random() * 88),
      "y": Math.floor(Math.random() * 88)
    });
    return this.center;
  }
}

class TileOne extends Tile { // eslint-disable-line no-unused-vars
  /* eslint-disable no-undef */
  /* Example application demonstrating use of the retroscapes library
     to render the interactive splash landscape.
   */

  _build () {
    // Concise synonyms for classes from the retroscapes library.
    const Color = retroscapes.Color;
    const Concept = retroscapes.Concept;
    const Concepts = retroscapes.Concepts;

    const cyan = new Color([110, 130, 255]);
    const bark = new Color("#BF8040");
    const ecru = new Color([155, 165, 120]);
    const sage = new Color("#7EC850");
    const gray = new Color([155, 145, 155]);
    const ruby = new Color([255, 0, 0]);

    const block = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": ecru.lighter(50) }
      },
      "coordinates": { "z": 0, "o": 0 }
    });

    const river = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": new Color(cyan, { "within": "10%" }) }
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
          "color": new Color(cyan).lighter(50),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const ground = new Concept({
      "dimensions": { "height": 0 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": sage.lighter(10) }
      },
      "coordinates": { "z": 1, "o": 0 }
    });

    const tree = new Concepts({
      "trunk": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": { "face": { "color": bark } },
        "coordinates": { "z": 1, "o": 1 }
      }),
      "leaves": new Concept({
        "dimensions": {
          "height": 1, "quantity": 16, "radius": 1.2, "spread": 0.5, "positional": true
        },
        "form": { "shape": "cloud", "particle": "bubble" },
        "look": {
          "face": { "color": sage.lighter(20) },
          "edge": { "color": sage.darker(40), "lineWidth": 0.4, "lineDash": [] }
        },
        "coordinates": { "z": 1, "o": 2 }
      })
    });

    const uncultivated = new Concept({
      "dimensions": { "height": 0.2 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": ecru }
      },
      "coordinates": { "z": 1, "o": 0 }
    });

    const farmland = new Concept({
      "dimensions": { "height": 0.2 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": sage },
        "line": {
          "color": sage.darker(20),
          "lineWidth": 1,
          "quantity": 3,
          "margin": 0.1,
          "orientation": "vertical"
        }
      },
      "coordinates": { "z": 1, "o": 0 }
    });

    const farmhouse = new Concept({
      "dimensions": { "height": 0.3 },
      "form": { "shape": "prism" },
      "look": {
        "mesial": {
          "face": { "color": bark }
        },
        "lateral": {
          "face": { "color": bark }
        },
        "top": {
          "face": { "color": ruby.darker(40) }
        }
      },
      "coordinates": { "z": 1.2, "o": 0 },
      "scales": { "x": 0.4, "y": 0.4, "z": 1 },
      "offsets": { "x": 0, "y": 0, "z": 0 }
    });

    const forest = new retroscapes.Anchors(23, 0.0005, [1, 1]);
    const cultivated = new retroscapes.Anchors(64, 0.002, [2, 2]);
    const inhabited = new retroscapes.Anchors(17, 0.0003, [1, 1]);

    class Example extends retroscapes.Scape {
      render () {
        return ["world"];
      }

      world (cs, fr) {
        cs = this.coordinates(cs);
        if (this.isRiver(cs, fr)) {
          return this.river(cs, fr);
        } else {
          if (forest.anchored(cs) && (!cultivated.anchored(cs))) {
            return this.forest(cs, fr);
          } else {
            return this.land(cs, fr);
          }
        }
      }

      land (cs, fr) {
        const fc = fr.center();

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fc;
        block_.setFaceColor_(
          new Color(block_.$.look.face.color).nearby(16, fc.randReals(3))
        );

        if (cultivated.anchored(cs)) {
          const farmland_ = farmland.instance();
          farmland_.$.coordinates.update(cs);
          farmland_.$.feed = fc;
          farmland_.setFaceColor_(
            new Color(farmland_.$.look.face.color).nearby(16, fc.randReals(3))
          );
          farmland_.$.look.line.orientation =
            fc.randReal([cs.x, cs.y]) > 0.5
              ? "horizontal"
              : "vertical";

          if (this.isFarmHouse(cs, fr)) {
            const farmhouse_ = farmhouse.instance();
            farmhouse_.$.coordinates.update(cs);
            farmhouse_.$.feed = fc;
            farmhouse_.$.look.mesial.color = (
              new Color(farmhouse_.$.look.mesial.face.color).nearby(30, fc.randReals(3))
            );
            farmhouse_.$.look.lateral.color = (
              new Color(farmhouse_.$.look.lateral.face.color).nearby(30, fc.randReals(3))
            );
            farmhouse_.$.look.top.face.color = (
              new Color(
                fc.randReal([cs.x, cs.y]) < 0.5 ? ruby : gray
              ).darker(40).nearby(30, fc.randReals(3))
            );
            farmhouse_.$.scales.x = 0.3 + (0.3 * fr.up().randReal([cs.y]));
            farmhouse_.$.scales.y = 0.3 + (0.3 * fr.right().randReal([cs.x]));
            farmhouse_.$.offsets.x = -1 + (2 * fr.left().randReal([cs.y]));
            farmhouse_.$.offsets.y = -1 + (2 * fr.left().randReal([cs.x]));
            return [block_, farmland_, farmhouse_];
          } else {
            return [block_, farmland_];
          }
        } else {
          const uncultivated_ = uncultivated.instance();
          uncultivated_.$.coordinates.update(cs);
          uncultivated_.$.feed = fc;
          uncultivated_.setFaceColor_(new Color(block_.$.look.face.color));
          return [block_, uncultivated_];
        }
      }

      forest (cs, fr) {
        const fc = fr.center();

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fc;
        block_.setFaceColor_(
          new Color(block_.$.look.face.color).nearby(16, fc.randReals(3)).darker(20)
        );
        block_.$.dimensions.height = 1.2;

        const ground_ = ground.instance();
        ground_.$.coordinates.update(cs);
        ground_.$.feed = fc;
        ground_.$.coordinates.z = 1.2;

        if (this.isTree(cs, fr)) {
          ground_.setSpot({
            "color": new Color(sage).darker(60),
            "size": 1.2,
            "ratio": 0.75,
            "quantity": 20 + (20 * fc.randReal([cs.y, cs.x])),
            "probability": 0.8
          });

          const tree_ = tree.instance();
          tree_.$.coordinates = cs;
          tree_.trunk.$.feed = fr.up();
          const treeSize = fc.randReal([cs.x + 3 * cs.y, 7 * cs.y]);
          const baseHeight = 0.6 + 0.5 * treeSize;
          const offsetsBase = {
            "x": -0.1 + (0.2 * fc.randReal([cs.x])),
            "y": -0.1 + (0.2 * fc.randReal([cs.y]))
          };
          const trunkScale = 0.1 + (0.05 * fc.randReal([cs.x]));
          tree_.trunk.$.coordinates.z = 1.2;
          tree_.trunk.$.scales.update({ "x": trunkScale, "y": trunkScale });
          tree_.trunk.$.offsets.update(offsetsBase);
          tree_.trunk.$.dimensions.height = baseHeight - 0.1;
          tree_.trunk.setFaceColor_(
            new Color(tree_.trunk.$.look.face.color).nearby(5, fr.left().randReals(3))
          );
          tree_.leaves.$.feed = fr.down();
          const towerHeight = 0.6 + 0.7 * fc.randReal([cs.x, 2 * cs.y]);
          tree_.leaves.$.dimensions.height = towerHeight;
          tree_.leaves.$.dimensions.radius = 0.6 + (0.6 * treeSize);
          tree_.leaves.setFaceColor_(
            new Color(tree_.leaves.$.look.face.color).nearby(
              20, fr.center().randReals(3)
            )
          );
          tree_.leaves.$.coordinates.z = baseHeight + 0.6;
          tree_.leaves.$.scales.update({
            "x": 0.7 + (0.3 * fc.randReal([cs.x])),
            "y": 0.7 + (0.3 * fc.randReal([cs.y]))
          });
          tree_.leaves.$.offsets.update({
            "x": 0.7 * offsetsBase.x,
            "y": 0.7 * offsetsBase.y
          });

          return [block_, ground_, tree_];
        } else {
          return [block_, ground_];
        }
      }

      river (cs, fr) {
        const river_ = river.instance();
        river_.$.coordinates.update(cs);
        river_.$.feed = fr.center();
        river_.setFaceColor_(
          new Color(river_.$.look.face.color).nearby(12, fr.center().randReals(3))
        );

        if (this.isRiverDeep(fr)) {
          const foam_ = foam.instance();
          foam_.$.coordinates.update(cs);
          foam_.$.feed = fr.center();
          return [river_, foam_];
        } else {
          return [river_];
        }
      }

      isNearRiver (cs) {
        return Math.abs(cs.y) < 7;
      }

      isRiver (cs, fr) {
        return Math.abs(cs.y) < 2 + (3 * fr.center().randReal([cs.x, cs.y]));
      }

      isRiverDeep (fr) {
        return (
          fr.relative(1, 1).randBoolWithProb(0.3) &&
          fr.countAround(this.isForest) === 0
        );
      }

      isForest (fx) {
        return fx.randBoolWithProb(0.11);
      }

      isTree (cs, fr) {
        return fr.center().randReal([cs.x, cs.y]) > 0.1;
      }

      isFarmHouse (cs, fr) {
        return (
          (fr.center().randReal([cs.x, cs.y]) < 0.04) ||
          (this.isNearRiver(cs) && inhabited.anchored(cs))
        )
      }
    }

    return new Example();
  }
}

class TileTwo extends Tile { // eslint-disable-line no-unused-vars
  /* eslint-disable no-undef */
  /* Example application demonstrating use of the retroscapes library
     to render the interactive splash landscape.
   */

  _light () {
    return { "top": 10, "left": -10, "right": -30 };
  }

  _geometry () {
    return new retroscapes.Geometry({
      "orientation": { "tilt": 30 },
      "unit": 22
    });
  }

  _build () {
    // Concise synonyms for classes from the retroscapes library.
    const Color = retroscapes.Color;
    const Concept = retroscapes.Concept;
    const Concepts = retroscapes.Concepts;

    const salt = new Color([255, 255, 255]);
    const gray = new Color([230, 230, 230]);
    const coal = new Color([0, 0, 0]);
    const ruby = new Color([255, 0, 80]);
    const cyan = new Color([230, 255, 255]);
    const bulb = new Color([255, 255, 0]);
    const blue = new Color([0, 0, 255]);
    const sage = new Color([0, 255, 0]);

    const block = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": salt },
        "edge": { "color": salt.darker(10), "lineWidth": 0.5, "lineDash": [] }
      },
      "coordinates": { "z": 0, "o": 0 }
    });

    const building = new Concepts({
      "base": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": {
          "face": {},
          "edge": { "color": coal.lighter(65), "lineWidth": 0.5, "lineDash": [] }
        },
        "coordinates": { "z": 1.2, "o": 1 }
      }),
      "tower": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": {
          "face": { "color": new Color(gray, { "within": "30%" }) },
          "edge": { "color": coal.lighter(65), "lineWidth": 0.5, "lineDash": [] }
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
        "mesial": {
          "face": { "color": new Color(coal.lighter(60), { "within": "5%" }) },
          "edge": { "color": coal.lighter(60), "lineWidth": 0.5, "lineDash": [] }
        },
        "lateral": {
          "face": { "color": new Color(coal.lighter(60), { "within": "5%" }) },
          "edge": { "color": coal.lighter(60), "lineWidth": 0.5, "lineDash": [] }
        },
        "top": {
          "face": { "color": new Color(salt.darker(5), { "within": "8%" }) },
          "edge": { "color": salt, "lineWidth": 0.5, "lineDash": [] }
        }
      },
      "coordinates": { "z": 1, "o": 0 }
    });

    const ocean = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": cyan },
        "edge": { "color": cyan.darker(20), "lineWidth": 0.4, "lineDash": [] }
      },
      "coordinates": { "z": 0, "o": 0 },
      "scales": { "x": 1, "y": 1, "z": 1 }
    });

    const populated = new retroscapes.Anchors(8, 0.02, [2, 2]);
    const wireframe = new retroscapes.Anchors(16, 0.002, [2, 1]);

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

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fc;

        const ground_ = shore.instance();
        ground_.$.coordinates.update(cs);
        ground_.$.feed = fc;

        const building_ = building.instance();
        building_.$.coordinates = cs;

        building_.base.$.feed = fr.up();
        const baseHeight = 0.2 + 0.3 * (fc.randReal([cs.x + 3 * cs.y, 7 * cs.y]));
        const offsetsBase = {
          "x": -0.7 + (1.4 * fc.randReal([cs.x])),
          "y": -0.7 + (1.4 * fc.randReal([cs.y]))
        };
        building_.base.$.coordinates.z = 1.21;
        building_.base.$.scales.update({
          "x": 1 - (0.4 * fc.randReal([cs.x])),
          "y": 1 - (0.4 * fc.randReal([cs.y]))
        });
        building_.base.$.offsets.update(offsetsBase);

        if (populated.anchored(cs)) {
          building_.base.$.dimensions.height = baseHeight;
          building_.base.setFaceColor_(
            new Color(
              [gray, salt][
                fc.randReal([cs.y, cs.x]) > 0.3 ? 0 : 1
              ]
            )
          );

          building_.tower.$.feed = fr.down();
          const hMax =
            (!this.isCityIsolated(fr))
              ? (this.isCitySurrounded(fr) ? 3 : 1)
              : 1;
          const towerHeight = 1 + (hMax * (fc.randReal([cs.x, 2 * cs.y])));
          building_.tower.$.dimensions.height = towerHeight;

          const scaleBound = 0.7 * fc.randReal([cs.x]);
          building_.tower.$.coordinates.z =
            building_.base.$.coordinates.z + baseHeight;
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
            new Color(building_.base.$.look.face.color)
          );
          if (Math.abs(offsetsBase.x) < 0.6 &&
              Math.abs(offsetsBase.y) < 0.6 &&
              towerHeight > 1
          ) {
            building_.antenna.$.dimensions.height = 0.2 * towerHeight;
            building_.antenna.$.coordinates.z = 1.21 + baseHeight + towerHeight;
            const r = fc.randReal([cs.x, cs.y]);
            const antennaColor =
              (r < 0.33)
                ? new Color(bulb).lighter(40)
                : ((r < 0.66) ? new Color(sage) : new Color(blue));
            building_.antenna.$.look.top.face.color = new Color(antennaColor);
            building_.antenna.$.look.top.edge.color = new Color(antennaColor);
            if (fc.randReal([cs.y * 3, cs.x * 2]) < 0.15) {
              building_.tower.setEdgeColor_(new Color(antennaColor));
              building_.tower.setFaceColor_(new Color(gray).darker(20));
              building_.tower.$.look.edge.lineWidth = 0.6;
              building_.tower.$.look.edge.luminosity = 0.3;
              const c = fc.randReal([cs.x * 7, cs.y * 11]);
              if (c < 0.2) {
                building_.tower.setPattern({ "rows": 1, "columns": Math.round(10 * c) });
              }
            }
          } else {
            delete building_.antenna;
          }
        } else {
          ground_.$.dimensions.height = 0.2;

          const baseColor = new Color(gray).lighter(35);
          building_.base.$.coordinates.z = 1.2;
          building_.base.$.dimensions.height = baseHeight + 0.25;
          building_.base.setFaceColor_(baseColor);
          building_.base.$.scales.update({
            "x": 0.9 * building_.base.$.scales.x * building_.tower.$.scales.x,
            "y": 0.9 * building_.base.$.scales.y * building_.tower.$.scales.y
          });

          delete building_.tower;
          delete building_.antenna;
        }

        if (wireframe.anchored(cs)) {
          block_.setFaceColor_(new Color(salt));
          block_.setEdgeColor_(new Color(ruby));
          block_.$.look.lit = false;
          ground_.setFaceColor_(new Color(salt));
          ground_.setEdgeColor_(new Color(ruby));
          ground_.setLit(false);
          ground_.$.look.mesial.edge.lineWidth = 0.4;
          ground_.$.look.lateral.edge.lineWidth = 0.4;
          ground_.$.look.top.edge.lineWidth = 0.4;
          building_.base.setFaceColor_(new Color(salt));
          building_.base.setEdgeColor_(new Color(ruby));
          building_.base.$.look.lit = false;
          building_.base.$.look.edge.lineWidth = 0.4;
          if (building_.tower != null) {
            building_.tower.setFaceColor_(new Color(salt));
            delete building_.tower.$.look.face.color.within;
            building_.tower.setEdgeColor_(new Color(ruby));
            building_.tower.$.look.lit = false;
            building_.tower.$.look.edge.luminosity = 0;
            building_.tower.$.look.edge.lineWidth = 0.1;
          }
          delete building_.antenna;
        }

        return [block_, ground_, building_];
      }

      shore (cs, fr) {
        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fr.center();
        block_.setFaceColor_(new Color(salt));

        const shore_ = shore.instance();
        shore_.$.coordinates.update(cs);
        shore_.$.feed = fr.center();

        if (wireframe.anchored(cs)) {
          block_.setFaceColor_(new Color(salt));
          block_.setEdgeColor_(new Color(ruby));
          block_.$.look.lit = false;
          shore_.setFaceColor_(new Color(salt));
          shore_.setEdgeColor_(new Color(ruby));
          shore_.setLit(false);
          delete shore_.$.look.mesial.face.color.within;
          delete shore_.$.look.lateral.face.color.within;
          delete shore_.$.look.top.face.color.within;
        }

        return [block_, shore_];
      }

      ocean (cs, fr) {
        const ocean_ = ocean.instance();
        ocean_.$.coordinates.update(cs);
        ocean_.$.feed = fr.center();

        if (wireframe.anchored(cs)) {
          ocean_.setFaceColor_(new Color(salt));
          ocean_.setEdgeColor_(new Color(ruby));
          ocean_.$.look.lit = false;
        }

        return [ocean_];
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
    }

    return new Example();
  }
}

class TileThree extends Tile { // eslint-disable-line no-unused-vars
  /* eslint-disable no-undef */
  /* Example application demonstrating use of the retroscapes library
     to render the interactive splash landscape.
   */

  _build () {
    // Concise synonyms for classes from the retroscapes library.
    const Color = retroscapes.Color;
    const Concept = retroscapes.Concept;
    const Concepts = retroscapes.Concepts;

    const ecru = new Color([155, 165, 120]);
    const sage = new Color([190, 200, 195]);
    const clay = new Color([115, 90, 93]);
    const gray = new Color([155, 145, 155]);
    const salt = new Color(gray).lighter(50);
    const coal = new Color([0, 0, 0]);
    const sand = new Color("#FCCA50");

    const block = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": ecru.lighter(50) }
      },
      "coordinates": { "z": 0, "o": 0 }
    });

    const plate = new Concept({
      "dimensions": { "height": 0 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": gray.lighter(10) }
      },
      "coordinates": { "z": 1, "o": 0 }
    });

    const structure = new Concepts({
      "base": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": {
          "mesial": {
            "face": {},
            "edge": { "color": coal.lighter(40), "lineWidth": 0.2, "lineDash": [] }
          },
          "lateral": {
            "face": {},
            "edge": { "color": coal.lighter(40), "lineWidth": 0.2, "lineDash": [] }
          },
          "top": {
            "face": {},
            "edge": { "color": coal.lighter(40), "lineWidth": 0.2, "lineDash": [] }
          }
        },
        "coordinates": { "z": 3, "o": 1 }
      }),
      "tower": new Concept({
        "dimensions": {},
        "form": { "shape": "prism" },
        "look": {
          "mesial": {
            "face": {},
            "edge": { "color": coal.lighter(40), "lineWidth": 0.2, "lineDash": [] }
          },
          "lateral": {
            "face": {},
            "edge": { "color": coal.lighter(40), "lineWidth": 0.2, "lineDash": [] }
          },
          "top": {
            "face": {},
            "edge": { "color": coal.lighter(40), "lineWidth": 0.2, "lineDash": [] }
          }
        },
        "coordinates": { "z": 0, "o": 2 }
      })
    });

    const edge = new Concept({
      "dimensions": { "height": 0.2 },
      "form": { "shape": "prism" },
      "look": {
        "mesial": { "face": { "color": gray } },
        "lateral": { "face": { "color": gray } },
        "top": {
          "face": { "color": new Color(gray.lighter(10), { "within": "15%" }) },
          "edge": { "color": gray, "lineWidth": 1.05, "lineDash": [] }
        }
      },
      "coordinates": { "z": 3, "o": 0 }
    });

    const slab = new Concept({
      "dimensions": {
        "height": 0, "quantity": 10, "radius": 0.4, "spread": 0.8, "positional": true
      },
      "form": { "shape": "cloud", "particle": "point" },
      "look": {
        "face": { "color": new Color([0, 0, 0, 0]) },
        "edge": {
          "color": new Color(sage).darker(10),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 3, "o": 1 }
    });

    const desert = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": new Color(sand, { "within": "10%" }) }
      },
      "coordinates": { "z": 0, "o": 0 },
      "scales": { "x": 1, "y": 1, "z": 1 }
    });

    const dune = new Concept({
      "dimensions": {
        "height": 0, "quantity": 2, "radius": 0.5, "spread": 0.6, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color([0, 0, 0, 0]) },
        "edge": {
          "color": new Color(sand).darker(10),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const plants = new Concept({
      "dimensions": {
        "height": 0.3, "quantity": 3, "radius": 0.4, "spread": 0.5, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color("#7EC850").darker(35) },
        "edge": {
          "color": new Color("#7EC850").darker(25),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 2.5, (1.5 * Math.PI) + 2.5]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const populated = new retroscapes.Anchors(8, 0.02, [2, 0]);
    const platform = new retroscapes.Anchors(12, 0.01, [1, 2]);
    const unused = new retroscapes.Anchors(8, 0.02, [2, 2]);
    const fertile = new retroscapes.Anchors(17, 0.002, [1, 0]);

    class Example extends retroscapes.Scape {
      render () {
        return ["world"];
      }

      world (cs, fr) {
        cs = this.coordinates(cs);
        if (this.isPlatform(fr)) {
          return this.isPlatformIsolated(fr) ? this.edge(cs, fr) : this.platform(cs, fr);
        } else {
          return this.isEdge(fr) ? this.edge(cs, fr) : this.desert(cs, fr);
        }
      }

      platform (cs, fr) {
        const fc = fr.center();

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fc;
        block_.setFaceColor_(new Color(sand).nearby(16, fc.randReals(3)));

        const isPlatform = platform.anchored(cs);
        const elevation = 3;

        const plate_ = plate.instance();
        plate_.$.coordinates.update(cs);
        plate_.$.feed = fc;
        plate_.$.coordinates.z = elevation;

        if (platform.anchored(cs)) {
          plate_.setFaceColor(new Color([255, 140, 140, 0.5]));
          plate_.setLine({
            "color": new Color([255, 140, 140]).darker(20),
            "lineWidth": 1,
            "quantity": 3,
            "margin": 0.1,
            "orientation": "vertical"
          });
          return [block_, plate_];
        }

        block_.setFaceColor_(
          new Color(block_.$.look.face.color).darker(30)
        );

        if (fc.randReal([cs.x, cs.y, 3]) > 0.2) {
          plate_.setSpot({
            "color": new Color(sage).lighter(100),
            "size": 1.4,
            "ratio": 0.75,
            "quantity": 10 + (20 * fc.randReal([cs.y, cs.x])),
            "arrangement": "regular",
            "probability": 0.8
          });
          return [block_, plate_];
        }

        const structure_ = structure.instance();
        structure_.$.coordinates = cs;
        structure_.base.$.feed = fr.up();
        const baseHeight = 0.1 + 0.2 * (fc.randReal([cs.x + 3 * cs.y, 7 * cs.y]));
        const offsetsBase = {
          "x": -1 + (2 * fc.randReal([cs.x])),
          "y": -1 + (2 * fc.randReal([cs.y]))
        };
        structure_.base.$.coordinates.z = 3;
        structure_.base.$.scales.update({
          "x": 0.6 - (0.2 * fc.randReal([cs.x])),
          "y": 0.6 - (0.2 * fc.randReal([cs.y]))
        });
        structure_.base.$.offsets.update(offsetsBase);

        if (populated.anchored(cs) && !isPlatform) {
          structure_.base.$.dimensions.height = baseHeight;
          structure_.base.setFaceColor_(
            new Color(
              [gray, salt][
                fc.randReal([cs.y, cs.x]) > 0.3 ? 0 : 1
              ]
            ).nearby(20, fr.left().randReals(3))
          );

          structure_.tower.$.feed = fr.down();
          const hMax =
            (!this.isPlatformIsolated(fr))
              ? (this.isPlatformSurrounded(fr) ? 2 : 1)
              : 1;
          const towerHeight = hMax * (fc.randReal([cs.x, 2 * cs.y]));
          structure_.tower.$.dimensions.height = towerHeight;

          const scaleBound = 0.1 * fc.randReal([cs.x]);
          structure_.tower.$.coordinates.z = elevation + baseHeight;
          structure_.tower.$.scales.update({
            "x": 1 - 0.8 - scaleBound,
            "y": 1 - 0.8 - scaleBound
          });
          structure_.tower.$.offsets.update({
            "x": 0.7 * offsetsBase.x,
            "y": 0.7 * offsetsBase.y
          });
          structure_.tower.setFaceColor_(
            new Color(structure_.base.$.look.top.face.color).nearby(
              20, fr.right().randReals(3)
            )
          );

          const hasLine = fc.randReal([cs.x, 2 * cs.y]);
          if (hasLine < 0.5) {
            structure_.tower.$.look.mesial.setLine({
              "color":
                new Color(
                  structure_.tower.$.look.top.face.color
                ).lighterOrDarker(hasLine < 0.25 ? -30 : -60),
              "lineWidth": 1,
              "quantity": 2 + (
                (hasLine > 0.2)
                  ? Math.round(3.5 * hasLine)
                  : structure_.tower.$.dimensions.height * 5
              ),
              "margin": 0.1,
              "orientation": ((hasLine > 0.2) ? "vertical" : "horizontal")
            });
          }
        } else {
          plate_.$.dimensions.height = 0.2;

          const baseColor =
            new Color(clay).lighter(35).nearby(15, fr.up().randReals(3));
          const spot = {
            "color":
              new Color(baseColor).lighterOrDarker(
                fc.randReal([cs.y, cs.x]) > 0.5 ? 50 : -50
              ),
            "size": 1.2,
            "ratio": 0.75,
            "quantity": 20 + (20 * fc.randReal([cs.y, cs.x])),
            "arrangement": "regular",
            "probability": 0.8
          };
          structure_.base.$.coordinates.z = elevation + 0.2;
          structure_.base.$.dimensions.height = baseHeight;
          structure_.base.setFaceColor_(baseColor);
          structure_.base.$.look.mesial.setSpot(spot);
          structure_.base.$.look.lateral.setSpot(spot);
          structure_.base.$.scales.update({
            "x": 0.9 * structure_.base.$.scales.x * structure_.tower.$.scales.x,
            "y": 0.9 * structure_.base.$.scales.y * structure_.tower.$.scales.y
          });

          delete structure_.tower;
        }

        return [block_, plate_, structure_];
      }

      edge (cs, fr) {
        const fc = fr.center();

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fr.center();
        block_.setFaceColor_(
          new Color(sand).nearby(16, fr.center().randReals(3)).darker(30)
        );

        const edge_ = edge.instance();
        edge_.$.coordinates.update(cs);
        edge_.$.feed = fr.center();

        const elevation = 3;
        edge_.$.coordinates.z = elevation;

        let instances = [];
        if (fr.countAround(this.isPlatform) <= 1 && fr.randReal([cs.y, cs.x]) > 0.1) {
          edge_.$.look.top.setFaceColor_(new Color(sage));
          edge_.$.look.top.setEdgeColor(new Color(sage).darker(5));

          if (unused.anchored(cs)) {
            const slab_ = slab.instance();
            slab_.$.coordinates.update(cs);
            slab_.$.feed = fr.center();
            instances = [block_, edge_, slab_];
          } else {
            instances = [block_, edge_];
          }
        } else {
          edge_.$.look.top.setPattern({
            "rows": 1 + Math.round(2 * fc.randReal([cs.x])),
            "columns": 1 + Math.round(2 * fc.randReal([cs.y]))
          });
          instances = [block_, edge_];
        }

        return instances;
      }

      desert (cs, fr) {
        const fc = fr.center();

        const desert_ = desert.instance();
        desert_.$.coordinates.update(cs);
        desert_.$.feed = fr.center();
        desert_.setFaceColor_(
          new Color(desert_.$.look.face.color).nearby(12, fr.center().randReals(3))
        );

        if (this.isDune(fr)) {
          const dune_ = dune.instance();
          dune_.$.coordinates.update(cs);
          dune_.$.feed = fr.center();
          return [desert_, dune_];
        } else if (fertile.anchored(cs)) {
          const plants_ = plants.instance();
          plants_.$.coordinates.update(cs);
          plants_.$.feed = fr.center();
          desert_.setSpot({
            "color": new Color(sage).darker(60),
            "size": 1.2,
            "ratio": 0.75,
            "quantity": 20 + (20 * fc.randReal([cs.y, cs.x])),
            "probability": 1
          });
          return [desert_, plants_];
        } else {
          return [desert_];
        }
      }

      isPlatform (fx) {
        return fx.randBoolWithProb(0.11);
      }

      isPlatformIsolated (fr) {
        return this.isPlatform(fr) && fr.noneOnAxes(this.isPlatform);
      }

      isPlatformSurrounded (fr) {
        return this.isPlatform(fr) && fr.allOnAxes(this.isPlatform);
      }

      isEdge (fr) {
        return !this.isPlatform(fr) && fr.countOnRing(this.isPlatform) > 0;
      }

      isDune (fr) {
        return (
          fr.relative(1, 1).randBoolWithProb(0.3) &&
          fr.countAround(this.isPlatform) === 0
        );
      }
    }

    return new Example();
  }
}

class TileFour extends Tile { // eslint-disable-line no-unused-vars
  /* eslint-disable no-undef */
  /* Example application demonstrating use of the retroscapes library
     to render the interactive splash landscape.
   */

  _light () {
    return { "top": 10, "left": -20, "right": -30 };
  }

  _build () {
    // Concise synonyms for classes from the retroscapes library.
    const Color = retroscapes.Color;
    const Concept = retroscapes.Concept;
    const Concepts = retroscapes.Concepts;

    const navy = new Color([30, 90, 195]).darker(30);
    const bark = new Color("#BF8040");
    const ecru = new Color([155, 165, 120]);
    const sage = new Color("#8ABD91");
    const fire = new Color("#ff8c00");
    const clay = new Color([115, 90, 93]);
    const gray = new Color([155, 145, 155]);
    const coal = new Color([0, 0, 0]);
    const ruby = new Color([255, 0, 0]);

    const block = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": ecru.lighter(50) }
      },
      "coordinates": { "z": 0, "o": 0 }
    });

    const building = new Concepts({
      "base": new Concept({
        "dimensions": { "height": 1 },
        "form": { "shape": "prism" },
        "look": {
          "mesial": {
            "face": { "color": new Color(gray, { "within": "40%" }) },
            "edge": { "color": gray.darker(70), "lineWidth": 0.5, "lineDash": [] },
            "pattern": { "rows": 1, "columns": 2 }
          },
          "lateral": {
            "face": { "color": new Color(gray, { "within": "80%" }) },
            "edge": { "color": gray.darker(70), "lineWidth": 0.5, "lineDash": [] },
            "pattern": { "rows": 1, "columns": 2 }
          },
          "top": {
            "face": { "color": new Color(bark.darker(40), { "within": "30%" }) },
            "edge": { "color": bark.darker(70), "lineWidth": 0.5, "lineDash": [] },
            "pattern": { "rows": 3, "columns": 3 }
          }
        },
        "coordinates": { "z": 1, "o": 1 }
      })
    });

    const shore = new Concept({
      "dimensions": { "height": 0.2 },
      "form": { "shape": "prism" },
      "look": {
        "mesial": { "face": { "color": ecru } },
        "lateral": { "face": { "color": ecru } },
        "top": {
          "face": { "color": new Color(ecru.lighter(50), { "within": "15%" }) },
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
        "edge": {
          "color": new Color(sage).darker(6),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const ocean = new Concept({
      "dimensions": { "height": 1 },
      "form": { "shape": "prism" },
      "look": {
        "face": { "color": new Color(navy, { "within": "10%" }) }
      },
      "coordinates": { "z": 0, "o": 0 },
      "scales": { "x": 1, "y": 1, "z": 1 }
    });

    const waves = new Concept({
      "dimensions": {
        "height": 0, "quantity": 2, "radius": 0.5, "spread": 0.6, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color([0, 0, 0, 0]) },
        "edge": {
          "color": new Color(navy).darker(3),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 0.7, (1.5 * Math.PI) + 0.7]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const rocks = new Concept({
      "dimensions": {
        "height": 0, "quantity": 3, "radius": 0.4, "spread": 0.5, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color(gray) },
        "edge": {
          "color": new Color(navy).darker(5),
          "lineWidth": 1,
          "lineDash": []
        },
        "angles": [(1.5 * Math.PI) - 1.2, (1.5 * Math.PI) + 1.2]
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const fog = new Concept({
      "dimensions": {
        "height": 0, "quantity": 8, "radius": 2, "spread": 0.9, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color([255, 255, 255, 0.2]) }
      },
      "coordinates": { "z": 1, "o": 1 }
    });

    const smoke = new Concept({
      "dimensions": {
        "height": 1, "quantity": 10, "radius": 3, "spread": 0.7, "positional": true
      },
      "form": { "shape": "cloud", "particle": "bubble" },
      "look": {
        "face": { "color": new Color([0, 0, 30, 0.05]).lighter(15) }
      },
      "coordinates": { "z": 1, "o": 2 }
    });

    const verdant = new retroscapes.Anchors(8, 0.02, [2, 2]);
    const foggy = new retroscapes.Anchors(32, 0.002, [2, 4]);
    const rocky = new retroscapes.Anchors(17, 0.002, [2, 0]);
    const igneous = new retroscapes.Anchors(17, 0.002, [2, 1]);
    const elevation = 0.1;

    class Example extends retroscapes.Scape {
      render () {
        return ["world"];
      }

      world (cs, fr) {
        cs = this.coordinates(cs);
        if (this.isLand(fr)) {
          return this.isLandIsolated(fr) ? this.shore(cs, fr) : this.land(cs, fr);
        } else {
          return this.isShore(fr) ? this.shore(cs, fr) : this.ocean(cs, fr);
        }
      }

      land (cs, fr) {
        const fc = fr.center();

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fc;
        block_.setFaceColor_(
          new Color(
            block_.$.look.face.color
          ).nearby(16, fc.randReals(3)).darker(20)
        );
        block_.setSpot({
          "color": new Color(sage).darker(40),
          "size": 1.2,
          "ratio": 0.75,
          "quantity": 10 + (20 * fc.randReal([cs.y, cs.x])),
          "probability": 0.8
        });

        const count = fr.countAround(this.isLand);
        const isLava = count === 15;
        if (isLava) {
          const blockHeight = 1 + (elevation * count) - 1;
          block_.$.dimensions.height = blockHeight;
          block_.setFaceColor_(new Color(fire).nearby(32, fr.up().randReals(3)));
          block_.$.look.face.luminosity = 1;
          block_.$.look.spot.color = new Color(ruby);
          if (fc.randReal([cs.x, cs.y]) < 0.8) {
            const smoke_ = smoke.instance();
            smoke_.$.coordinates.update(cs);
            smoke_.$.feed = fr.center();
            smoke_.$.coordinates.z = 0.6 + blockHeight;
            return [block_, smoke_];
          }
          return [block_];
        }

        block_.$.dimensions.height = 1 + elevation * count;
        if (igneous.anchored(cs)) {
          block_.setFaceColor_(
            new Color(coal).lighter(30).nearby(8, fr.up().randReals(3))
          );
        }

        if (this.isInhabited(cs, fc)) {
          const baseColor =
            new Color(clay).lighter(35).nearby(15, fr.up().randReals(3));
          const spot = {
            "color":
              new Color(baseColor).lighterOrDarker(
                fc.randReal([cs.y, cs.x]) > 0.5 ? 50 : -50
              ),
            "size": 1.2,
            "ratio": 0.75,
            "quantity": 4 + (4 * fc.randReal([cs.y, cs.x])),
            "arrangement": "random",
            "probability": 0.8
          };
          const building_ = building.instance();
          building_.$.coordinates = cs;
          building_.base.$.feed = fr.up();
          const offsetsBase = {
            "x": -1 + (2 * fc.randReal([cs.x])),
            "y": -1 + (2 * fc.randReal([cs.y]))
          };
          building_.base.$.coordinates.z = 1;
          building_.base.$.scales.update({
            "x": 0.9 * (1 - (0.6 * fc.randReal([cs.x]))),
            "y": 0.9 * (1 - (0.6 * fc.randReal([cs.y])))
          });
          building_.base.$.offsets.update(offsetsBase);
          building_.base.$.coordinates.z = 1.2;
          building_.base.$.dimensions.height =
            0.4 + (0.4 * (fc.randReal([cs.y, cs.x])));
          building_.base.$.look.mesial.setSpot(spot);
          building_.base.$.look.lateral.setSpot(spot);
          building_.base.$.coordinates.z = block_.$.dimensions.height;
          return [block_, building_];
        }

        return [block_];
      }

      shore (cs, fr) {
        const fc = fr.center();

        const block_ = block.instance();
        block_.$.coordinates.update(cs);
        block_.$.feed = fr.center();
        const blockHeight = 1 + elevation * fr.countAround(this.isLand);
        block_.$.dimensions.height = blockHeight;
        block_.setSpot({
          "color": new Color(sage).darker(40),
          "size": 1.2,
          "ratio": 0.75,
          "quantity": 10 + (20 * fr.randReal([cs.y, cs.x])),
          "probability": 0.8
        });
        if (blockHeight < 2) {
          block_.setFaceColor_(
            new Color(sage).nearby(
              16, fr.center().randReals(3)
            ).darker(20)
          );
        } else {
          block_.setFaceColor_(
            new Color(
              block_.$.look.face.color
            ).nearby(16, fc.randReals(3)).darker(20)
          );
        }

        const shore_ = shore.instance();
        shore_.$.coordinates.update(cs);
        shore_.$.feed = fr.center();
        let instances = [];
        if (fr.countAround(this.isLand) <= 1 && fr.randReal([cs.y, cs.x]) > 0.1) {
          shore_.$.look.top.setFaceColor_(new Color(sage));
          shore_.$.look.top.setEdgeColor(new Color(sage).darker(5));

          if (verdant.anchored(cs)) {
            const greenery_ = greenery.instance();
            greenery_.$.coordinates.update(cs);
            greenery_.$.feed = fr.center();
            instances = [block_, shore_, greenery_];
          } else {
            instances = [block_];
          }
        } else {
          instances = [block_];
        }

        if (foggy.anchored(cs)) {
          const fog_ = fog.instance();
          fog_.$.coordinates.update(cs);
          fog_.$.feed = fr.center();
          fog_.$.coordinates.z = 0.3 + blockHeight;
          instances.push(fog_);
        }

        return instances;
      }

      ocean (cs, fr) {
        const fc = fr.center();

        const ocean_ = ocean.instance();
        ocean_.$.coordinates.update(cs);
        ocean_.$.feed = fr.center();
        ocean_.setFaceColor_(
          new Color(ocean_.$.look.face.color).nearby(12, fr.center().randReals(3))
        );

        if (this.isOceanDeep(fr)) {
          const waves_ = waves.instance();
          waves_.$.coordinates.update(cs);
          waves_.$.feed = fr.center();
          return [ocean_, waves_];
        } else if (rocky.anchored(cs) && fc.randReal([cs.y, cs.x]) < 0.2) {
          const rocks_ = rocks.instance();
          rocks_.$.coordinates.update(cs);
          rocks_.$.feed = fr.center();
          ocean_.setSpot({
            "color": new Color(navy).lighter(60),
            "size": 1.2,
            "ratio": 0.75,
            "quantity": 10 + (5 * fc.randReal([cs.y, cs.x])),
            "probability": 1
          });
          return [ocean_, rocks_];
        } else {
          return [ocean_];
        }
      }

      isInhabited (cs, fc) {
        return fc.randReal([cs.x * 3, cs.y * 7]) < 0.05;
      }

      isLand (fx) {
        return fx.randBoolWithProb(0.11);
      }

      isLandIsolated (fr) {
        return this.isLand(fr) && fr.noneOnAxes(this.isLand);
      }

      isLandSurrounded (fr) {
        return this.isLand(fr) && fr.allOnAxes(this.isLand);
      }

      isShore (fr) {
        return !this.isLand(fr) && fr.countOnRing(this.isLand) > 0;
      }

      isOceanDeep (fr) {
        return (
          fr.relative(1, 1).randBoolWithProb(0.3) &&
          fr.countAround(this.isLand) === 0
        );
      }
    }

    return new Example();
  }
}
