const KEYS = {
  "[": 219,
  "]": 221,
  "m": 77,
};

let last_reset = 0;

const globalCallback = () => {
  if (last_reset < 0) {
    if (keyIsDown(KEYS["["])) {
      ITEM_INDEX = Math.max(ITEM_INDEX - 1, 0);
    }
    if (keyIsDown(KEYS["]"])) {
      ITEM_INDEX = Math.min(ITEM_INDEX + 1, OBJECTS.length - 1);
    }

    if (keyIsDown(KEYS["m"])) {
      MODE = MODE === "Object" ? "Eye" : "Object";
    }
    last_reset = 10;
  }
  last_reset--;
};

const callbacks = (objects, mode = "Eye", objectIndex = 0) => {
  globalCallback();
  objectCallbacks(objects, mode, objectIndex);
};

const objectCallbacks = (objects, mode = "Eye", objectIndex = 0) => {
  if (mode === "Eye") {
    objects.forEach((object) => {
      rotateObj(object, true);
      move(object, true);
      zoom(object, true);
    });
  } else {
    const objectToMove = objects[objectIndex];
    rotateObj(objectToMove, false);
    move(objectToMove, false);
    zoom(objectToMove, false);
  }
};
