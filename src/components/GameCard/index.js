import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 200,
        width:200,
        margin: theme.spacing(1),
    },
    media: {
        height: 140,
    },
}));

export default function MediaCard({name,image}) {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={image}
                    title={name}
                />
            </CardActionArea>
            <CardActions>
                <Box pl={4} pr={4}>
                    <Button size="small" fullWidth color="primary">
                        {name}
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );
}