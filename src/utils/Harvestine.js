const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in kilometers. Use 3956 for miles.

  const toRad = (angle) => angle * (Math.PI / 180);

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
export default {
  sortByDistance: (pointA, points) => {
    return points
      .map((point) => ({
        point,
        distance: haversineDistance(pointA.lat, pointA.long, point.lat, point.long),
      }))
      .sort((a, b) => a.distance - b.distance)
      .map((obj) => obj.point);
  },
  harvesineDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in kilometers. Use 3956 for miles.

    const toRad = (angle) => angle * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },
};
