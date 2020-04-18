import React,{ useCallback,useEffect,useMemo, useState } from 'react';
import GameCard from '../../components/GameCard';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Divider from '@material-ui/core/Divider';
import fakeGamesData from '../../data/games.json';

const useStyles = makeStyles((theme) => ({
    mainContainer: {
        padding: theme.spacing(2),
        height: 400,
        overflowY: 'scroll',
    },
    root: {
        width: '100%',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    headerWrapper: {
        padding: theme.spacing(2),
        width: '100%',
        margin: theme.spacing(1),
        textAlign: 'center'
    },
    subHeader: {
        padding: theme.spacing(1,1,0,1),
        width: '100%',
        margin: theme.spacing(1),
    },
    search:{
        width:'100%',
        padding: theme.spacing(0,2,0,2),
        marginBottom: theme.spacing(2),
    }
}));

export const SeeAllGames =(props)=>{
    const classes = useStyles();
    const gamesData = fakeGamesData.data.games.edges;
    const type = props.type;
    const [result, setGamesResult] = useState({
        result: {},
        allResults:{},
        gamesCard: [],
        currentPage: 0,
        nextPage: 5,
    });

    useEffect(()=>{
        const allGames = Object.keys(gamesData).map((key)=>{
            if(type === 'favorite' && gamesData[key].node.new!==true && gamesData[key].node.hot!==true
                && gamesData[key].node.vendor.id === props.vendorId) {
                return {...gamesData[key].node};
            }else if(type === 'hot' && gamesData[key].node.hot===true
                && gamesData[key].node.vendor.id === props.vendorId){
                return {...gamesData[key].node};
            }else if(type === 'new' && gamesData[key].node.new === true && gamesData[key].node.vendor.id === props.vendorId){
                return {...gamesData[key].node};
            }else{
                return undefined;
            }
        }).filter((el)=>{
            return el !== undefined;
        });
        setGamesResult({ result: allGames, allResults: gamesData,currentPage: 0, nextPage: 5  });
    },[gamesData, type,props.vendorId]);

    const allGames = useMemo(()=>{
        if(!result.result) return;
        const games = Object.keys(result.result).map((key)=>{
            return <GameCard key={result.result[key].id} {...result.result[key]} />
        });
        return games;
    },[result]);

    const updateFilteredGames = useCallback((data)=>{
        const games = data.map((arr)=>{
            return <GameCard key={arr.id} {...arr} />
        });
        const updatedGames = {gamesCard: games};
        setGamesResult(prevState => ({
            ...prevState,
            ...updatedGames
        }));
    },[]);

    const fetchMoreGames=useCallback((e)=>{
        const bottom = Math.round(e.target.scrollHeight) - Math.round(e.target.scrollTop) === e.target.clientHeight;
        if ( bottom ) {
            const updatedGames = {
                gamesCard: allGames.slice(result.currentPage, result.nextPage + 5),
                nextPage: result.nextPage + 5
            };
            setGamesResult(prevState => ({
                ...prevState,
                ...updatedGames
            }));
        }
    },[allGames,result]);

    const searchHandler = useCallback((e)=>
    {
        const filteredResult = Object.keys(result.result)
            .map((key)=>result.result[key])
            .filter(s => {
                let name= s.name.toLowerCase();
                let val = e.target.value.toLowerCase();
                return name.includes(val);
            });
        updateFilteredGames(filteredResult);
    },[result,updateFilteredGames]);

    const title = type === 'new'?
        'Latest Games':
        (type === 'favorite' ? 'Popular Games':
        (type === 'hot'? 'Hot Games':''));

    return (
        <>
            <Grid container item>
                <Paper className={classes.headerWrapper}>
                    <Typography variant="h5" justify="center" color="primary" component="h5">
                        {props.currentVendor}
                    </Typography>
                </Paper>
            </Grid>
            <Divider/>
            <Grid container item className={classes.subHeader}>
                <Typography variant="h5" color="primary" component="h5">
                    {title}
                </Typography>
            </Grid>
            <Grid container item className={classes.search}>
                <Paper component="form" className={classes.root}>
                    <IconButton className={classes.iconButton} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <InputBase
                        className={classes.input}
                        placeholder="Search Games here"
                        onChange={(e)=>searchHandler(e)}
                        inputProps={{ 'aria-label': 'search games here' }}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Grid>
            <Grid className={classes.mainContainer} onScroll={(e)=>fetchMoreGames(e)}>
                <Grid container item xs={12} sm={12}>
                    { result.gamesCard ? result.gamesCard: allGames.slice(0, 5) }
                </Grid>
            </Grid>
        </>
    );
};