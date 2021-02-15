/* TODO To enable video reviews comment out this code and rebuild project
import './videoLoader';

const videoReviewsWrap = document.querySelector(`.video-reviews`);
const videoReviews = videoReviewsWrap.querySelectorAll(`.video-block`);
const youtubePlayers = [];

globalThis.onYouTubeIframeAPIReady = () => {
  videoReviewsWrap.classList.remove(`hidden`);

  videoReviews.forEach(node => {
    const videoPlaceholder = node.querySelector(`.video-block__video`);

    // eslint-disable-next-line no-undef
    const player = new YT.Player(videoPlaceholder, {
      height: `204`,
      width: `320`,
      videoId: videoPlaceholder.dataset.id
    });
    youtubePlayers.push(player);

    node.addEventListener(`click`, evt => playVideo(evt, player));
  });
};

function playVideo(evt, player) {
  const poster = evt.currentTarget.querySelector(`.video-block__poster`);
  const playButton = evt.currentTarget.querySelector(`.video-block__play-button`);

  if (!playButton.classList.contains(`hidden`)) {
    evt.preventDefault();
    playButton.classList.toggle(`hidden`);
    poster.classList.toggle(`hidden`);
    pauseAllVideos();
    player.playVideo();
  }
}

function pauseAllVideos() {
  youtubePlayers.forEach(player => player.stopVideo());
}
*/
