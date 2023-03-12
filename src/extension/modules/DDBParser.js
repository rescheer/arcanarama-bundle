import { getContext } from '../util/nodecg-api-context';

export default function parseDDBData(id) {
  const replicant = getContext().Replicant(id);
  const { value: rawData } = replicant;
  const parsedData = {
    fullName: '',
    avatarUrl: '',
    race: '',
    background: '',
    totalLevel: 0,
    classes: [],
    stats: {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    },
    hp: {
      max: '',
      current: '',
      temp: '',
      tempMax: '',
      type: '',
    },
    ac: '',
    condition: [],
    deathSaves: {
      successes: '',
      failures: '',
      stable: true,
    },
    isSpellcaster: false,
    spellSlots: {
      max: [],
      current: [],
    },
    description: {
      classes: {
        simple: [],
        withLevel: [],
        full: [],
      },
      pronouns: '',
    },
  };

  // Modifiers
  const { race: raceMods } = rawData.modifiers;
  const { class: classMods } = rawData.modifiers;
  const { background: backgroundMods } = rawData.modifiers;
  const { item: itemMods } = rawData.modifiers;
  const { feat: featMods } = rawData.modifiers;
  const modsArray = [raceMods, classMods, backgroundMods, itemMods, featMods];

  // Grab simple data
  parsedData.fullName = rawData.name;
  parsedData.race = rawData.race.fullName;
  parsedData.avatarUrl = rawData.avatarUrl;
  parsedData.hp.type =
    rawData.preferences.hitPointType === 2 ? 'manual' : 'fixed';

  // Parse AC

  // Parse Stats
  const computedStats = {
    str: rawData.stats[0].value,
    dex: rawData.stats[1].value,
    con: rawData.stats[2].value,
    int: rawData.stats[3].value,
    wis: rawData.stats[4].value,
    cha: rawData.stats[5].value,
  };

  modsArray.forEach((modType) => {
    modType.forEach((mod) => {
      switch (mod.subType) {
        case 'strength-score':
          computedStats.str += mod.value;
          break;
        case 'dexterity-score':
          computedStats.dex += mod.value;
          break;
        case 'constitution-score':
          computedStats.con += mod.value;
          break;
        case 'intelligence-score':
          computedStats.int += mod.value;
          break;
        case 'wisdom-score':
          computedStats.wis += mod.value;
          break;
        case 'charisma-score':
          computedStats.cha += mod.value;
          break;
        default:
          break;
      }
    });
  });
  Object.assign(parsedData.stats, computedStats);

  // Parse Classes
  const computedClasses = [];
  rawData.classes.forEach((cls) => {
    const { name: baseName, hitDice, canCastSpells } = cls.definition;
    const { level, isStartingClass } = cls;
    let spellSlots;
    let multiClassSpellSlotDivisor;

    if (canCastSpells) {
      spellSlots = cls.definition.spellRules.levelSpellSlots[level].slice(0);
      multiClassSpellSlotDivisor =
        cls.definition.spellRules.multiClassSpellSlotDivisor;
    }

    let subName;
    if (cls.subclassDefinition?.name) {
      subName = cls.subclassDefinition.name;
    }

    const newClassObject = {
      name: baseName,
      subName,
      level,
      canCastSpells,
      isStartingClass,
      hitDice,
      spellSlots,
      multiClassSpellSlotDivisor,
    };

    computedClasses.push(newClassObject);
  });
  parsedData.classes = computedClasses.slice(0);

  // Check for spellcaster classes
  parsedData.isSpellcaster = computedClasses.some((cls) => cls.canCastSpells);

  // Parse Spellslots
  const spellcasterClasses = [];
  let spellcasterLevels = 0;
  const computedSpellSlots = { max: [], current: [] };

  // Pull all caster classes
  computedClasses.forEach((cls) => {
    if (cls.canCastSpells) {
      const divisor = cls.multiClassSpellSlotDivisor;
      const { level } = cls;
      spellcasterClasses.push(cls);
      spellcasterLevels += Math.floor(level / divisor);
    }
  });

  if (spellcasterClasses.length > 0) {
    // Is a caster
    if (spellcasterClasses.length === 1) {
      // Has only a single caster class
      computedSpellSlots.max = computedClasses.spellSlots.slice(0);
      computedSpellSlots.current = computedClasses.spellSlots.slice(0);
    } else {
      // Has multiple caster classes
      let multiclassSpellSlots;
      switch (spellcasterLevels) {
        case 20:
          multiclassSpellSlots = [4, 3, 3, 3, 3, 2, 2, 1, 1];
          break;
        case 19:
          multiclassSpellSlots = [4, 3, 3, 3, 3, 2, 1, 1, 1];
          break;
        case 18:
          multiclassSpellSlots = [4, 3, 3, 3, 3, 1, 1, 1, 1];
          break;
        case 17:
          multiclassSpellSlots = [4, 3, 3, 3, 2, 1, 1, 1, 1];
          break;
        case 16:
        case 15:
          multiclassSpellSlots = [4, 3, 3, 3, 2, 1, 1, 1, 0];
          break;
        case 14:
        case 13:
          multiclassSpellSlots = [4, 3, 3, 3, 2, 1, 1, 0, 0];
          break;
        case 12:
        case 11:
          multiclassSpellSlots = [4, 3, 3, 3, 2, 1, 0, 0, 0];
          break;
        case 10:
          multiclassSpellSlots = [4, 3, 3, 3, 2, 0, 0, 0, 0];
          break;
        case 9:
          multiclassSpellSlots = [4, 3, 3, 3, 1, 0, 0, 0, 0];
          break;
        case 8:
          multiclassSpellSlots = [4, 3, 3, 2, 0, 0, 0, 0, 0];
          break;
        case 7:
          multiclassSpellSlots = [4, 3, 3, 1, 0, 0, 0, 0, 0];
          break;
        case 6:
          multiclassSpellSlots = [4, 3, 3, 0, 0, 0, 0, 0, 0];
          break;
        case 5:
          multiclassSpellSlots = [4, 3, 2, 0, 0, 0, 0, 0, 0];
          break;
        case 4:
          multiclassSpellSlots = [4, 3, 0, 0, 0, 0, 0, 0, 0];
          break;
        case 3:
          multiclassSpellSlots = [4, 2, 0, 0, 0, 0, 0, 0, 0];
          break;
        case 2:
          multiclassSpellSlots = [3, 0, 0, 0, 0, 0, 0, 0, 0];
          break;
        default:
          multiclassSpellSlots = [2, 0, 0, 0, 0, 0, 0, 0, 0];
          break;
      }
      computedSpellSlots.max = multiclassSpellSlots.slice(0);
      computedSpellSlots.current = multiclassSpellSlots.slice(0);
    }
  }
  Object.assign(parsedData.spellSlots, computedSpellSlots);

  // Parse HP

  const computedHp = { max: [], current: [] };

  if (rawData.overrideHitPoints) {
    // Use override from ddb if it exists
    computedHp.max = rawData.overrideHitPoints;
    computedHp.current = rawData.overrideHitPoints;
  } else {
    const baseHp = rawData.baseHitPoints;
    const conMod = Math.floor((parsedData.stats.con - 10) / 2);
    let initialHitDie = 0;
    let hpTotal = 0;

    computedClasses.forEach((cls) => {
      const { level, hitDice, isStartingClass } = cls;
      if (isStartingClass) {
        initialHitDie = cls.hitDice;
      }
      if (parsedData.hp.type === 'fixed') {
        // eslint-disable-next-line prettier/prettier
        hpTotal += level * (hitDice / 2 + 1);
      } else {
        hpTotal += level * conMod;
      }
    });

    if (parsedData.hp.type === 'fixed') {
      hpTotal += initialHitDie;
    } else {
      hpTotal += baseHp;
    }
    computedHp.max = hpTotal;
    computedHp.current = hpTotal;
  }
  Object.assign(parsedData.hp, computedHp);

  // Description
  // Class strings
  computedClasses.forEach((cls) => {
    const { name, subName, level } = cls;

    if (subName) {
      parsedData.description.classes.full.push(`${subName} ${name} ${level}`);
    } else {
      parsedData.description.classes.full.push(`${name} ${level}`);
    }
    parsedData.description.classes.withLevel.push(`${name} ${level}`);
    parsedData.description.classes.simple.push(`${name}`);
  });

  return parsedData;
}
