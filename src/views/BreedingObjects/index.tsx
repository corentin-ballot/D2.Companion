import React from 'react';
import { Box, Paper, GridLegacy, TableRow, TableCell, Avatar, TableContainer, TableBody, Table, TableHead } from '@mui/material';
import useDofusItem, { Item } from '../../hooks/dofus-data/useDofusItem';

const TableHeader = ({iconId}: {iconId: number|undefined}) => <TableHead >
    <TableRow>
        <TableCell sx={{ width: "0px" }}>
            <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={iconId ? `http://localhost:3960/images/items/${iconId}` : ''} alt="" />
        </TableCell>
        <TableCell>Name</TableCell>
        <TableCell align="right">Level</TableCell>
        <TableCell align="right">Price</TableCell>
        <TableCell align="right">Usage</TableCell>
        <TableCell align="right">Efficiency</TableCell>
        <TableCell align="right">Ratio</TableCell>
        {/* <TableCell align="right">Recycling</TableCell> */}
    </TableRow>
</TableHead>

const BredingItem = ({ item }: { item: Item | undefined }) => {
    if (typeof item === "undefined") return null;
    const usage = item?.possibleEffects?.find(e => e.effectId === 812)?.diceConst || -1;
    const efficiency = item?.possibleEffects?.find(e => e.effectId === 1007)?.diceConst || -1;

    return <TableRow data-id={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell>
            <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={item ? `http://localhost:3960/images/items/${item?.iconId}` : ''} alt={item?.name?.fr} />
        </TableCell>
        <TableCell>{item?.name?.fr}</TableCell>
        <TableCell align="right">{item?.level || ''}</TableCell>
        <TableCell align="right">{item?.recipeEstimatedPrice}</TableCell>
        <TableCell align="right">{usage || ''}</TableCell>
        <TableCell align="right">{efficiency || ''}</TableCell>
        <TableCell align="right">{Math.round(item.recipeEstimatedPrice ? (usage * efficiency)/item.recipeEstimatedPrice : 0)}</TableCell>
        {/* <TableCell align="right">{Math.round(100* (item?.recyclingNuggets||0)*0.3)/100}</TableCell> */}
    </TableRow>
}

const BreedingObjects = () => {
    const mangeoiresIds = [7621,14772,14775,14776,14777,14778,14779,14780,14781,14782,14783,14784,14794,17740,19931,19932,21518,22176,24138,26805,27407]
    const caresseursIds = [14759,14761,14762,14763,14764,14765,14766,14767,14768,14769,14770,14771,14793,15707,16289,17739,19930,21519,26109,27452]
    const baffeursIds = [7766,14732,14734,14736,14737,14738,14739,14740,14741,14742,14743,14791,15096,15277,15708,16291,17038,19925,19926,22179,24140]
    const dragofessesIds = [14744,14746,14749,14750,14751,14752,14753,14754,14755,14756,14757,14787,14792,14976,15275,15363,16290,19928,19929,24139,24141]
    const foudroeursIds = [7789,14719,14722,14724,14725,14726,14727,14728,14729,14730,14731,14785,14790,15706,17738,19922,19923,19924,22180]
    const abreuvoirsIds = [7604,14707,14708,14709,14711,14712,14713,14714,14715,14716,14717,14718,14789,15709,19917,19918,19919,19927,22178,25319]
    
    const sortFunction = (a: Item | undefined, b: Item | undefined) => {
        const ausage = a?.possibleEffects?.find(e => e.effectId === 812)?.diceConst || -1;
        const aefficiency = a?.possibleEffects?.find(e => e.effectId === 1007)?.diceConst || -1;
        const busage = b?.possibleEffects?.find(e => e.effectId === 812)?.diceConst || -1;
        const befficiency = b?.possibleEffects?.find(e => e.effectId === 1007)?.diceConst || -1;
        
        return (b?.recipeEstimatedPrice? (busage * befficiency)/(b?.recipeEstimatedPrice || -1) : -1) - (a?.recipeEstimatedPrice? (ausage * aefficiency)/(a?.recipeEstimatedPrice || -1) : -1)
    }

    const mangeoires = mangeoiresIds.map(id => useDofusItem(id).data).sort(sortFunction);
    const caresseurs = caresseursIds.map(id => useDofusItem(id).data).sort(sortFunction);
    const baffeurs = baffeursIds.map(id => useDofusItem(id).data).sort(sortFunction);
    const dragofesses = dragofessesIds.map(id => useDofusItem(id).data).sort(sortFunction);
    const foudroeurs = foudroeursIds.map(id => useDofusItem(id).data).sort(sortFunction);
    const abreuvoirs = abreuvoirsIds.map(id => useDofusItem(id).data).sort(sortFunction);

    return <Box sx={{ flexGrow: 1 }}>
        <GridLegacy container spacing={2}>
            {/* mangeoires */}
            <GridLegacy item xs={6}>
                <TableContainer component={Paper} sx={{ maxHeight: 300}}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                        <TableHeader iconId={mangeoires[0]?.iconId} />
                        <TableBody>
                            {mangeoires.map(mangeoire => <BredingItem key={mangeoire?.id} item={mangeoire} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridLegacy>
            {/* caresseurs */}
            <GridLegacy item xs={6}>
                <TableContainer component={Paper} sx={{ maxHeight: 300}}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                        <TableHeader iconId={caresseurs[0]?.iconId} />
                        <TableBody>
                            {caresseurs.map(caresseur => <BredingItem key={caresseur?.id} item={caresseur} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridLegacy>
            {/* baffeurs */}
            <GridLegacy item xs={6}>
                <TableContainer component={Paper} sx={{ maxHeight: 300}}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                        <TableHeader iconId={baffeurs[0]?.iconId} />
                        <TableBody>
                            {baffeurs.map(baffeur => <BredingItem key={baffeur?.id} item={baffeur} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridLegacy>
            {/* dragofesses */}
            <GridLegacy item xs={6}>
                <TableContainer component={Paper} sx={{ maxHeight: 300}}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                        <TableHeader iconId={dragofesses[0]?.iconId} />
                        <TableBody>
                            {dragofesses.map(dragofesse => <BredingItem key={dragofesse?.id} item={dragofesse} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridLegacy>
            {/* foudroeurs */}
            <GridLegacy item xs={6}>
                <TableContainer component={Paper} sx={{ maxHeight: 300}}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                        <TableHeader iconId={foudroeurs[0]?.iconId} />
                        <TableBody>
                            {foudroeurs.map(foudroeur => <BredingItem key={foudroeur?.id} item={foudroeur} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridLegacy>
            {/* abreuvoirs */}
            <GridLegacy item xs={6}>
                <TableContainer component={Paper} sx={{ maxHeight: 300}}>
                    <Table size="small" aria-label="a dense table" stickyHeader>
                        <TableHeader iconId={abreuvoirs[0]?.iconId} />
                        <TableBody>
                            {abreuvoirs.map(abreuvoir => <BredingItem key={abreuvoir?.id} item={abreuvoir} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </GridLegacy>

        </GridLegacy>
    </Box>
}

export default BreedingObjects;