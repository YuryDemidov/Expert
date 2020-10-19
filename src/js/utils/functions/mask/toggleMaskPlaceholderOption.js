export default function toggleMaskPlaceholderOption(mask, hide = true) {
  return mask.map(mask => {
    mask.lazy = hide;
    return mask;
  })
}
