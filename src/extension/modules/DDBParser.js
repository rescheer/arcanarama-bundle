import { getContext } from '../util/nodecg-api-context';

function getStatById(id) {
  let result;
  switch (id) {
    case 1:
      // Strength
      result = 'str';
      break;
    case 2:
      // Dexterity
      result = 'dex';
      break;
    case 3:
      // Constitution
      result = 'con';
      break;
    case 4:
      // Intelligence
      result = 'int';
      break;
    case 5:
      // Wisdom
      result = 'wis';
      break;
    case 6:
      // Charisma
      result = 'cha';
      break;
    default:
      break;
  }

  return result;
}

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
      max: 0,
      current: 0,
      temp: 0,
      tempMax: 0,
      type: 0,
    },
    ac: {
      base: 0,
      bonuses: [],
    },
    condition: {
      blinded: false,
      charmed: false,
      deafened: false,
      frightened: false,
      grappled: false,
      incapacitated: false,
      invisible: false,
      paralyzed: false,
      petrified: false,
      poisoned: false,
      prone: false,
      restrained: false,
      stunned: false,
      unconscious: false,
      exhaustionLevel: 0,
    },
    deathSaves: {
      successes: 0,
      failures: 0,
      stable: true,
    },
    isSpellcaster: false,
    spellSlots: {
      max: [],
      current: [],
    },
    items: {
      attuned: [],
      equipped: {
        weapons: [],
        armor: [],
        other: [],
      },
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

  // Inventory iterator
  const equippedWeapons = [];
  const equippedArmor = [];
  const equippedOther = [];
  const attunedItems = [];
  rawData.inventory.forEach((item) => {
    const { name, description, filterType, type, rarity } = item.definition;
    const entry = { name, description, filterType, type, rarity };

    // Get attuned items
    if (item.isAttuned) {
      attunedItems.push(entry);
    }

    // Get equipped items
    if (item.equipped && +item.equippedEntityId === +id) {
      switch (filterType) {
        case 'Armor':
          entry.armorClass = item.definition.armorClass;
          entry.armorTypeId = item.definition.armorTypeId;
          equippedArmor.push(entry);
          break;
        case 'Weapon':
          entry.damage = item.definition?.damage?.diceString;
          entry.damageType = item.definition?.damageType;
          equippedWeapons.push(entry);
          break;
        default:
          equippedOther.push(entry);
          break;
      }
    }
  });
  parsedData.items.attuned = attunedItems;
  parsedData.items.equipped.armor = equippedArmor;
  parsedData.items.equipped.weapons = equippedWeapons;
  parsedData.items.equipped.other = equippedOther;

  // Grab simple data
  parsedData.fullName = rawData.name;
  parsedData.race = rawData.race.fullName;
  parsedData.avatarUrl =
    rawData.avatarUrl ||
    'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png';
  parsedData.hp.type =
    rawData.preferences.hitPointType === 2 ? 'manual' : 'fixed';

  // Parse Stats
  const computedStats = {
    str: rawData.stats[0].value,
    dex: rawData.stats[1].value,
    con: rawData.stats[2].value,
    int: rawData.stats[3].value,
    wis: rawData.stats[4].value,
    cha: rawData.stats[5].value,
  };

  // Modifier iterator
  let modAc = 0;
  let bonusHpPerLevel = 0;
  const unarmoredDefenseStats = [];
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
        case 'armor-class':
          modAc += mod.value;
          break;
        case 'unarmored-armor-class':
          unarmoredDefenseStats.push(mod.statId);
          break;
        case 'hit-points-per-level':
          bonusHpPerLevel = mod.value;
          break;
        default:
          break;
      }
    });
  });

  // Check for stat overrides
  rawData.overrideStats.forEach((overrideStat, index) => {
    if (overrideStat.value) {
      const type = getStatById(index);
      computedStats[type] = overrideStat.value;
    }
  });

  // Check for bonus stats
  rawData.bonusStats.forEach((bonusStat, index) => {
    if (bonusStat.value) {
      const type = getStatById(index);
      computedStats[type] += bonusStat.value;
    }
  });
  Object.assign(parsedData.stats, computedStats);

  // Parse AC
  let armorAc = 10;
  let isWearingArmor = false;
  let shieldAc = 0;
  let isWearingShield = false;

  const dexMod = Math.floor((parsedData.stats.dex - 10) / 2);
  // armorTypeId:
  // 1: light (full dex bonus)
  // 2: medium(max + 2 dex bonus)
  // 3: heavy (0 dex bonus)
  // 4: shield
  equippedArmor.forEach((armor) => {
    switch (armor.armorTypeId) {
      case 1:
        // Light armor (full dex bonus)
        isWearingArmor = true;
        armorAc = armor.armorClass + dexMod;
        break;
      case 2:
        // Medium armor (max +2 dex bonus)
        isWearingArmor = true;
        armorAc = armor.armorClass + (dexMod >= 2 ? 2 : dexMod);
        break;
      case 3:
        // Heavy armor (0 dex bonus)
        isWearingArmor = true;
        armorAc = armor.armorClass;
        break;
      case 4:
        // Shield
        isWearingShield = true;
        shieldAc += armor.armorClass;
        break;
      default:
        getContext.sendMessage('console', {
          type: 'warn',
          msg: `[Parser] Unknown armorTypeId found (type ${armor.armorTypeId}) on item "${armor.name}" of type "${armor.type}"`,
        });
        break;
    }
  });

  if (unarmoredDefenseStats.length > 0) {
    const unarmoredDefenseValues = [];

    unarmoredDefenseStats.forEach((statId) => {
      const unarmoredBonusStat = getStatById(statId);

      if (unarmoredBonusStat === 'wis') {
        // Monk - either shield or armor negates bonus
        if (!isWearingArmor && !isWearingShield) {
          unarmoredDefenseValues.push(
            Math.floor((parsedData.stats[unarmoredBonusStat] - 10) / 2)
          );
        }
      }

      if (unarmoredBonusStat === 'con') {
        // Barbarian - armor negates bonus
        if (!isWearingArmor) {
          unarmoredDefenseValues.push(
            Math.floor((parsedData.stats[unarmoredBonusStat] - 10) / 2)
          );
        }
      }
    });

    const highestValue = Math.max(...unarmoredDefenseValues);
    parsedData.ac.base = armorAc + shieldAc + dexMod + modAc + highestValue;
  } else {
    parsedData.ac.base = armorAc + shieldAc + modAc;
  }

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
  computedClasses.forEach((cls, index) => {
    if (cls.canCastSpells) {
      const divisor = cls.multiClassSpellSlotDivisor;
      const { level } = cls;
      spellcasterClasses.push(index);
      spellcasterLevels += Math.floor(level / divisor);
    }
  });

  if (spellcasterClasses.length > 0) {
    // Is a caster
    if (spellcasterClasses.length === 1) {
      // Has only a single caster class
      computedSpellSlots.max =
        computedClasses[spellcasterClasses[0]].spellSlots.slice(0);
      computedSpellSlots.current =
        computedClasses[spellcasterClasses[0]].spellSlots.slice(0);
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

      // 'Tough' feat handling
      if (bonusHpPerLevel >= 0) {
        hpTotal += level * bonusHpPerLevel;
      }

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
