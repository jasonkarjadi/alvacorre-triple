const convertLatLng = (lat: number, lng: number) => {
  const latitude = (lat / 180) * Math.PI;
  const longitude = (lng / 180) * Math.PI;

  console.log(Math.cos(latitude) * Math.sin(longitude));
  console.log(Math.sin(latitude));
  console.log(Math.cos(latitude) * Math.cos(longitude));

  return [
    Math.cos(latitude) * Math.sin(longitude),
    Math.sin(latitude),
    Math.cos(latitude) * Math.cos(longitude),
  ];
};

export default convertLatLng;
