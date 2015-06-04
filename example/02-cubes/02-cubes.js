import PaintBoard from "mango/PaintBoard";
import Renderable from "mango/Renderable";
import Cube from "mango/geometries/Cube.js";
import PlaneGrid from "mango/geometries/PlaneGrid.js";
import BasicMaterial from "mango/materials/BasicMaterial";
import NormalsMaterial from "mango/materials/NormalsMaterial";
import Renderer from "mango/Renderer/";
import Camera from "mango/Camera";

let pb = new PaintBoard(document.querySelector("canvas"));
pb.bindKeysAndMouse(true);
let camera = new Camera();
let renderer = new Renderer(camera);

let nmaterial = new NormalsMaterial(pb._gl);
let bmaterial = new BasicMaterial(pb._gl, [1.0, 1.0, 1.0]);
let cube = new Renderable(pb._gl, nmaterial, new Cube(pb._gl));
let grid = new Renderable(pb._gl, bmaterial, new PlaneGrid(pb._gl, 3), true);

pb.setCamera(camera);
renderer.submit(cube);
renderer.submit(grid);

camera.position = [2.0, 0.0, -3.0];
camera.at = [0.0, 0.0, 100.0];

(function loop () {
    window.requestAnimationFrame(loop);
    pb.update();

    if (pb.isKeyActive(65))
      camera.incrementPosition(-0.05);

    if (pb.isKeyActive(68))
      camera.incrementPosition(0.05);

    if (pb.isKeyActive(87))
      camera.incrementPosition(0.0, 0.0, 0.05);

    if (pb.isKeyActive(83))
      camera.incrementPosition(0.0, 0.0, -0.05);

    renderer.flush();
})();

