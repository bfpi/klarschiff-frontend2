if (typeof proj4 === 'function') {
  proj4.defs('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
  proj4.defs('urn:ogc:def:crs:EPSG::25833', proj4.defs('EPSG:25833'));
  var projection_25833 = ol.proj.get('EPSG:25833');
  projection_25833.setExtent(mv_bbox_25833);
}