import React from 'react';
import {
    Box, Grid, Typography,
} from '@mui/material';
import EmptyState from '../../components/EmptyState';
import useDofusItems, { Item } from '../../hooks/dofus-data/useDofusItems';
import { useForgemagie } from '../../providers/sockets/ForgemagieContext';
import ItemComponent from '../../components/Item';

const Forgemagie = () => {
    const { itemInfos } = useForgemagie();
    const items = useDofusItems().data;
    const [item, setItem] = React.useState<Item | undefined | null>(null);

    React.useEffect(() => {
        if (itemInfos) setItem(items?.find(i => i.id === itemInfos?.objectGID))
    }, [items, itemInfos])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                {/* Not item to display */}
                {item === null &&
                    <Grid item xs={12}>
                        <EmptyState>
                            Go to the fm interface and select an item.
                        </EmptyState>
                    </Grid>
                }

                {/* Not item to display */}
                {typeof item === "undefined" &&
                    <Grid item xs={12}>
                        <EmptyState>
                            Item is undefined.
                        </EmptyState>
                    </Grid>
                }

                {/* Items display */}
                {item &&
                    <>
                        <Grid item xs={12}><Typography variant="h2">{item?.name}</Typography></Grid>
                        <Grid item xs={4}>
                            <ItemComponent item={item} itemEffects={itemInfos?.effects}/>
                        </Grid>

                        <Grid item xs={8}>
                            <Typography variant="h2">Reliquat : {itemInfos?.magicPool}</Typography>
                        </Grid>
                    </>
                }
            </Grid>
        </Box >)
}

export default Forgemagie;