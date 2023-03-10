import { getContext } from '../util/nodecg-api-context';

function getStatBonuses(modArray) {
  const result = [0, 0, 0, 0, 0, 0];

  modArray.forEach((modType) => {
    modType.forEach((mod) => {
      switch (mod.subType) {
        case 'strength-score':
          result[0] += mod.value;
          break;
        case 'dexterity-score':
          result[1] += mod.value;
          break;
        case 'constitution-score':
          result[2] += mod.value;
          break;
        case 'intelligence-score':
          result[3] += mod.value;
          break;
        case 'wisdom-score':
          result[4] += mod.value;
          break;
        case 'charisma-score':
          result[5] += mod.value;
          break;
        default:
          break;
      }
    });
  });

  return result;
}

export default function parseDDBData(id) {
  const replicant = getContext().Replicant(id);
  const { value: rawData } = replicant;
  const parsedData = {
    fullName: '',
    hp: {
      max: '',
      current: '',
      temp: '',
      tempMax: '',
      type: '',
    },
    ac: '',
    condition: [],
    isSpellcaster: false,
    spellSlots: {
      max: [],
      current: [],
    },
    deathSaves: {
      successes: '',
      failures: '',
      stable: true,
    },
    stats: {
      str: 0,
      dex: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    },
    race: '',
    classes: [],
    totalLevel: 0,
    classString: '',
    avatarUrl: '',
  };

  // Modifiers
  const { race: raceMods } = rawData.modifiers;
  const { class: classMods } = rawData.modifiers;
  const { background: backgroundMods } = rawData.modifiers;
  const { item: itemMods } = rawData.modifiers;
  const { feat: featMods } = rawData.modifiers;

  const modsArray = [raceMods, classMods, backgroundMods, itemMods, featMods];

  // Parse Name
  parsedData.fullName = rawData.name;

  // Parse AC

  // Parse Stats
  const statMod = getStatBonuses(modsArray);
  const computedStats = {
    str: rawData.stats[0].value + statMod[0],
    dex: rawData.stats[1].value + statMod[1],
    con: rawData.stats[2].value + statMod[2],
    int: rawData.stats[3].value + statMod[3],
    wis: rawData.stats[4].value + statMod[4],
    cha: rawData.stats[5].value + statMod[5],
  };
  Object.assign(parsedData.stats, computedStats);

  // Parse Race
  parsedData.race = rawData.race.fullName;

  // Parse Classes and Spellslots (Non-multiclass)
  const computedClasses = [];
  rawData.classes.forEach((cls) => {
    const {
      name: baseName,
      hitDice,
      canCastSpells: isSpellcaster,
    } = cls.definition;
    const { level, isStartingClass } = cls;
    let spellSlots;
    let multiClassSpellSlotDivisor;

    if (isSpellcaster) {
      parsedData.isSpellcaster = true;
      spellSlots = cls.definition.spellRules.levelSpellSlots[level].slice(0);
      multiClassSpellSlotDivisor =
        cls.definition.spellRules.multiClassSpellSlotDivisor;
    }

    let subName;
    if (cls.subclassDefinition?.name) {
      subName = cls.subclassDefinition.name;
    }

    const newClass = {
      name: baseName,
      subName,
      level,
      isSpellcaster,
      isStartingClass,
      hitDice,
      spellSlots,
      multiClassSpellSlotDivisor,
    };

    computedClasses.push(newClass);
  });
  parsedData.classes = computedClasses.slice(0);

  // Parse Spellslots (Multiclass)
  const spellcasterClasses = [];
  let spellcasterLevels = 0;
  computedClasses.forEach((cls) => {
    if (cls.isSpellcaster) {
      const divisor = cls.multiClassSpellSlotDivisor;
      const { level } = cls;
      spellcasterClasses.push(cls);
      spellcasterLevels += Math.floor(level / divisor);
    }
  });
  if (spellcasterClasses.length > 0) {
    // Caster
    if (spellcasterClasses.length === 1) {
      // Single caster class
      parsedData.spellSlots.max = computedClasses.spellSlots.slice(0);
      parsedData.spellSlots.current = computedClasses.spellSlots.slice(0);
    } else {
      // Multiclass Caster
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
      parsedData.spellSlots.max = multiclassSpellSlots.slice(0);
      parsedData.spellSlots.current = multiclassSpellSlots.slice(0);
    }
  }

  // Parse HP
  // TODO: Check modifier array for hp bonuses
  parsedData.hp.type =
    rawData.preferences.hitPointType === 2 ? 'manual' : 'fixed';

  if (rawData.overrideHitPoints) {
    // Use override from ddb if it exists
    parsedData.hp.max = rawData.overrideHitPoints;
    parsedData.hp.current = rawData.overrideHitPoints;
  } else {
    const hpType = parsedData.hp.type;
    const baseHp = rawData.baseHitPoints;
    const conMod = Math.floor((parsedData.stats.con - 10) / 2);
    let initialHitDie = 0;
    let hpTotal = 0;

    computedClasses.forEach((cls) => {
      const { level, hitDice } = cls;
      if (cls.isStartingClass) {
        initialHitDie = cls.hitDice;
      }
      if (hpType === 'fixed') {
        // eslint-disable-next-line prettier/prettier
        hpTotal += level * (hitDice / 2 + 1);
      } else {
        hpTotal += level * conMod;
      }
    });

    if (hpType === 'fixed') {
      hpTotal += initialHitDie;
    } else {
      hpTotal += baseHp;
    }
    parsedData.hp.max = hpTotal;
    parsedData.hp.current = hpTotal;
  }

  // Parse Avatar
  parsedData.avatarUrl = rawData.avatarUrl;

  // Misc Utilities
  // Create readable string of classes and levels
  const classInfoArray = [];
  let totalLevel = 0;
  computedClasses.forEach((cls) => {
    classInfoArray.push(`${cls.name}`);
    totalLevel += cls.level;
  });
  parsedData.classString = classInfoArray.toString().replace(/,/gi, '/').trim();
  parsedData.totalLevel = totalLevel;

  return parsedData;
}
