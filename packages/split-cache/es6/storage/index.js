'use strict';

var Immutable = require('Immutable');

var splits = new Immutable.Map();
var segments = new Immutable.Map();

module.exports = {

  updateSegment(name, segmentSet) {
    segments = segments.set(name, segmentSet);
  },

  updateSplit(featureName, splitDTO) {
    splits = splits.set(featureName, splitDTO);
  },

  getSplit(featureName) {
    return splits.get(featureName);
  },

  getSegment(name) {
    return segments.get(name);
  },

  print() {
    console.log(splits.toJS());
    console.log(segments.toJS());
  }

}
