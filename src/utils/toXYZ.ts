export const toXYZ = (lat: number, lng: number, rad: number) => {
  const latitude = (lat / 180) * Math.PI;
  const longitude = (lng / 180) * Math.PI;
  const x = Math.cos(latitude) * Math.sin(longitude) * rad;
  const y = Math.sin(latitude) * rad;
  const z = Math.cos(latitude) * Math.cos(longitude) * rad;
  const xyz: [number, number, number] = [x, y, z];
  return xyz;
};
