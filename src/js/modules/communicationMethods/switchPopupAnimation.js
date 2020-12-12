import checkDeviceWidth from '../../utils/functions/checkDeviceWidth';

export default function switchPopupAnimation() {
  return checkDeviceWidth().isMobile ? `zoom-in` : `fade-in`;
}
