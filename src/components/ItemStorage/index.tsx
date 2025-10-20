/* eslint-disable no-nested-ternary */
import { Avatar, TableCell, TableRow } from "@mui/material";
import { Object } from "../../providers/sockets/StorageContext";
import useDofusItem from "../../hooks/dofus-data/useDofusItem";
import useDofusMonsters from "../../hooks/dofus-data/.useDofusMonsters";


const ItemStorage = ({ object }: {object: Object}) => {
    const itemRequest = useDofusItem(parseInt(object.item.gid, 10));
    const monsters = useDofusMonsters().data;

    const name = parseInt(object.item.gid, 10) === 10418 ? `Archi-monstre : ${monsters?.find(m => m.id === object.item?.effects[0]?.dice?.const)?.name}` 
                : parseInt(object.item.gid, 10) === 7010 ? `Âme : ${monsters?.find(m => m.id === object.item?.effects[0]?.dice?.const)?.name}` 
                : itemRequest.data ? itemRequest.data.name.fr : 'loading...';

    return <TableRow data-id={object.item.gid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell>
            <Avatar sx={{ width: 32, height: 32, margin: "auto" }} variant="square" src={itemRequest.data ? `http://localhost:3960/images/items/${itemRequest.data?.iconId}` : ''} alt={itemRequest.data?.name.fr} />
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell align="right">{itemRequest.data?.level || ''}</TableCell>
        <TableCell align="right">{new Intl.NumberFormat().format(object.item.quantity)}</TableCell>
    </TableRow>
}

export default ItemStorage;