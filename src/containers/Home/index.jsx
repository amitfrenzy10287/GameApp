import React, { useMemo } from 'react';
import GameCard from '../../components/GameCard';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Box,Typography,Button} from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { SeeAllGames } from '../../containers/SeeAllGames';
import InfiniteScroll from 'react-infinite-scroll-component';

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
        height: 500,
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
        padding: theme.spacing(2, 4, 3),
        maxWidth: '60%',
        minWidth: '60%',
        height: 500,
        overflowY:'hidden'
    },
}));

export const Home =(props)=>{
    const classes = useStyles();
    const gamesData = fakeGamesData.data.games.edges;
    const [modelState, setModelState] = React.useState({
        hot:false,
        new:false,
        popular:false
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

    const fetchMoreGames=(e)=>{
        console.log('scrolled');
    };

    let lcnt = 0;
    const latestGames = React.useMemo(()=>Object.keys(gamesData).map((key)=>{
        if(!gamesData) return;
        if(gamesData[key].node.new === true && lcnt < 6) {
            lcnt++;
            return (
                <GameCard key={gamesData[key].node.id} {...gamesData[key].node} />
            );
        }
    }),[gamesData,lcnt]);

    let fcnt = 0;
    const favGames = React.useMemo(()=>Object.keys(gamesData).map((key)=>{
        if(!gamesData) return;
        if(gamesData[key].node.favorite === true && fcnt < 6) {
            fcnt++;
            return (
                <GameCard key={gamesData[key].node.id} {...gamesData[key].node} />
            );
        }
    }),[gamesData,fcnt]);

    let hcnt = 0;
    const hotGames = React.useMemo(()=>Object.keys(gamesData).map((key)=>{
        if(!gamesData) return;
        if(gamesData[key].node.hot === true && hcnt < 7) {
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
        }
    }),[gamesData,hcnt]);

  return (
      <>
          <Grid>
              <Grid container item xs={12} sm={12}>
                  <Grid justify="space-between" className={classes.mainContainer} container>
                      <Box p={1}>
                          <Typography variant="h5" color="primary" component="h5">
                              Latest Games
                          </Typography>
                      </Box>
                      <Box p={1} justifyContent="flex-end">
                          <Button onClick={()=>handleOpen('new')} variant="contained" color="primary">
                              See All
                          </Button>
                          <Modal
                              disableScrollLock={true}
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
                                      <InfiniteScroll
                                          dataLength={10}
                                          next={fetchMoreGames}
                                          hasMore={true}
                                          loader={<h4>Loading...</h4>}
                                      >
                                        <SeeAllGames type="new" />
                                      </InfiniteScroll>
                                  </div>
                              </Fade>
                          </Modal>
                      </Box>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                      {latestGames}
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
                          <Button onClick={()=>handleOpen('hot')} variant="contained" color="primary">
                              See All
                          </Button>
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
                                        <SeeAllGames type="hot" />
                                  </div>
                              </Fade>
                          </Modal>
                      </Box>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                      <div className={classes.rootHotGame}>
                          <GridList cellHeight={160} className={classes.hotGameGridList} cols={4}>
                            {hotGames}
                          </GridList>
                      </div>
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
                          <Button onClick={()=>handleOpen('popular')} variant="contained" color="primary">
                              See All
                          </Button>
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
                                      <SeeAllGames type="popular" />
                                  </div>
                              </Fade>
                          </Modal>
                      </Box>
                  </Grid>
                  <Grid container item xs={12} sm={12}>
                      {favGames}
                  </Grid>
              </Grid>
          </Grid>
      </>
  );
};