// import { getContext } from '../util/nodecg-api-context';

const vibesReps = {};

export function initVibes(nodecg) {
  const vibesData = nodecg.Replicant('vibesData', {
    defaultValue: [],
    persistent: false,
  });

  vibesReps.data = vibesData;
}

/**
 * Returns a random number between min and max
 * @param {number} min
 * @param {number} max
 * @returns result
 */
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Adds a vibecheck to the replicant while avoiding duplicate rolls from one user
 * @param {string} user
 * @param {number} roll
 */
function updateVibesData(user, roll) {
  if (typeof user === 'string' && typeof roll === 'number') {
    const data = { user, roll };

    // This is how we can use the Replicants stored in the global
    // object. Destructuring won't work.
    if (typeof vibesReps.data.value === 'object') {
      vibesReps.data.value.forEach((el, index) => {
        if (el.user === user) {
          vibesReps.data.value.splice(index, 1);
        }
      });
      vibesReps.data.value.push(data);
    }
  }
}

/**
 * Rolls 1-20 and selects a random response in a range
 * @param {string} user
 * @returns a string ready to be sent to a chat
 */
export function getVibeCheck(user) {
  const roll = getRandomNumber(1, 20);
  const randomMessage = getRandomNumber(0, 3);

  updateVibesData(user, roll);

  const article = `${roll === 8 || roll === 11 || roll === 18 ? 'an' : 'a'}`;

  const monsters = [
    'a Shambling Mound',
    'an Owlbear',
    'a Purple Worm',
    'a Gelatinous Cube',
    'a Dragon',
    'a Tarrasque',
    'a Displacer Beast',
  ];
  const planes = [
    'the Astral Plane',
    'a warehouse in the middle of nowhere',
    'Cleveland, Ohio',
    'the Abyss',
    'the Feywild',
    'Pandemonium',
  ];

  const responses = [
    // roll = 1
    [
      `${user} rolled a [1] on their vibe check :(`,
      `quick, send <3 to ${user}! their vibe check was a 1`,
      `${user} rolled a [1] on their vibe check and was tragically devoured by ${
        monsters[getRandomNumber(0, monsters.length - 1)]
      }. you hate to see it`,
      `${user} critically fails the vibe check and is banished to ${
        planes[getRandomNumber(0, planes.length - 1)]
      }.`,
    ],
    // 2 <= roll <= 5
    [
      `${user} rolled a [${roll}] for their vibes! it could be worse (but not much)`,
      `look on the bright side ${user}, a [${roll}] is better than a 1`,
      `how about a [${roll}], ${user}? that's not the worst thing in the world`,
      `${user}, your vibe check is a [${roll}]! at least you didn't roll a 1. sometimes ${
        monsters[getRandomNumber(0, monsters.length - 1)]
      } eats you when you roll a 1`,
    ],
    // 6 <= roll <= 10
    [
      `hey ${user}! you rolled ${article} [${roll}], but who cares what a robot thinks `,
      `${user}, it's not a bad day. your vibe check is ${article} [${roll}]`,
      `[${roll}]! i've seen worse vibes, ${user}`,
      `${user} rolled ${article} [${roll}] for their vibes today`,
    ],
    // 11 <= roll <= 15
    [
      `hey ${user}! [${roll}]! that's pretty good`,
      `${user}, it's a good day. your vibe check is ${article} [${roll}]`,
      `[${roll}]! nice vibes, ${user}`,
      `${user} rolled ${article} [${roll}] for their vibes today!`,
    ],
    // 15 <= roll <= 19
    [
      `hey ${user}! [${roll}]! nice!`,
      `${user}, it's a great day! your vibe check is [${roll}]`,
      `[${roll}]! well done, ${user}`,
      `${user} rolled [${roll}] for their vibes today! very nice`,
    ],
    // roll = 20
    [
      `a nat [20] vibe check! well done, ${user}!`,
      `${user} rolls a nat [20] on their vibe check! they become the temporary ruler of ${
        planes[getRandomNumber(0, planes.length - 1)]
      }.`,
      `it's a beautiful day! that's a big ol' nat [20] there, ${user}`,
      `${user} rolled a nat [20] for their vibes. everyone becomes deeply envious.`,
    ],
  ];

  if (roll === 20) {
    return `${responses[5][randomMessage]}`;
  }
  if (roll > 14) {
    return `${responses[4][randomMessage]}`;
  }
  if (roll > 9) {
    return `${responses[3][randomMessage]}`;
  }
  if (roll > 4) {
    return `${responses[2][randomMessage]}`;
  }
  if (roll > 1) {
    return `${responses[1][randomMessage]}`;
  }
  return `${responses[0][randomMessage]}`;
}
