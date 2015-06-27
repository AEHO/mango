import {vec3} from "gl-matrix";

import BatchRenderer from "utea/renderers/BatchRenderer";
import BasicMaterial from "utea/materials/BasicMaterial";

/**
 * Curves base class.
 */
export default class Curve {
  constructor (gl, camera, control=[], iterations=20) {
    // contract
    if (this.constructor == Curve)
      throw new TypeError("Curve can't be instantiated directly.");
    if (this._calculate == undefined)
      throw new TypeError('Curve::_calculate must be declared');

    // init
    this.points = {
      control: new Float32Array(60),
      curve: new Float32Array(iterations*3 + 3)
    };

    this.renderers = {
      control: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [0.5, 0.5, 0.0], 5.0)),
      curve: new BatchRenderer(gl, camera, new BasicMaterial(gl,
        [1.0, 1.0, 1.0], 1.0)),
    };

    this._iterations = iterations;
    this._tempPoint = vec3.create();
    this._controlOffset = 0.0;
  }

  // invalidates: - curve
  set iterations (iterations) {
    this._iterations = iterations;
    this.points.curve = new Float32Array(iterations*3 + 3);
    this._resetCurveRenderer();
  }

  get controlPointsNumber () {
    return this._controlOffset/3;
  }

  render () {
    this.renderers.curve.flush();
    this.renderers.control.flush();
  }

  // invalidates: - curve
  //              - control
  updateControlPoint (index, point) {
    this.points.control.set(point, index*3);
    this.renderers.control.update(index, {coords: point});
    this._resetCurveRenderer();
  }

  intersectsControlPoint (p, error=0.01) {
    let dist = 0.0;
    let x = 0.0, y = 0.0, z = 0.0;

    for (let i = 0; i < this._controlOffset; i+=3) {
      x = p[0] - this.points.control[ i ];
      y = p[1] - this.points.control[i+1];
      z = p[2] - this.points.control[i+2];

      dist = x*x + y*y + z*z;

      if (dist < error)
        return i/3;
    }

    return -1;
  }

  _resetCurveRenderer () {
    this._calculate();
    this.renderers.curve.reset({coords: this.points.curve});
  }

  _appendToControlRenderer (points) {
    this.points.control.set(points, this._controlOffset);
    this._controlOffset += points.length;
    this.renderers.control.submit({coords: points});
  }
};

