import gsap from 'gsap';

// TODO Put this in a replicant so we can disable the announce button
// on the dashboard while the animation is playing
let gIsAnimating = false;

function gEndAnimation() {
  const backgroundDiv = document.getElementById('background');

  // Clear out old elements
  backgroundDiv.innerHTML = '';
  document.getElementById('gWinner').innerHTML = '';
  document.getElementById('gHasWon').innerHTML = '';
  document.getElementById('gName').innerHTML = '';

  // Unfade the text container
  gsap.set('#foreground', { opacity: 1 });

  gIsAnimating = false;
}

function gStartAnimation() {
  const gScrollDuration = 13;
  const gTextDuration = 2;

  // Text Animation
  const gTextTimeline = gsap.timeline();

  const gWinnerOffset = document.getElementById('gWinner').offsetTop;
  const gHasWonOffset = document.getElementById('gHasWon').offsetTop;
  const gNameOffset = document.getElementById('gName').offsetTop;

  // Winner Name Animation
  gTextTimeline.from('#gWinner', {
    top: gWinnerOffset + 450,
    scale: 5,
    filter: 'blur(20px)',
    opacity: 0,
    ease: 'expo.in',
    duration: gTextDuration / 2,
  });

  // 'has been drawn' animation
  gTextTimeline.from(
    '#gHasWon',
    {
      top: gHasWonOffset + 30,
      opacity: 0,
      duration: gTextDuration,
      ease: `expo.out`,
    },
    `+=${gTextDuration / 8}`
  );

  // Giveaway Name animation
  gTextTimeline.from(
    '#gName',
    {
      top: gNameOffset + 30,
      opacity: 0,
      duration: gTextDuration,
      ease: `expo.out`,
    },
    `-=${gTextDuration / 1.5}`
  );

  // Fade all text
  gTextTimeline.to('#foreground', { opacity: 0, duration: 1 }, '+=3');

  // Image Animation
  // Fade in
  gsap.to('.gImage', {
    opacity: 1,
    duration: 1,
  });
  gsap.set('#gScroll', { y: 1100 });

  // Create the Timeline
  const giveawayScrollTimeline = gsap.timeline({
    delay: 0.5,
    onComplete: gEndAnimation,
  });

  giveawayScrollTimeline.to('#gScroll', {
    yPercent: -130,
    duration: gScrollDuration,
    ease: 'power2.out',
  });
}

async function loadImage(imageUrl) {
  const backgroundDiv = document.getElementById('background');

  // Create a new img tag and set its attributes
  const img = document.createElement('img');
  img.setAttribute('class', 'gImage');
  img.setAttribute('id', 'gScroll');
  backgroundDiv.appendChild(img);

  const imageLoadPromise = new Promise((resolve) => {
    img.onload = resolve;
    img.src = imageUrl;
  });

  await imageLoadPromise;
  return img;
}

function gWinHandler(data) {
  if (!gIsAnimating) {
    const { winner } = data;
    const { name: giveawayName } = data;
    const { url } = data;

    document.getElementById('gWinner').innerHTML = winner;
    document.getElementById('gHasWon').innerHTML = `has been drawn for the`;
    document.getElementById('gName').innerHTML = `${giveawayName} Giveaway!`;

    if (url) {
      loadImage(url).then(gStartAnimation());
    } else {
      window.nodecg.sendMessage('debug', {
        type: 'warn',
        msg: 'Giveaway background image not found.',
      });
      gStartAnimation();
    }
    gIsAnimating = true;
  }
}

window.nodecg.listenFor('giveaway:winnerAnnounced', gWinHandler);
