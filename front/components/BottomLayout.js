import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HistoryIcon from '@material-ui/icons/History';
import TodayIcon from '@material-ui/icons/Today';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import { useSelector,useDispatch } from 'react-redux';
import Router from 'next/router';
import {LOG_OUT_REQUEST} from '../reducers/user';
const useStyles = makeStyles({
    root: {
        position : "fixed",
        left : "0px",
        bottom : "0px",
        zIndex : 9999,
        width : "100%",
    },
});



const BottomLayout = ({value}) => {
    const classes = useStyles();
    const {User} = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const onClickLogout = useCallback(()=>{
        Router.push('/');
        setTimeout(()=>{
            dispatch({
                type : LOG_OUT_REQUEST
            })
        },200);
    })
    return (
        <BottomNavigation
            showLabels
            className={classes.root}
            value = {value}
        >
            <BottomNavigationAction label="과거" value = 'past' icon={<HistoryIcon />} href = '/past'/>
            <BottomNavigationAction label="오늘일정" value = 'today' icon={<AccessAlarmIcon />} href = '/Today'/>
            <BottomNavigationAction label="계획짜기" value = 'schedule' icon={<TodayIcon />} href = '/Schedule'/>
            {!User && <BottomNavigationAction label="로그인" value = 'login' icon={<ExitToAppIcon />} href = '/login'/>}
            {User &&  <BottomNavigationAction label="로그아웃" value = 'logout' icon={<ExitToAppIcon />} onClick = {onClickLogout}/>}
             {/* 나중에 로그인 했으면 logout으로 바꿔줘야한다.*/}
        </BottomNavigation>
    );
};

export default BottomLayout