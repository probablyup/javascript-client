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
'use strict';

class SegmentsStorage {
  constructor() {
    this.storage = null;
  }

  update(segments /*: Set */) /*: void */ {
    this.storage = segments;
  }

  has(name /*: string */) /*: boolean */ {
    return this.storage ? this.storage.has(name) : false;
  }

  toJSON() {
    return this.storage ? this.storage.toJSON() : 'null';
  }

  get size() {
    return this.storage ? this.storage.size : -1;
  }
}

module.exports = SegmentsStorage;