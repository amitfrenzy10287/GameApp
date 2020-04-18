import React from 'react';
import GameCard from '../../components/GameCard';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Box,Typography,Button} from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { SeeAllGames } from '../../containers/SeeAllGames';
import { VendorSlider } from '../../components/VendorSlider';
import { Alert, AlertTitle } from '@material-ui/lab';

import fakeGamesData from '../../data/games.json';
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        maxWidth: '95%',
    },
    rootHotGame: {
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        width: 'calc(100% - 10px)',
        marginLeft: '10px',
        backgroundColor: theme.palette.background,
    },
    modalWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hotGameGridList: {
        width: '95%',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    titleBar: {
        background:
        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
    tileSize: {
        height: 140,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        maxWidth: '60%',
        minWidth: '60%',
    },
    paperMessage: {
        padding:theme.spacing(3),
        width:'100%',
    }
}));

export const Home =(props)=>{
    const classes = useStyles();
    const gamesData = fakeGamesData.data.games.edges;
    const [modelState, setModelState] = React.useState({
        hot:false,
        new:false,
        popular:false,
        active: 'vnd_3a2a2d70bd585db68427bdeb9794df52',
        currentVendor: 'SPADEGAMING'// Default Vendor
    });

    const handleOpen = (type) => {
        const data = {};
        data[type] = true;
        setModelState(prevState => ({
            ...prevState,
            ...data
        }));
    };

    const handleClose = (type) => {
        const data = {};
        data[type] = false;
        setModelState(prevState => ({
            ...prevState,
            ...data
        }));
    };

    let lcnt = 0;
    const latestGames = React.useMemo(()=>
        Object.keys(gamesData).map((key)=>{
        if(!gamesData) return false;
        if(gamesData[key].node.new === true && gamesData[key].node.vendor.id === modelState.active && lcnt < 6) {
            lcnt++;
            return (
                <GameCard key={gamesData[key].node.id} {...gamesData[key].node} />
            );
        }else{
            return undefined;
        }
    }).filter(s=>{
        return s !== undefined;
    }),[gamesData,lcnt,modelState.active]);

    let fcnt = 0;
    const favGames = React.useMemo(()=>Object.keys(gamesData).map((key)=>{
        if(!gamesData) return false;
        if(gamesData[key].node.hot!== true && gamesData[key].node.new!== true && gamesData[key].node.vendor.id === modelState.active && fcnt < 6) {
            fcnt++;
            return (
                <GameCard key={gamesData[key].node.id} {...gamesData[key].node} />
            );
        }else{
            return undefined;
        }
    }).filter(s=>{
        return s !== undefined;
    }),[gamesData,fcnt,modelState.active]);

    let hcnt = 0;
    const hotGames = React.useMemo(()=>Object.keys(gamesData).map((key)=>{
        if(!gamesData) return false;
        if(gamesData[key].node.hot === true && gamesData[key].node.vendor.id === modelState.active && hcnt < 7) {
            hcnt++;
            return (
                <GridListTile className={classes.tileSize} key={gamesData[key].node.id} rows={hcnt <=3 ? 2: 1} cols={hcnt ===1 ? 2 : 1}>
                    <img className={classes.imgHotGame} src={gamesData[key].node.image} alt={gamesData[key].node.name} />
                    <GridListTileBar
                        title={gamesData[key].node.name}
                        titlePosition="top"
                        actionIcon={
                            <IconButton aria-label={`star ${gamesData[key].node.name}`} className={classes.icon}>
                                <StarBorderIcon />
                            </IconButton>
                        }
                        actionPosition="left"
                        className={classes.titleBar}
                    />
                </GridListTile>
            );
        }else{
            return undefined;
        }
    }).filter(s=>{
        return s !== undefined;
    }),[gamesData,hcnt,modelState.active,classes]);

    const handleVendor = React.useCallback((vendorId, name)=>{
        const data = {active: vendorId, currentVendor: name};
        setModelState(prevState => ({
            ...prevState,
            ...data
        }));
    },[]);

  return (
      <>
              <VendorSlider
                  handleVendor={handleVendor}
                  active={modelState.active}
              />
              <Grid container item xs={12} sm={12}>
                  <Grid justify="space-between" className={classes.mainContainer} container>
                      <Box p={1}>
                          <Typography variant="h5" color="primary" component="h5">
                              Latest Games
                          </Typography>
                      </Box>
                      <Box p={1} justifyContent="flex-end">
                          {latestGames.length > 0 && <Button onClick={()=>handleOpen('new')} variant="contained" color="primary">
                              See All
                          </Button>}
                          <Modal
                              aria-labelledby="transition-modal-title"
                              aria-describedby="transition-modal-description"
                              className={classes.modal}
                              open={modelState.new}
                              onClose={()=>handleClose('new')}
                              closeAfterTransition
                              BackdropComponent={Backdrop}
                              BackdropProps={{
                                  timeout: 500,
                              }}
                          >
                              <Fade in={modelState.new}>
                                  <div className={classes.paper}>
                                      <SeeAllGames vendorId={modelState.active} currentVendor={modelState.currentVendor} type="new" />
                                  </div>
                              </Fade>
                          </Modal>
                      </Box>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                      {latestGames.length > 0 ? latestGames:
                          <Paper className={classes.paperMessage}>
                              <Alert severity="info">
                                  <AlertTitle>Oops!</AlertTitle>
                                  Sorry we don't have — <strong>Latest games at the moment!</strong>
                              </Alert>
                          </Paper>}
                  </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                  <Grid justify="space-between" className={classes.mainContainer} container>
                      <Box p={1}>
                          <Typography variant="h5" color="primary" component="h5">
                              Hot Games
                          </Typography>
                      </Box>
                      <Box p={1} justifyContent="flex-end">
                          {hotGames.length > 0 && <Button onClick={()=>handleOpen('hot')} variant="contained" color="primary">
                              See All
                          </Button>}
                          <Modal
                              aria-labelledby="transition-modal-title"
                              aria-describedby="transition-modal-description"
                              className={classes.modal}
                              open={modelState.hot}
                              onClose={()=>handleClose('hot')}
                              closeAfterTransition
                              BackdropComponent={Backdrop}
                              BackdropProps={{
                                  timeout: 500,
                              }}
                          >
                              <Fade in={modelState.hot}>
                                  <div className={classes.paper}>
                                      <SeeAllGames vendorId={modelState.active} currentVendor={modelState.currentVendor}  type="hot" />
                                  </div>
                              </Fade>
                          </Modal>
                      </Box>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                      { hotGames.length > 0 ?
                          <div className={classes.rootHotGame}>
                          <GridList cellHeight={160} className={classes.hotGameGridList} cols={4}>
                                  {hotGames}
                          </GridList>
                      </div>:
                      <Paper className={classes.paperMessage}>
                          <Alert severity="info">
                              <AlertTitle>Oops!</AlertTitle>
                              Sorry we don't have — <strong>Hot games at the moment!</strong>
                          </Alert>
                      </Paper>}
                  </Grid>
              </Grid>
              <Grid container item xs={12} sm={12}>
                  <Grid justify="space-between" className={classes.mainContainer} container>
                      <Box p={1}>
                          <Typography variant="h5" color="primary" component="h5">
                              Popular
                          </Typography>
                      </Box>
                      <Box p={1} justifyContent="flex-end">
                          {favGames.length > 0 && <Button onClick={()=>handleOpen('popular')} variant="contained" color="primary">
                              See All
                          </Button>}
                          <Modal
                              aria-labelledby="transition-modal-title"
                              aria-describedby="transition-modal-description"
                              className={classes.modal}
                              open={modelState.popular}
                              onClose={()=>handleClose('popular')}
                              closeAfterTransition
                              BackdropComponent={Backdrop}
                              BackdropProps={{
                                  timeout: 500,
                              }}
                          >
                              <Fade in={modelState.popular}>
                                  <div className={classes.paper}>
                                      <SeeAllGames vendorId={modelState.active} currentVendor={modelState.currentVendor} type="favorite" />
                                  </div>
                              </Fade>
                          </Modal>
                      </Box>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                      {favGames.length > 0 ? favGames:
                          <Paper className={classes.paperMessage}>
                              <Alert severity="info">
                                  <AlertTitle>Oops!</AlertTitle>
                                  Sorry we don't have — <strong>Popular games at the moment!</strong>
                              </Alert>
                          </Paper>}
                  </Grid>
              </Grid>
      </>
  );
};