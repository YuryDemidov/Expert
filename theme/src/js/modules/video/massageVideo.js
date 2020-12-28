import createYoutubePlayer from './videoLoader';

const massageVideoNode = document.querySelector(`#massageVideo`);
const massageVideoWrap = massageVideoNode.closest(`.video-block`);

const massageVideo = createYoutubePlayer(massageVideoNode, {
  height: `480`,
  width: `853`,
  videoId: massageVideoNode.dataset.id
});

massageVideoWrap.parentNode.addEventListener(`click`, playVideo);

function playVideo() {
  if (!massageVideo.player) {
    return;
  }

  massageVideo.player.playVideo();
  massageVideoWrap.querySelector(`.video-block__play-button`).classList.add(`hidden`);
  massageVideoWrap.querySelector(`.video-block__poster`).classList.add(`hidden`);
}
