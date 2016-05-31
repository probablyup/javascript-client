/**
Copyright 2016 Split Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
const log = require('debug')('splitio-cache:updater');
const segmentChangesDataSource = require('../ds/segmentChanges');

module.exports = function SegmentChangesUpdater(settings, hub, storage) {
  const sinceValuesCache = new Map();

  return function updateSegments() {
    log('Updating segmentChanges');

    const downloads = [...storage.splits.getSegments()].map(segmentName => {
      return segmentChangesDataSource(settings, segmentName, sinceValuesCache).then(mutator => {
        log(`completed download of ${segmentName}`);

        if (mutator !== undefined) {
          mutator(storage);

          log(`completed mutations for ${segmentName}`);
        } else {
          log(`none changes to be made to ${segmentName}`);
        }
      });
    });

    return Promise.all(downloads)
      .then(() => hub.emit(hub.Event.SDK_UPDATE, storage))
      .catch((error) => hub.emit(hub.Event.SDK_UPDATE_ERROR, error));
  };
};
