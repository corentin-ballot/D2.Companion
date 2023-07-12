export interface GameActionFightSpellCastMessage {
    name: string;
    actionId: number;
    sourceId: number;
    silentCast: boolean;
    verboseCast: boolean;
    targetId: number;
    destinationCellId: number;
    critical: number;
    spellId: number;
    spellLevel: number;
    portalsIds: number[];
}

export interface ExchangeTypesItemsExchangerDescriptionForUserMessage {
    itemTypeDescriptions: BidExchangerObjectInfo[];
    objectType: number;
}

export interface BidExchangerObjectInfo {
    effects: ObjectEffectInteger[];
    objectGID: number;
    objectType: number;
    objectUID: number;
    prices: number[];
}

export interface ObjectEffectInteger {
    actionId: number;
    value: number;
}

export interface ChatServerMessage {
    name: "ChatServerMessage";
    channel: number;
    content: string;
    timestamp: number;
    fingerprint: string;
    senderId: number;
    senderName: string;
    prefix: string;
    senderAccountId: number;
    objects?: dofusObject[];
    id?: number; // added by app
}

export interface dofusObjectEffect {
    name: "ObjectEffect";
    actionId: number;
    value: number;
}

export interface dofusObject {
    name: string;
    position: number,
    objectGID: number,
    effects: dofusObjectEffect[],
    objectUID: number,
    quantity: number
}

export interface GameFightJoinMessage {
    canBeCancelled: boolean;
    canSayReady: boolean;
    fightType: number;
    isFightStarted: boolean;
    isTeamPhase: boolean;
    timeMaxBeforeFightStart: number;
}

export interface GameFightTurnListMessage {
    deadsIds: number[];
    ids: number[];
}

export interface GameFightSynchronizeMessage {
    fighters: Fighter[];
}

export interface RefreshCharacterStatsMessage {
    fighterId: number;
    stats: FighterStats;
}

export interface FighterStats {
    invisibilityState: number;
    summoned: boolean;
    summoner: number;
    characteristics: Characteristics;
};

export interface Fighter {
    contextualId: number;
    creatureGenericId: number | undefined; // undefined for players
    name: string; // GameContextActorPositionInformations for monsters, player name else
    stats: FighterStats;
    breed?: number;
    sex?: boolean;
    masterId?: number; // compagnon
    entityModelId?: number; // compagnon
    disposition?: Disposition;
    look?: Look;
    spawnInfo: SpawnInfo;
    wave: number;
    previousPositions: any[];
    level: number;
    creatureGrade?: number;
    creatureLevel?: number;
    status: Status;
    leagueId?: number;
    ladderPosition?: number;
    hiddenInPrefight?: boolean;
    alignmentInfos?: AlignmentInfos;
    img?: string;
}

export interface AlignmentInfos {
    alignmentSide: number;
    alignmentValue: number;
    alignmentGrade: number;
    characterPower: number;
}

export interface Status {
    statusId: number;
}

export interface SpawnInfo {
    teamId: number;
    alive: boolean;
    informations: Informations;
}

export interface Informations {
    contextualId: number;
    disposition: Disposition;
}

export interface Disposition {
    cellId: number;
    direction: number;
    carryingCharacterId: number;
}

export interface Look {
    bonesId: number;
    skins: number[];
    indexedColors: number[];
    scales: number[];
    subentities: Subentity[];
}

export interface Subentity {
    bindingPointCategory: number;
    bindingPointIndex: number;
    subEntityLook: SubEntityLook;
}

export interface SubEntityLook {
    bonesId: number;
    skins: any[];
    indexedColors: any[];
    scales: any[];
    subentities: any[];
}

export interface GameFightNewRoundMessage {
    roundNumber: number;
}

export interface GameFightEndMessage {
    duration: number;
    lootShareLimitMalus: number;
    results: []; // contains loots, participants, etc.
    rewardRate: number;
}

export interface GameActionFightLifeAndShieldPointsLostMessage extends GameActionFightLifePointsLostMessage {
    shieldLoss: 30
}

export interface GameActionFightLifePointsLostMessage {
    actionId: number;
    sourceId: number;
    targetId: number;
    loss: number;
    permanentDamages: number;
    elementId: number;
}

export interface GameActionFightMultipleSummonMessage {
    actionId: number;
    sourceId: number;
    summons: Summon[];
}

export interface Summon {
    spawnInformation: SpawnInformation;
    wave: number;
    look: Look;
    stats: SummonStats;
    summons: SummonInfo[];
}

export interface SummonInfo {
    teamId: number;
    alive: boolean;
    informations: Informations;
}

export interface Informations {
    contextualId: number;
    disposition: Disposition;
}

export interface SummonStats {
    characteristics: Characteristics;
    summoner: number;
    summoned: boolean;
    invisibilityState: number;
}

export interface Characteristics {
    characteristics: Characteristic[];
}

export interface Characteristic {
    characteristicId: number;
    total: number; // for monsters
    additional?: number; // for players
    alignGiftBonus?: number; // for players
    base?: number; // for players
    contextModif?: number; // for players
    objectsAndMountBonus?: number; // for players
}

export interface SpawnInformation {
    creatureGenericId: number;
    creatureGrade: number;
}

// BREEDING
export interface Durability {
    durability: number;
    durabilityMax: number;
}

export interface PaddockItemDescription {
    cellId: number;
    objectGID: number;
    durability: Durability;
}

export interface GameDataPaddockObjectAddMessage {
    paddockItemDescription: PaddockItemDescription;
}

export interface EffectList {
    actionId: number;
    value: number;
}

