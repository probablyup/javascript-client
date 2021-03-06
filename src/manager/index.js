import thenable from '../utils/promise/thenable';
import { find } from '../utils/lang';
import validateManagerSplit from '../utils/manager/validate';

const collectTreatments = (conditions) => {
  // Rollout conditions are supposed to have the entire partitions list, so we find the first one.
  const firstRolloutCondition = find(conditions, (cond) => cond.conditionType === 'ROLLOUT');
  // Then extract the treatments from the partitions
  return firstRolloutCondition ? firstRolloutCondition.partitions.map(v => v.treatment) : [];
};

const ObjectToView = (json) => {
  let splitObject;

  try {
    splitObject = JSON.parse(json);
  } catch(e) {
    return null;
  }

  if (splitObject == null) return null;

  return {
    name: splitObject.name,
    trafficType: splitObject.trafficTypeName || null,
    killed: splitObject.killed,
    changeNumber: splitObject.changeNumber || 0,
    treatments: collectTreatments(splitObject.conditions)
  };
};

const ObjectsToViews = (jsons) => {
  let views = [];

  for (let split of jsons) {
    const view = ObjectToView(split);
    if (view != null) views.push(view);
  }

  return views;
};

const SplitManagerFactory = (splits) => {

  return {
    split(splitName) {
      const isSplitNameValid = validateManagerSplit(splitName);
      if (!isSplitNameValid) {
        return null; // error was logged in validateManagerSplit
      }

      const split = splits.getSplit(splitName);

      if (thenable(split)) return split.then(result => ObjectToView(result));
      return ObjectToView(split);
    },

    splits() {
      const currentSplits = splits.getAll();

      if (thenable(currentSplits)) return currentSplits.then(ObjectsToViews);
      return ObjectsToViews(currentSplits);
    },

    names() {
      return splits.getKeys();
    }
  };

};

export default SplitManagerFactory;
