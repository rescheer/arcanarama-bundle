/* eslint-disable no-unused-vars */
import gsap from 'gsap';

function gStartAnim() {
  const gDiceScrollDuration = 6;

  // Get the img and clone it as a child
  const target = document.querySelector('.gImage');
  const clone = target.cloneNode(true);
  target.after(clone);

  // Fade in
  gsap.to('.gImage', {
    opacity: 1,
    duration: 2,
  });
  gsap.set('#gDiceScroll', { y: 1080 });

  // Create the Timeline
  const giveawayScrollTimeline = gsap.timeline({
    repeat: -1,
  });
  giveawayScrollTimeline.to('#gDiceScroll', {
    yPercent: -120,
    duration: gDiceScrollDuration,
    ease: 'none',
  });

  // Reveal the child image instantly, while keeping the parent
  // image hidden until it has passed outside the viewport
  gsap.set(target, { visibility: 'visible' });
  gsap.set(target, { visibility: 'visible', delay: gDiceScrollDuration / 2 });
}

async function loadImage(imageUrl) {
  const img = document.getElementById('gDiceScroll');
  const imageLoadPromise = new Promise((resolve) => {
    img.onload = resolve;
    img.src = imageUrl;
  });

  await imageLoadPromise;
  return img;
}

function gWinHandler(data) {
  const { winner } = data;
  const { name: giveawayName } = data;
  const { url } = data;

  document.getElementById('gWinner').innerHTML = winner;
  document.getElementById('gText').innerHTML = `has been drawn for the`;
  document.getElementById('gName').innerHTML = `${giveawayName} Giveaway!`;

  if (url) {
    loadImage(url).then(gStartAnim());
  } else {
    window.nodecg.sendMessage('debug', {
      type: 'warn',
      msg: 'Giveaway background image not found.',
    });
    gStartAnim();
  }
}

window.nodecg.listenFor('giveaway:winnerAnnounced', gWinHandler);
