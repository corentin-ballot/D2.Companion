/* eslint-disable no-unused-vars */
import { Avatar, Badge, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import useDofusMount from "../../hooks/dofus-data/useDofusMount";
import Progress from "../Progress";
import { Mount } from "../../providers/sockets/PaddockContext";
import Notifications from '../../utils/notification'

interface MountProps {
    mount: Mount
}

const MountComponent = ({ mount }: MountProps) => {
    const mountRequest = useDofusMount(mount.modelId);
    const mountModel = mountRequest.data;
    const isPure = new Set(mount.ancestors).size < 2;

    return <Paper sx={{ padding: 1, backgroundColor: isPure ? "white" : "lightpink" }} >
        <Typography variant="subtitle1" noWrap sx={{ textAlign: "center" }}>{mountModel?.name}</Typography>

        <Box>
            <Box sx={{ display: "flex" }}>
                <Avatar sx={{ margin: "auto", width: 100, height: 100 }} src={`http://localhost:3960/images/mounts/${mount.modelId}`} alt="" />

                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {/* <Box><Badge badgeContent={mount.level}><Avatar sx={{ width: 24, height: 24 }} alt="" src={`${process.env.PUBLIC_URL}/img/pictos/lvl.png`} /></Badge></Box> */}
                    <Box><Avatar sx={{ width: 24, height: 24 }} src={`${process.env.PUBLIC_URL}/img/pictos/${mount.gender.toString().toLocaleLowerCase()}.png`} alt={mount.gender} /></Box>
                    {/* <Box><Avatar sx={{ width: 24, height: 24 }} src={`${process.env.PUBLIC_URL}/img/pictos/saddle.png`} data-rideable={mount.isRideable} alt={mount.isRideable ? "Rideable" : "not Rideable"} /></Box> */}
                    {/* <Box><Badge badgeContent={<Avatar sx={{ width: 12, height: 12 }} alt="" src={`${process.env.PUBLIC_URL}/img/pictos/egg.svg`} />}>{mount.reproductionCount}/{mount.reproductionCountMax}</Badge></Box> */}
                </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>Energie: <Progress value={mount.energy} max={mount.energyMax} low={mount.energyMax / 2} high={mount.energyMax - 1} optimum={mount.energyMax} /> </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Amour: <Progress value={mount.love} max={mount.loveMax} low={2500} high={mount.loveMax - 2500} optimum={mount.loveMax} /> </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Maturité: <Progress value={mount.maturity} max={mount.maturityForAdult} low={mount.maturityForAdult / 2} high={mount.maturityForAdult - 1} optimum={mount.maturityForAdult} /> </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Endurance: <Progress value={mount.stamina} max={mount.staminaMax} low={2500} high={mount.staminaMax - 2500} optimum={mount.staminaMax} /> </Box> */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>Fatigue: <Progress value={mount.boostLimiter} max={240} low={240 - 0.1 * 240} high={240 / 2} optimum={0} /> </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>serenity: <Box>{mount.serenity}</Box></Box>
            </Box>
        </Box>
    </Paper>
}

export default MountComponent;