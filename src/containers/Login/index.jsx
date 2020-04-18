import React,{ useCallback, useState} from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Face, LockOpen } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import { VendorSlider } from '../../components/VendorSlider';

const styles = theme => ({
    margin: {
        margin: theme.spacing(2),
    },
    padding: {
        padding: theme.spacing(1)
    },
    btnForgotPwd: {
        textTransform: 'none'
    },
    vendorContainer: {
        minHeight: '200px',
        marginBottom: theme.spacing(3),
    }
});

const Login =(props)=>{
        const { classes } = props;
        const [userData,setUserData] = useState({
            username: '',
            password:'',
            error: false,
            active: 'vnd_3a2a2d70bd585db68427bdeb9794df52',
            currentVendor: 'SPADEGAMING'// Default Vendor
        });
        const onLogin = useCallback(()=>{
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
        },[userData, props.history]);

        const onLoginChange = useCallback((e, type)=>{
            const data = {};
            data[type] = e.target.value;
            setUserData(prevState => ({
                ...prevState,
                ...data
            }));
        },[]);

    const handleVendor = React.useCallback((vendorId, name)=>{
        const data = {active: vendorId, currentVendor: name};
        setUserData(prevState => ({
            ...prevState,
            ...data
        }));
    },[]);

        return (
            <Grid container justify="center" >
                <Grid className={classes.vendorContainer} container item>
                    <VendorSlider
                        handleVendor={handleVendor}
                        active={userData.active}
                    />
                </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                                <Button disableFocusRipple disableRipple
                                        className={classes.btnForgotPwd}
                                        variant="text" color="primary"
                                >
                                    Forgot password ?
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Box mt={2}>
                                <Button onClick={e=>onLogin(e)} variant="outlined" fullWidth color="primary">
                                    Login
                                </Button>
                            </Box>
                        </Grid>
                    </div>
                </Paper>
            </Grid>
            </Grid>
        );
    };

export default withStyles(styles)(Login);