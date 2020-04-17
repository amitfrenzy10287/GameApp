import React,{ useCallback, useState} from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { Face, LockOpen } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    }
});

const Login =(props)=>{
        const { classes } = props;
        const [userData,setUserData] = useState({
            username: '',
            password:'',
            error: false
        });
        const onLogin =()=>{
            const data = {};
            if(userData.username ==='' || userData.password ===''){
                data['error'] = true;
            }else{
                data['error'] = false;
                props.history.push('/home');
            }
            setUserData(prevState => ({
                ...prevState,
                ...data
            }));
            // props.history.push('/home');
        };
        const onLoginChange = useCallback((e, type)=>{
            const data = {};
            data[type] = e.target.value;
            setUserData(prevState => ({
                ...prevState,
                ...data
            }));
        },['']);
        return (
            <Grid container justify="center" >
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <Grid style={{minHeight: '150px'}}>
                    scroll goes here
                </Grid>
                <Paper className={classes.padding}>
                    <Grid>
                        {userData.error && <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            Incorrect username or password or — <strong>missing fields!</strong>
                        </Alert>}
                    </Grid>
                    <div className={classes.margin}>
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item>
                                <Face />
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField
                                    onChange={(e)=>onLoginChange(e,'username')}
                                    label="Username" type="text" name="username" fullWidth autoFocus
                                    value={userData.username}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={8} alignItems="flex-end">
                            <Grid item>
                                <LockOpen />
                            </Grid>
                            <Grid item md={true} sm={true} xs={true}>
                                <TextField
                                    onChange={(e)=>onLoginChange(e,'password')}
                                    label="Password" type="password" name="password" fullWidth
                                    value={userData.password}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" justify="space-between">
                            <Grid item>
                                <FormControlLabel control={
                                    <Checkbox
                                        color="primary"
                                    />
                                } label="Remember me" />
                            </Grid>
                            <Grid item>
                                <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '10px' }}>
                            <Button onClick={e=>onLogin(e)} variant="outlined" fullWidth color="primary">
                                Login
                            </Button>
                        </Grid>
                    </div>
                </Paper>
            </Grid>
            </Grid>
        );
    };

export default withStyles(styles)(Login);