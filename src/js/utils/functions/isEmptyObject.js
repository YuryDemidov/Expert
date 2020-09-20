import isObject from './isObject';

export default function isEmptyObject(obj) {
  let key;
  for (key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return isObject(obj) && Object.getOwnPropertyNames(obj).length === 0;
}
