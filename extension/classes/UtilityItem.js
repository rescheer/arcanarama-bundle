export default class UtilityItem {
  constructor(
    itemName,
    type,
    title,
    shortDesc,
    homepage,
    imagePath,
    provider,
    providerImagePath,
    defaultDuration,
    defaultInterval
  ) {
    this.itemName = itemName;
    this.title = title;
    this.type = type;
    this.shortDesc = shortDesc;
    this.homepage = homepage;
    this.imagePath = imagePath;
    this.provider = provider;
    this.providerImagePath = providerImagePath;
    this.defaultDuration = defaultDuration;
    this.defaultInterval = defaultInterval;
  }
}
