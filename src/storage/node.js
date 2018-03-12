import Redis from 'ioredis';
import SplitCacheInMemory from './SplitCache/InMemory';
import SplitCacheInRedis from './SplitCache/InRedis';
import SegmentCacheInMemory from './SegmentCache/InMemory';
import SegmentCacheInRedis from './SegmentCache/InRedis';
import ImpressionsCacheInMemory from './ImpressionsCache/InMemory';
import ImpressionsCacheInRedis from './ImpressionsCache/InRedis';
import LatencyCacheInMemory from './LatencyCache/InMemory';
import LatencyCacheInRedis from './LatencyCache/InRedis';
import CountCacheInMemory from './CountCache/InMemory';
import CountCacheInRedis from './CountCache/InRedis';
import EventsCacheInMemory from './EventsCache/InMemory';
import KeyBuilder from './Keys';
import { STORAGE_MEMORY, STORAGE_REDIS } from '../utils/constants';

const NodeStorageFactory = context => {
  const settings = context.get(context.constants.SETTINGS);
  const { storage } = settings;
  const keys = new KeyBuilder(settings);

  switch (storage.type) {
    case STORAGE_REDIS: {
      const redis = new Redis(storage.options);

      return {
        splits: new SplitCacheInRedis(keys, redis),
        segments: new SegmentCacheInRedis(keys, redis),
        impressions: new ImpressionsCacheInRedis(keys, redis),
        metrics: new LatencyCacheInRedis(keys, redis),
        count: new CountCacheInRedis(keys, redis),
        events: new EventsCacheInMemory(context),

        // When using REDIS we should:
        // 1- Disconnect from the storage
        // 2- Stop sending data to Redis and instance using empty in memory implementation
        destroy() {
          redis.disconnect();
          redis.off();

          this.splits = new SplitCacheInMemory;
          this.segments = new SegmentCacheInMemory(keys);
          this.impressions = new ImpressionsCacheInMemory;
          this.metrics = new LatencyCacheInMemory;
          this.count = new CountCacheInMemory;
          this.events = new EventsCacheInMemory(context);
        }
      };
    }

    case STORAGE_MEMORY:
    default:
      return {
        splits: new SplitCacheInMemory,
        segments: new SegmentCacheInMemory(keys),
        impressions: new ImpressionsCacheInMemory,
        metrics: new LatencyCacheInMemory,
        count: new CountCacheInMemory,
        events: new EventsCacheInMemory(context),

        // When using MEMORY we should flush all the storages and leave them empty
        destroy() {
          this.splits.flush();
          this.segments.flush();
          this.impressions.clear();
          this.metrics.clear();
          this.count.clear();
          this.events.clear();
        }
      };
  }

};

export default NodeStorageFactory;