export interface MountsDescription {
    sex: boolean;
    isRideable: boolean;
    isWild: boolean;
    isFecondationReady: boolean;
    useHarnessColors: boolean;
    id: number;
    model: number;
    ancestor: number[];
    behaviors: any[];
    name: string;
    ownerId: number;
    experience: number;
    experienceForLevel: number;
    experienceForNextLevel: number;
    level: number;
    maxPods: number;
    stamina: number;
    staminaMax: number;
    maturity: number;
    maturityForAdult: number;
    energy: number;
    energyMax: number;
    serenity: number;
    aggressivityMax: number;
    serenityMax: number;
    love: number;
    loveMax: number;
    fecondationTime: number;
    boostLimiter: number;
    boostMax: number;
    reproductionCount: number;
    reproductionCountMax: number;
    harnessGID: number;
    effectList: EffectList[];
}

export interface ExchangeStartOkMountMessage {
    stabledMountsDescription: MountsDescription[];
    paddockedMountsDescription: MountsDescription[];
}

export interface BoostToUpdateList {
    type: number;
    value: number;
}

export enum BoostToUpdateType {
    energy = 1,         // sérénité
    serenity = 2,       // sérénité
    stamina = 3,        // endurance
    love = 4,           // amour
    maturity = 5,       // maturité
    boostLimiter = 6,   // fatigue
}

export interface UpdateMountCharacteristicsMessage {
    rideId: number;
    boostToUpdateList: BoostToUpdateList[];
}

export interface ExchangeMountsPaddockAddMessage {
    mountDescription: MountsDescription[];
}

export interface ExchangeMountsPaddockRemoveMessage {
    mountsId: number[];
}

export interface Objective {
    objectiveId: number;
    objectiveStatus: boolean;
    dialogParams: any[];
    curCompletion?: number;
    maxCompletion?: number;
}

export interface ActiveQuest {
    questId: number;
    stepId: number;
    objectives: Objective[];
}

export interface QuestListMessage {
    finishedQuestsIds: number[];
    finishedQuestsCounts: number[];
    activeQuests: ActiveQuest[];
    reinitDoneQuestsIds: number[];
}

// FM / craft
export interface ExchangeObjectAddedMessage {
    remote: boolean;
    object: ObjectInfo;
}

export interface ObjectInfo {
    position?: number;
    objectGID: number;
    effects: ObjectEffectInteger[];
    objectUID: number;
    quantity: number;
}

export interface ExchangeCraftResultMagicWithObjectDescMessage {
    craftResult: number;
    objectInfo: ObjectInfo;
    magicPoolStatus: number;
}

export interface FinishedObjective {
    id: number;
    maxValue: number;
}

export interface StartedObjective {
    id: number;
    maxValue: number;
    value: number;
}

export interface StartedAchievement {
    id: number;
    finishedObjective: FinishedObjective[];
    startedObjectives: StartedObjective[];
}

export interface FinishedObjective2 {
    id: number;
    maxValue: number;
}

export interface FinishedAchievement {
    id: number;
    finishedObjective: FinishedObjective2[];
    startedObjectives: any[];
}

export interface AchievementDetailedListMessage {
    startedAchievements: StartedAchievement[];
    finishedAchievements: FinishedAchievement[];
}

// HOUSES

export interface OwnerTag {
    nickname: string;
    tagNumber: string;
}

export interface Properties {
    secondHand: boolean;
    isLocked: boolean;
    hasOwner: boolean;
    isSaleLocked: boolean;
    isAdminLocked: boolean;
    instanceId: number;
    ownerTag: OwnerTag;
    price: number;
}

export interface HousePropertiesMessage {
    houseId: number;
    doorsOnMap: number[];
    properties: Properties;
}

/**
 * Character
 */
export interface CharacterSelectedSuccessMessage {
    infos: Infos
    isCollectingStats: boolean
}

export interface Infos {
    id: number
    name: string
    level: number
    entityLook: EntityLook
    breed: number
    sex: boolean
}

export interface EntityLook {
    bonesId: number
    skins: number[]
    indexedColors: number[]
    scales: number[]
    subentities: Subentity[]
}

export interface Subentity {
    bindingPointCategory: number
    bindingPointIndex: number
    subEntityLook: SubEntityLook
}

export interface SubEntityLook {
    bonesId: number
    skins: any[]
    indexedColors: any[]
    scales: any[]
    subentities: any[]
}

export interface StorageInventoryContentMessage {
    objects: Object[]
    kamas: number
}

export interface Object {
    position: number
    objectGID: number
    effects: Effect[]
    objectUID: number
    quantity: number
}

export interface Effect {
    // Equipments
    actionId: number
    diceNum?: number
    diceSide?: number
    diceConst?: number
    value: any
    min?: number
    max?: number
    // Mounts
    sex?: boolean
    isRideable?: boolean
    isFeconded?: boolean
    isFecondationReady?: boolean
    id?: number
    expirationDate?: number
    model?: number
    name?: string
    owner?: string
    level?: number
    reproductionCount?: number
    reproductionCountMax?: number
    effects?: any[]
    capacities?: number[]
}

export interface TextInformationMessage {
    msgType: number
    msgId: number
    parameters: string[]
}

export interface ExchangeOfflineSoldItemsMessage {
    bidHouseItems: BidHouseItem[]
}

export interface BidHouseItem {
    objectGID: number
    quantity: number
    price: number
    effects: Effects
    date: number
}

export interface Effects {
    effects: Effect[]
}

export interface ExchangeBidHouseUnsoldItemsMessage {
    items: Item[]
  }
  
  export interface Item {
    objectGID: number
    quantity: number
  }