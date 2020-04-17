import React,{ useCallback,useEffect,useMemo, useState } from 'react';
import GameCard from '../../components/GameCard';
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Box,Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import fakeGamesData from '../../data/games.json';
const useStyles = makeStyles((theme) => ({
    mainContainer: {
        maxWidth: '95%',
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
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
}));

export const SeeAllGames =(props)=>{
    const classes = useStyles();
    const gamesData = fakeGamesData.data.games.edges;
    const type = props.type;
    const [result, setGamesResult] = useState({
        result: {},
        allResults:{},
        gamesCard: []
    });

    useEffect(()=>{
        const allGames = Object.keys(gamesData).map((key)=>{
            if(gamesData[key].node[type] === true) {
                return {...gamesData[key].node};
            }
        }).filter((el)=>{
            return el !== undefined;
        });
        setGamesResult({result: allGames, allResults:gamesData});
    },[gamesData, type]);

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

    const fetchMoreGames=(e)=>{
        const bottom = Math.round(e.target.scrollHeight) - Math.round(e.target.scrollTop) === e.target.clientHeight;
        if ( bottom ) {
            console.log('reached bottom!!');
        }
    };

    const searchHandler = useCallback((e)=>
    {
        debugger;
        const filteredResult = Object.keys(result.result)
            .map((key)=>result.result[key])
            .filter(s => {
                let name= s.name.toLowerCase();
                let val = e.target.value.toLowerCase();
                return name.includes(val);
            });
        updateFilteredGames(filteredResult);
    },[result]);

    const title = type === 'new'?
        'Latest Games':
        (type === 'popular' ? 'Popular Games':
        (type === 'hot'? 'Hot Games':''));

    return (
        <>

            <Grid style={{height: '500px', overflowY: 'scroll'}} onScroll={(e)=>fetchMoreGames(e)}>
                <Grid container item xs={12} sm={12}>
                    <Box pt={2} pb={2}>
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
                    </Box>
                    <Grid justify="space-between" className={classes.mainContainer} container>
                        <Box p={1}>
                            <Typography variant="h5" color="primary" component="h5">
                                {title}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container item xs={12} sm={12}>
                        { result.gamesCard ? result.gamesCard: allGames }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};