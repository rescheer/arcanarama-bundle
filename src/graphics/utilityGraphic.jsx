import gsap from 'gsap';
import path from 'path';

const defaultIn = { top: '50%', ease: 'back', duration: 1.2 };
const defaultOut = { top: '180%', ease: 'sine', duration: 1.5 };
const aImg = document.getElementById('a');
const bImg = document.getElementById('b');

const currentUtilityItem = window.nodecg.Replicant('currentUtilityItem');
let currentImagePath;
let currentOut = '#b';

function getPath(itemPath) {
  const cwd = process.cwd();
  return path.join(cwd, itemPath);
}

function handleUpdate() {
  currentImagePath = currentUtilityItem.value.imagePath;
  switch (currentOut) {
    case '#a':
      bImg.setAttribute('src', getPath(currentImagePath));
      bImg.style.zIndex = 1;
      aImg.style.zIndex = 0;
      gsap.to('#a', defaultOut);
      gsap.fromTo('#b', { top: '-50%' }, defaultIn);
      currentOut = '#b';
      break;
    default:
      aImg.setAttribute('src', getPath(currentImagePath));
      bImg.style.zIndex = 0;
      aImg.style.zIndex = 1;
      gsap.to('#b', defaultOut);
      gsap.fromTo('#a', { top: '-50%' }, defaultIn);
      currentOut = '#a';
      break;
  }
}

window.NodeCG.waitForReplicants(currentUtilityItem).then(() => {
  currentImagePath = currentUtilityItem.value.imagePath;
  document.getElementById('a').setAttribute('src', getPath(currentImagePath));
  currentUtilityItem.on('change', () => handleUpdate());
});
