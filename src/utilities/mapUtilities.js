import React from 'react';

export const getBounds = (data) => {
  let xMinIndex = 0;
  let yMinIndex = 0;
  let xMaxIndex = 0;
  let yMaxIndex = 0;
  if (data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].x < data[xMinIndex].x) {
        xMinIndex = i;
      }
      if (data[i].x > data[xMaxIndex].x) {
        xMaxIndex = i;
      }
      if (data[i].y < data[yMinIndex].y) {
        yMinIndex = i;
      }
      if (data[i].y > data[yMaxIndex].y) {
        yMaxIndex = i;
      }
    }
    return [
      [data[yMinIndex].y, data[xMinIndex].x],
      [data[yMaxIndex].y, data[xMaxIndex].x],
    ];
  }
  return null;
};

const getAllStreetPoints = (streetData) => {
  const points = [];
  for (let street of streetData) {
    for (let pt of street.line) {
      points.push(pt);
    }
  }
  return points;
};

export const getBoundsFromStreetData = data => (
  getBounds(getAllStreetPoints(data))
);

export const convertStreetLinesToLatLngArrays = (streetData) => {
  const lines = [];
  for (let street of streetData) {
    lines.push(street.line.map(point => [point.y, point.x]));
  }
  return lines;
};

export const convertPolygonsToLatLngArrays = (polygonData) => {
  const polygons = [];
  for (let poly of polygonData) {
    const latLng = [];
    latLng.push(poly.outer.points.map(pt => [pt.y, pt.x]));
    if (poly.holes && poly.holes.length > 0) {
      for (let hole of poly.holes) {
        latLng.push(hole.points.map(pt => [pt.y, pt.x]));
      }
    }
    polygons.push(latLng);
  }
  return polygons;
};

//get bounds based on the outer points of polygon/s of a property
export const getBoundsFromPropertyPolygons = (polygonData) => {
  const points = [];
  for (let poly of polygonData) {
    for (let pt of poly.outer.points) {
      points.push(pt);
    }
  }
  return getBounds(points);
};

//get bounds based on the outer points of a list of property polygons
export const getBoundsFromPropertyList = (polygonList) => {
  const points = [];
  for (let polygon of polygonList) {
    for (let index of Object.keys(polygon)) {
      for (let pt of polygon[index].outer.points) {
        points.push(pt);
      }
    }
  }
  return getBounds(points);
};

//only getting the outer bounds
const getAllPolygonPoints = (polygonData) => {
  const points = [];
  for (let poly of polygonData) {
    for (let pt of poly.outer.points) {
      points.push(pt);
    }
  }
  return points;
};

export const combinePolygonsFromPropertyList = (propertyList) => {
  const polygons = [];
  for (let property of propertyList) {
    const polygonData = Object.assign({}, property);
    delete polygonData.polygons;
    polygonData.polygons = [];
    polygonData.polygons = convertPolygonsToLatLngArrays(property.polygons);
    polygonData.popup = (<div><b>Pin #</b><div>{property.pinnum}</div><br /><b>Civic Address ID</b><div>{property.property_civic_address_id}</div><br /><b>Address: </b><div>{property.property_address}, {property.property_zipcode}</div></div>);
    polygons.push(polygonData);
  }
  return polygons;
};

export const combinePolygonsFromNeighborhoodList = (neighborhoodList) => {
  const polygons = [];
  for (let key of Object.keys(neighborhoodList)) {
    const polygonData = {};
    polygonData.polygons = [];
    polygonData.polygons = convertPolygonsToLatLngArrays([neighborhoodList[key].polygon]);
    polygons.push(polygonData);
  }
  return polygons;
};

export const getBoundsFromPolygonData = data => (
  getBounds(getAllPolygonPoints(data))
);
