const YOUTUBE_API_URL = `https://www.youtube.com/iframe_api`;

loadYoutubePlayerApi();

function loadYoutubePlayerApi() {
  const tag = document.createElement(`script`);
  tag.src = YOUTUBE_API_URL;

  const firstScriptTag = document.getElementsByTagName(`script`)[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

export default function createYoutubePlayer(node, options) {
  const video = {
    node: node,
    player: null
  };

  window.onYouTubeIframeAPIReady = () => {
    // eslint-disable-next-line no-undef
    video.player = new YT.Player(node, options);
  };

  return video;
}
