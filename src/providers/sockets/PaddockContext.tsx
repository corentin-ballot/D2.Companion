import React, { useContext, createContext, useReducer } from 'react'
import Notifications from '../../utils/notification';

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

// eslint-disable-next-line no-shadow
export enum BoostToUpdateType {
    // eslint-disable-next-line no-unused-vars
    energy = 1,         // sérénité
    // eslint-disable-next-line no-unused-vars
    serenity = 2,       // sérénité
    // eslint-disable-next-line no-unused-vars
    stamina = 3,        // endurance
    // eslint-disable-next-line no-unused-vars
    love = 4,           // amour
    // eslint-disable-next-line no-unused-vars
    maturity = 5,       // maturité
    // eslint-disable-next-line no-unused-vars
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


interface Notification {
    enable: boolean
    limit: number
}

interface PaddockState {
    mounts: MountsDescription[]
    notifications: {
        serenity: Notification
        love: Notification
        stamina: Notification
        maturity: Notification
        energy: Notification
        boostLimiter: Notification
    }
}

const initialState: PaddockState = {
    mounts: [],
    notifications: {
        serenity: { enable: false, limit: 1500 },
        love: { enable: false, limit: 7500 },
        stamina: { enable: false, limit: 7500 },
        maturity: { enable: false, limit: 10000 },
        energy: { enable: false, limit: 5000 },
        boostLimiter: { enable: false, limit: 240 },
        ...JSON.parse(localStorage.getItem("Breeding.notifications") || "{}")
    }
};;

const PaddockContext = createContext<PaddockState>(initialState)
export const usePaddock = (): PaddockState => useContext(PaddockContext)

const PaddockDispatchContext = createContext<React.Dispatch<any>>(() => null)
export const usePaddockDispatch = (): React.Dispatch<any> => useContext(PaddockDispatchContext)

const reducer = (state: PaddockState, action: { type: string, payload: any }): PaddockState => {
    switch (action.type) {
        case 'object_changed': {
            if (action.payload.paddockItemDescription.durability.durability === 0) {
                const message = `Paddock item reach ${action.payload.paddockItemDescription.durability.durability} durability`;
                if (Notification.permission === 'granted') {
                    new Notifications(message).send();
                }
            }
            return state
        }
        case 'paddock_changed': {
            return {
                ...state,
                mounts: action.payload.paddockedMountsDescription as MountsDescription[]
            }
        }
        case 'mount_changed': {
            const payload = action.payload as UpdateMountCharacteristicsMessage
            const mount = state.mounts.find(m => m.id === payload.rideId);

            if (state.notifications.serenity.enable && payload.boostToUpdateList.filter(boost =>
                boost.type === BoostToUpdateType.serenity &&
                (
                    // @ts-ignore Female
                    (mount?.sex && ((boost.value > mount[BoostToUpdateType[boost.type]] && boost.value > 0) || (boost.value < mount[BoostToUpdateType[boost.type]] && boost.value < -state.notifications.serenity.limit)))
                    ||
                    // @ts-ignore Male
                    (!mount?.sex && ((boost.value < mount[BoostToUpdateType[boost.type]] && boost.value < 0) || (boost.value > mount[BoostToUpdateType[boost.type]] && boost.value > state.notifications.serenity.limit)))
                )
            ).length > 0) {
                if (Notification.permission === 'granted') new Notifications(`A mount reached serenity limit.`).send();
            }

            if (state.notifications.energy.enable && payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.energy && boost.value >= state.notifications.energy.limit).length > 0) {
                if (Notification.permission === 'granted') new Notifications(`A mount reached energy limit.`).send();
            }

            if (state.notifications.love.enable && payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.love && boost.value >= state.notifications.love.limit).length > 0) {
                if (Notification.permission === 'granted') new Notifications(`A mount reached love limit.`).send();
            }

            if (state.notifications.stamina.enable && payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.stamina && boost.value >= state.notifications.stamina.limit).length > 0) {
                if (Notification.permission === 'granted') new Notifications(`A mount reached stamina limit.`).send();
            }

            if (state.notifications.maturity.enable && payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.maturity && boost.value >= state.notifications.maturity.limit).length > 0) {
                if (Notification.permission === 'granted') new Notifications(`A mount reached maturity limit.`).send();
            }

            if (state.notifications.boostLimiter.enable && payload.boostToUpdateList.filter(boost => boost.type === BoostToUpdateType.boostLimiter && boost.value >= state.notifications.boostLimiter.limit).length > 0) {
                if (Notification.permission === 'granted') new Notifications(`A mount reached tiredness limit.`).send();
            }

            return {
                ...state,
                mounts: state.mounts.map(m => m.id !== payload.rideId ? m : {
                    ...m,
                    ...payload.boostToUpdateList.reduce((prev, boost) => ({ ...prev, [BoostToUpdateType[boost.type]]: boost.value }), {})
                })
            }
        }
        case 'mounts_added': {
            return {
                ...state,
                mounts: [...state.mounts, ...action.payload.mountDescription]
            }
        }
        case 'mounts_removed': {
            return {
                ...state,
                mounts: [...state.mounts.filter(mount => !action.payload.mountsId.includes(mount.id))]
            }
        }
        case 'notifications_changed': {
            return {
                ...state,
                notifications: action.payload
            }
        }
        default: {
            throw Error(`PaddockContext unknown action: ${action.type}`)
        }
    }
}

interface PaddockProviderProps {
    children: React.ReactElement
}

export const PaddockProvider = ({ children }: PaddockProviderProps): React.ReactElement => {
    const [state, dispatch] = useReducer(reducer, initialState)

    React.useEffect(() => {
        localStorage.setItem('Breeding.notifications', JSON.stringify(state.notifications));
    }, [state.notifications])

    return (
        <PaddockContext.Provider value={state}>
            <PaddockDispatchContext.Provider value={dispatch}>
                {children}
            </PaddockDispatchContext.Provider>
        </PaddockContext.Provider>
    )
}
