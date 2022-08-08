const nodecg = require('../../extension/util/nodecg-api-context').get();

// Replicants
const currentUtility = nodecg.Replicant('currentUtility', {
  defaultValue: '#utilSpindles',
});

// Default GSAP Tweens and Positions
const utilStartPosition = {
  top: '-50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '20%',
};

const defaultIn = {
  top: '540',
  width: '70%',
  ease: 'back',
  duration: 1,
  overwrite: true,
};
const defaultOut = {
  top: '1540',
  width: '20%',
  ease: 'expo',
  duration: 1.5,
  overwrite: true,
};

// Timelines for in and out
function utilityIn(target) {
  const tl = gsap.timeline();
  tl.fromTo(target, utilStartPosition, defaultIn);
  return tl;
}

function utilityOut(target) {
  const tl = gsap.timeline();
  tl.to(target, defaultOut);
  return tl;
}

currentUtility.on('change', (newValue, oldValue) => {
  // nodecg.log.info(`currentUtility changed from ${oldValue} to ${newValue}!`);
  if (oldValue !== undefined) {
    utilityOut(oldValue);
  }
  utilityIn(newValue);
});
