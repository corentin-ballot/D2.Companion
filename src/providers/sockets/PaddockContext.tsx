import React, { useContext, createContext, useReducer } from 'react'
import Notifications from '../../utils/notification';

export interface ExchangeMountsPaddockRemoveEvent {
    mountsId: number[]
}

export interface UpdatedCharacteristic {
    characteristic: string
    intValue: number
}

export interface MountUpdateCharacteristicsEvent {
    rideId: number
    updatedCharacteristics: UpdatedCharacteristic[]
}

export interface Effect {
    action: number
    valueInt: number
}

export interface Mount {
    id: string
    modelId: number
    ancestors: number[]
    behaviors: number[]
    name: string
    gender: string
    ownerId: string
    experience: string
    experienceForLevel: string
    experienceForNextLevel: string
    level: number
    isRideable: boolean
    maxPods: number
    isWild: boolean
    stamina: number
    staminaMax: number
    maturity: number
    maturityForAdult: number
    energy: number
    energyMax: number
    serenity: number
    aggressivenessMax: number
    serenityMax: number
    love: number
    loveMax: number
    fertilizationTime: number
    isFertilizationReady: boolean
    boostLimiter: number
    boostMax: string
    reproductionCount: number
    reproductionCountMax: string
    harnessGid: number
    useHarnessColors: boolean
    effects: Effect[]
}

export interface ExchangeMountsPaddockAddedEvent {
    mounts: Mount[]
}

export interface ExchangeMountWithoutPaddockStartedEvent {
    stabledMounts?: Mount[]
    paddockedMounts?: Mount[]
}

interface Notification {
    enable: boolean
    limit: number
}

interface PaddockState {
    mounts: Mount[]
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
        ...JSON.parse(localStorage.getItem("Paddock.notifications") || "{}")
    }
};

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
            const mounts = (action.payload as ExchangeMountWithoutPaddockStartedEvent)?.paddockedMounts || [];
            mounts.forEach(mount => {
                if(mount.ancestors && new Set(mount.ancestors).size > 1) {
                    // new Notifications("A mount is not pure!").sendNative();
                }
            })
            return {
                ...state,
                mounts
            }
        }
        case 'mount_changed': {
            const payload = action.payload as MountUpdateCharacteristicsEvent
            const mount = state.mounts.find(m => parseInt(m.id, 10) === payload.rideId);

            payload.updatedCharacteristics.forEach(i => {
                if (i.characteristic === "SERENITY" && state.notifications.serenity.enable &&  payload.updatedCharacteristics.length <= 2) {
                    if (mount?.gender === "FEMALE") {
                        if ((i.intValue > mount.serenity && i.intValue > 0) || (i.intValue < mount.serenity && i.intValue < -state.notifications.serenity.limit)) {
                            if (Notification.permission === 'granted') new Notifications(`A mount reached serenity limit.`).send();
                        }
                    } else if (mount?.gender === "MALE") {
                        if ((i.intValue < mount.serenity && i.intValue < 0) || (i.intValue > mount.serenity && i.intValue > state.notifications.serenity.limit)) {
                            if (Notification.permission === 'granted') new Notifications(`A mount reached serenity limit.`).send();
                        }
                    }
                } else if (i.characteristic === "ENERGIY" && state.notifications.energy.enable) {
                    if (i.intValue > state.notifications.energy.limit && Notification.permission === 'granted') {
                        new Notifications(`A mount reached energy limit.`).send();
                    }
                } else if (i.characteristic === "LOVE" && state.notifications.love.enable) {
                    if (i.intValue > state.notifications.love.limit && Notification.permission === 'granted') {
                        new Notifications(`A mount reached love limit.`).send();
                    }
                } else if (i.characteristic === "STAMINA" && state.notifications.stamina.enable) {
                    if (i.intValue > state.notifications.stamina.limit && Notification.permission === 'granted') {
                        new Notifications(`A mount reached stamina limit.`).send();
                    }
                } else if (i.characteristic === "MATURITY" && state.notifications.maturity.enable) {
                    if (i.intValue > state.notifications.maturity.limit && Notification.permission === 'granted') {
                        new Notifications(`A mount reached maturity limit.`).send();
                    }
                } else if (i.characteristic === "TIREDNESS" && state.notifications.boostLimiter.enable) {
                    if (i.intValue > state.notifications.boostLimiter.limit && Notification.permission === 'granted') {
                        new Notifications(`A mount reached tiredness limit.`).send();
                    }
                }
            })

            return {
                ...state,
                mounts: state.mounts.map(m => parseInt(m.id, 10) !== payload.rideId ? m : {
                    ...m,
                    ...payload.updatedCharacteristics.reduce((prev, boost) => ({ ...prev, [boost.characteristic === "TIREDNESS" ? "boostLimiter" : boost.characteristic.toString().toLocaleLowerCase()]: boost.intValue }), {})
                })
            }
        }
        case 'mounts_added': {
            return {
                ...state,
                mounts: [...state.mounts, ...action.payload.mounts]
            }
        }
        case 'mounts_removed': {
            return {
                ...state,
                mounts: state.mounts.filter(mount => !action.payload.mountsId.includes(parseInt(mount.id, 10)))
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
        localStorage.setItem('Paddock.notifications', JSON.stringify(state.notifications));
    }, [state.notifications])

    return (
        <PaddockContext.Provider value={state}>
            <PaddockDispatchContext.Provider value={dispatch}>
                {children}
            </PaddockDispatchContext.Provider>
        </PaddockContext.Provider>
    )
}
