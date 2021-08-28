import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { useDispatch } from 'react-redux';
import { SUBMIT_TIME_REQUEST } from '../reducers/plan';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import Router from 'next/router';

import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: "15px",
        marginLeft: "80px",
    },
    timepicker: {
        width: "160px",
        marginLeft: "10px",
        marginRight: "10px",
    },
    button: {
        float: "right",
        marginTop: "10px",
        border: "none",
    },
    chip: {
        marginLeft: "80px",
    },
    mainWrapper: {
        border: "1px solid #3f51b5", marginTop: "15px", marginLeft: "15px", marginRight: "15px", borderRadius: "15px"
    },
    totlatimeDiv: {
        marginTop: "10px",
        marginBottom: "20px",
    },
    clearIcon: {
        color: "#3f51b5"
    },
    snackbar: {
        marginBottom: "70px",
    }
}));

const ScheduleList = ({ value, id, PropStartTime, PropEndTime, PropTotalTime }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const [startTime, setStartTime] = useState(PropStartTime);
    const [endTime, setEndTime] = useState(PropEndTime);
    const [open, setOpen] = useState(false);
    const [totaltimeerror, setTotaltimeerror] = useState(false);

    const onChangeStartTime = useCallback((date) => {
        setStartTime(date);
        console.log(date);
    }, [startTime]);

    const onChangeEndTime = useCallback((date) => {
        setEndTime(date);
        console.log(date);
    }, [endTime]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setTotaltimeerror(false);
    };

    const submitTime = useCallback(() => {
        let totaltime = null;
        console.log(startTime);
        console.log(endTime);
        console.log(new Date(PropStartTime));

        if (startTime) {
            if (endTime) {
                if (startTime > endTime) {
                    setStartTime(PropStartTime);
                    setEndTime(PropEndTime);
                    return setOpen(true);
                    
                }
                totaltime =
                    (new Date(endTime).getHours() * 60 + new Date(endTime).getMinutes()) -
                    (new Date(startTime).getHours() * 60 + new Date(startTime).getMinutes());
                if(totaltime <= 0)
                {
                    return setTotaltimeerror(true);
                }
            }
        }
        return dispatch({
            type: SUBMIT_TIME_REQUEST,
            data: {
                startTime, endTime, totaltime, id
            }
        })
    }, [startTime, endTime])
    return (
        <>
            <div className={classes.mainWrapper}>
                {PropTotalTime
                    ? <Chip label={value} className={classes.root} color="primary" variant="outlined" />
                    : <Chip label={value} className={classes.root} variant="outlined" />
                }

                {PropStartTime && PropEndTime && PropTotalTime
                    ? <Button variant="outlined" color="secondary" className={classes.button} >제출완료</Button>
                    : <Button variant="outlined" color="primary" className={classes.button} onClick={submitTime}>제출</Button>
                }

                <div>
                    {PropEndTime
                        ? <div className={classes.totlatimeDiv}><AlarmOnIcon className={classes.clearIcon} /><div >
                            수행시간 : {Math.floor(PropTotalTime / 60)}시간 {PropTotalTime % 60}분
                            </div></div>
                        :
                        <>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="시작 시간"
                                    className={classes.timepicker}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    value={startTime}
                                    onChange={onChangeStartTime}
                                />
                                <KeyboardTimePicker
                                    margin="normal"
                                    className={classes.timepicker}
                                    id="time-picker"
                                    label="마무리 시간"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    value={endTime}
                                    onChange={onChangeEndTime}
                                />
                            </MuiPickersUtilsProvider>
                        </>
                    }

                </div>
            </div>
            <Snackbar open={open} autoHideDuration={3000} className={classes.snackbar} onClose = {handleClose}>
                <Alert severity="error" onClose = {handleClose}>
                    시간 설정이 잘못되었습니다
                        </Alert>
            </Snackbar>
            <Snackbar open={totaltimeerror} autoHideDuration={3000} className={classes.snackbar} onClose = {handleClose}>
                <Alert severity="error" onClose = {handleClose}>
                    시간은 오늘 24시 안으로 설정해주세요.
                        </Alert>
            </Snackbar>
        </>
    )
};

export default ScheduleList;