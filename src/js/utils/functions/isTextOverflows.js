export default function isTextOverflows(node) {
  return node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight;
}
