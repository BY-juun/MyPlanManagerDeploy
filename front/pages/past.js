import React, { useCallback, useEffect, useState } from 'react';
import TopLayout from '../components/TopLayout';
import BottomLayout from '../components/BottomLayout';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { alpha, makeStyles } from '@material-ui/core/styles';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_PAST_REQUEST } from '../reducers/day';
import PastPlanList from '../components/PastPlanList';
import Router from 'next/router';
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from 'axios';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const useStyles = makeStyles((theme) => ({
    mainwrraper: {
        textAlign: "center",
        marginTop: "130px"
    },
    icon: {
        color: "#3f51b5",
        fontSize: "50px"
    },
    ment: {
        marginTop: "25px",
        fontSize: "25px"
    },
    finishButton: {
        marginTop: "20px",
        width: "222px",
    },
    pastListWrapper : {
        textAlign : "center",
        marginTop : "20px"
    },
    snackbar : {
        marginTop : "350px",
    },
    snackbar2 : {
        marginBottom : "70px",
    }
}));

const past = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [date1,setDate1] = useState(false);
    const [date2,setDate2] = useState(false);
    const [FromdayInfo, setFromdayInfo] = useState(null);
    const [TodayInfo, setTodayInfo] = useState(null);
    const {pastPlan} = useSelector((state)=>state.day);
    const {User} = useSelector((state)=>state.user);
    useEffect(()=>{
        if(!User){
            setOpen(true);
            setTimeout(()=>{
                Router.push('/');
            },2000)
        }
    },[User])

    const handleFromDateChange = useCallback((date) => {
        setSelectedFromDate(date);
        if (date.getMonth() + 1 < 10) {
            if(date.getDate()<10){
                setFromdayInfo(Number(String(date.getFullYear()) + "0" + String(date.getMonth() + 1) + "0" +String(date.getDate())))
            }else{
                setFromdayInfo(Number(String(date.getFullYear()) + "0" + String(date.getMonth() + 1) + String(date.getDate())))
            }
           
        } else {
            if(date.getDate()<10){
                setFromdayInfo(String(date.getFullYear()) + String(date.getMonth() + 1) + "0" +String(date.getDate()))
            }else{
                setFromdayInfo(String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getDate()))
            }
        }
    },[selectedFromDate]);

    const handleToDateChange = useCallback((date) => {
        setSelectedToDate(date);
        if (date.getMonth() + 1 < 10) {
            if(date.getDate()<10){
                setTodayInfo(Number(String(date.getFullYear()) + "0" + String(date.getMonth() + 1) + "0" +String(date.getDate())))
            }else{
                setTodayInfo(Number(String(date.getFullYear()) + "0" + String(date.getMonth() + 1) + String(date.getDate())))
            }
           
        } else {
            if(date.getDate()<10){
                setTodayInfo(Number(String(date.getFullYear()) + String(date.getMonth() + 1) + "0" +String(date.getDate())))
            }else{
                setTodayInfo(Number(String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getDate())))
            }
        }
    },[selectedToDate]);

    const submitPast = useCallback(() => {
        if (!FromdayInfo || !TodayInfo) {
            setSelectedFromDate(null);
            setSelectedToDate(null);
            return setDate1(true);
        }else if(FromdayInfo >= TodayInfo){
            setSelectedFromDate(null);
            setSelectedToDate(null);
            return setDate2(true);
        }
        else {
            return dispatch({
                type: LOAD_PAST_REQUEST,
                data: {
                    FromdayInfo,TodayInfo
                }
            })
        }
    }, [selectedFromDate, selectedToDate])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setDate1(false);
        setDate2(false);
      };

    return (
        <>
            <TopLayout />
            {User && !pastPlan && 
            <div className={classes.mainwrraper}>
            <CheckCircleOutlineIcon className={classes.icon} />
            <div className={classes.ment}>보고싶은 기간을 설정해주세요</div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justifyContent="space-around">
                    <div>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="From"
                        format="MM/dd/yyyy"
                        value={selectedFromDate}
                        onChange={handleFromDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    </div>
                    <div>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="To"
                        format="MM/dd/yyyy"
                        value={selectedToDate}
                        onChange={handleToDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    </div>
                </Grid>
            </MuiPickersUtilsProvider>
            <div>
                <Button variant="outlined" color="primary"
                    className={classes.finishButton} onClick={submitPast}>
                    설정 완료
            </Button>
            </div>
            </div>}
            <div className = {classes.pastListWrapper}>
            {User && pastPlan &&
                pastPlan.map((value,index)=>
                <PastPlanList key = {index} 
                dayinfo = {value.dayinfo}
                planList = {value.Plans}
                />)
            }
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                className = {classes.snackbar}
            >
                <Alert severity="error">
                로그인 후 이용 가능합니다.
                </Alert>
            </Snackbar>
            <Snackbar
                open={date1}
                className = {classes.snackbar2}
                onClose = {handleClose}
            >
                <Alert severity="error" onClose = {handleClose}>
                기간을 설정하셔야 합니다
                </Alert>
            </Snackbar>
            <Snackbar
                open={date2}
                className = {classes.snackbar2} onClose = {handleClose}
            >
                <Alert severity="error" onClose = {handleClose}>
                기간이 잘못 설정 되어 있습니다
                </Alert>
            </Snackbar>
            <BottomLayout value = {'past'}/>
        </>
    );
};

export const getServerSideProps = wrapper.getServerSideProps((store)=>
async ({req,res}) => {
    //원래 브라우저에서 cookie를 알아서 넣어주는데 , SSR시에는 브라우저 개입을 못하니까 프론트서버에서 헤더에 쿠키를 넣어서 보내줘야 한다.
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if(req && cookie){
      axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({
      type : LOAD_MY_INFO_REQUEST,
    })
    store.dispatch(END);
    await store.sagaTask.toPromise();
  });
  

export default past;