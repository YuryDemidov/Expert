const videoBlocks = document.querySelectorAll(`.video-block`);

videoBlocks.forEach(node => {
  node.addEventListener(`click`, playVideo);
});

function playVideo(evt) {
  const video = evt.currentTarget.querySelector(`.video-block__video`);
  const playButton = evt.currentTarget.querySelector(`.video-block__play-button`);
  const poster = evt.currentTarget.querySelector(`.video-block__poster`);

  if (!playButton.classList.contains(`hidden`)) {
    evt.preventDefault();
    toggleVideoLayout();
    video.addEventListener(`ended`, toggleVideoLayout);
    pauseAllVideos();
    video.play();
  }

  function toggleVideoLayout() {
    playButton.classList.toggle(`hidden`);
    poster.classList.toggle(`hidden`);
    video.controls = !video.controls;
    video.removeEventListener(`ended`, toggleVideoLayout);
  }
}

function pauseAllVideos() {
  document.querySelectorAll(`video`).forEach(video => video.pause());
}
