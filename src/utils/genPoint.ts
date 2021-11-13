import { BackSide, CircleGeometry, Mesh, MeshBasicMaterial } from "three";

export const genPoint = (x: number, y: number, z: number) => {
  const circle = new Mesh(
    new CircleGeometry(0.5),
    new MeshBasicMaterial({ side: BackSide, color: 0x00ff00 })
  );
  circle.position.set(x, y, z);
  circle.lookAt(0, 0, 0);
  return circle;
};
