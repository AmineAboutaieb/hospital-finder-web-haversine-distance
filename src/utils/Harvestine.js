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
      .map((obj) => ({ ...obj.point, distance: obj.distance }));
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
  graphhopperDirections: async (lat1, long1, lat2, long2) => {
    try {
      let response = await fetch(`https://graphhopper.frmjj-app.ma/?point=${lat1},${long1}&point=${lat2},${long2}&profile=car&locale=fr&snap-preferences=true&maximum-snap-distance=90000&debug=true`);
      if (response.ok) {
        let data = await response?.json();
        return { status: 200, data };
      }
    } catch (e) {
      return { status: 400 };
    }
  },
};
