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
    characteristics: {
        characteristics: [{
            characteristicId: number;
            total: number; // for monsters
            additional: number; // for players
            alignGiftBonus: number; // for players
            base: number; // for players
            contextModif: number; // for players
            objectsAndMountBonus: number; // for players
        }]
    }
};

export interface Fighter {
    contextualId: number;
    creatureGenericId: number|undefined; // undefined for players
    name: string; // GameContextActorPositionInformations for monsters, player name else
    stats: FighterStats;
    breed?: number;
    sex?: boolean;
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
    actionId: 181
    sourceId: 123783741662
    summons: [{
        spawnInformation: {creatureGenericId: number;};
        stats: FighterStats;
        summons: [{
            teamId: number;
            alive: boolean;
            informations: {
                contextualId: number;
            }
        }]
    }]
}

export const equipmentStats = new Map([
    [111, "PA"],
    [112, "Dommages"],
    [115, "crit"],
    [116, "-PO"],
    [117, "PO"],
    [118, "force"],
    [119, "Agilité"],
    [123, "Chance"],
    [124, "Sagesse"],
    [125, "Vitalité"],
    [126, "Intelligence"],
    [128, "PM"],
    [138, "puissance"],
    [152, "-Chance"],
    [154, "-Agi"],
    [155, "-Intel"],
    [157, "-Force"],
    [158, "Pods"],
    [161, "esquive PM"],
    [176, "Prospection"],
    [182, "Invocation"],
    [210, "% Résistance Terre"],
    [211, "% Résistance Eau"],
    [212, "% Résistance Air"],
    [213, "% Résistance Feu"],
    [412, "ret PM"],
    [416, "res pou"],
    [418, "Dommages crit"],
    [420, "Résistance Critiques"],
    [422, "Dommages Terre"],
    [424, "Dommages Feu"],
    [430, "Dommages Neutre"],
    [752, "fuite"],
    [753, "tacle"],
    [754, "-fuite"],
    [2800, "% dmg cac"],
    [2801, "-% dmg cac"],
    [2804, "% dmg dist"],
    [2806, "-% res dist"],
]);