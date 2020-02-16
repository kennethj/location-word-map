const buildings = require('./buildings.json');
const fs = require('fs');

let userLocation = { latitude: 39.1754528, longitude: -86.5148157 };
console.log(buildings);

function distanceBetween(location1, location2) {
  let theta = location1.longitude - location2.longitude;
  let dist =
    Math.sin(toRadians(location1.latitude)) * Math.sin(toRadians(location2.latitude)) +
    Math.cos(toRadians(location1.latitude)) * Math.cos(toRadians(location2.latitude)) * Math.cos(toRadians(theta));
  dist = Math.acos(dist);
  dist = toDegrees(dist);
  return dist * 60 * 1.1515;
}
let toRadians = degrees => (degrees * Math.PI) / 180;
let toDegrees = radians => (radians * 180) / Math.PI;

var distances = buildings
  .map(building => ({
    name: building.name.replace(/\(.*\)/, '').replace(/\s-\s.*\)/, ''),
    distance: distanceBetween(building, userLocation)
  }))
  .sort((a, b) => a.distance - b.distance)
  .slice(0, 30);

const totalCount = distances.length;
const min = distances[0].distance;
const max = distances[totalCount - 1].distance;
const range = max - min;

distances = distances.map((location, index) => ({
  ...location,
  rank: (location.distance - min) / range,
  size: 7 - (((location.distance - min) / range) * 6)
}));

fs.writeFileSync('./ranked-names', distances.map(location => Math.floor(location.size).toString() + ' ' + location.name).join('\n'));
