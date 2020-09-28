export default function isObject(value) {
  const valueType = typeof value;
  return value !== null && (valueType === 'object' || valueType === 'function');
}
