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
    creatureGenericId: number|undefined; // undefined for players
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

export interface GameActionFightLifeAndShieldPointsLostMessage extends GameActionFightLifePointsLostMessage{
    shieldLoss: 30 
}

export interface GameActionFightLifePointsLostMessage  {
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