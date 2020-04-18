import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import SkipNextOutlinedIcon from '@material-ui/icons/SkipNextOutlined';
import SkipPreviousOutlinedIcon from '@material-ui/icons/SkipPreviousOutlined';
import fakeData from '../../data/vendors.json';

const allVendors = fakeData.data.vendors.edges;

const useStyles = makeStyles((theme) => ({
    cardroot: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    paper: {
        margin: theme.spacing(1),
        borderRadius: '50%',
        maxWidth:100,
    },
    active:{
        margin: theme.spacing(1),
        borderRadius: '50%',
        maxWidth:100,
        border: 'solid 3px #a996ff',
    },
    svg: {
        width: 100,
        cursor: 'pointer',
        borderRadius: '50%',
    },
    imgVendor: {
        width: 100,
        height: 79,
        minWidth: 100,
        borderRadius: '50%',
    },
    polygon: {
        fill: theme.palette.common.white,
        stroke: theme.palette.divider,
        strokeWidth: 1,
    },
}));

export const VendorSlider = (props) => {
    const classes = useStyles();
    const [steps, setActiveStep] = React.useState({
        current: 0,
        nextPage: 7,
        result: allVendors
    });
    const handleNext = React.useCallback((e) => {
        const total = allVendors.length;
        const data = {current: steps.nextPage < total ? steps.nextPage : 0, nextPage: steps.nextPage < total ?  steps.nextPage + 7 : 7};
        setActiveStep(prevState => ({
            ...prevState,
            ...data
        }));
    },[steps]);

    React.useEffect(()=>{
        // Set position of active Vendor at the top
        if(!allVendors) return;
        const topKey = Object.keys(allVendors).find((key) =>{
            return allVendors[key].node.id === props.active;
        });
        allVendors.splice( 0,  0, allVendors.splice(topKey, 1)[0]);
        const data = {result: allVendors};
        setActiveStep(prevState => ({
            ...prevState,
            ...data
        }));
    },[]);

    const handleBack = React.useCallback(() => {
        const data = {current: steps.nextPage >= 14 ?
                steps.nextPage -14: 0, nextPage: steps.nextPage > 7
                ? steps.nextPage - 7 : 7};
        setActiveStep(prevState => ({
            ...prevState,
            ...data
        }));
    },[steps]);
    const vendorsSlideData = React.useMemo(() => {
        return allVendors.slice(steps.current, steps.nextPage).map((arr, i) => {
            return (
                <Grid
                      onClick={()=>props.handleVendor(arr.node.id, arr.node.name)}
                      key={arr.node.id}
                      in={true}
                      style={{transformOrigin: '0 0 0'}}
                      {...(true ? {timeout: 1000} : {})}
                >
                    <Grid>
                        <Paper elevation={4} className={props.active === arr.node.id ? classes.active: classes.paper}>
                            <Box className={classes.svg}>
                                <img className={classes.imgVendor} src={arr.node.defaultImage} alt={arr.node.name}/>
                            </Box>
                        </Paper>
                        <Box textAlign="center">
                            <Typography color="primary" component="p">
                                {arr.node.name}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            );
        })
    },[classes,props,steps]);

    return (
        <Grid xl={12} lg={12} md={12} sm={12} container item>
            <FormControlLabel
                control={
                    <Grid container justify="center" item>
                        <IconButton onClick={handleBack}>
                            <SkipPreviousOutlinedIcon/>
                        </IconButton>
                        <IconButton onClick={handleNext}>
                            <SkipNextOutlinedIcon/>
                        </IconButton>
                    </Grid>
                }
                label=""
            />
            <Grid xl={12} lg={12} md={12} sm={12} container item>
                {vendorsSlideData}
            </Grid>
        </Grid>
    );
};