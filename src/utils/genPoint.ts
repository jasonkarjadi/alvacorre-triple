import { DoubleSide, CircleGeometry, Mesh, MeshBasicMaterial } from "three";

export const genPoint = (x: number, y: number, z: number) => {
  const circle = new Mesh(
    new CircleGeometry(0.2),
    new MeshBasicMaterial({ side: DoubleSide, color: 0x00ff00 })
  );
  circle.position.set(x, y, z);
  circle.lookAt(0, 0, 0);
  return circle;
};
