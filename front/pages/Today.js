import React, { useEffect, useState } from 'react';
import TopLayout from '../components/TopLayout';
import BottomLayout from '../components/BottomLayout';
import { makeStyles } from '@material-ui/core/styles';
import ScheduleList from '../components/ScheduleList';
import Chip from '@material-ui/core/Chip';
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_TODAY_REQUEST } from '../reducers/day';
import Router from 'next/router';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';

import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


const useStyles = makeStyles((theme) => ({
  TodayWrapper: {
    textAlign: "center",
    marginTop: "30px",
  },
  icon: {
    color: "#f48fb1",
    fontSize: "65px",
  },
  noSchedule: {
    marginTop: "170px",
  },
  noScheduleComment: {
    marginTop: "30px",
    fontSize: "20px",
  },
  snackbar : {
    marginTop : "350px",
  },
  chipp : {
    marginBottom : "15px",
  }
}));

const Today = () => {
  const { User } = useSelector((state) => state.user);
  const classes = useStyles();
  const today = new Date();
  const { todayPlan } = useSelector((state) => state.day);
  const { submitTimeDone } = useSelector((state) => state.plan);
  const scheduleArr = todayPlan?.Plans;
  const dayinfo = String(today.getFullYear()) + " " + String(today.getMonth() + 1) + " " + String(today.getDate());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!User) {
      setOpen(true);
      setTimeout(() => {
        Router.push('/');
      }, 2000);
    }
  }, [User])
  useEffect(() => {
    if (submitTimeDone) {
      Router.push('/Today');
    }
  }, [submitTimeDone])

  return (
    <>
      <TopLayout></TopLayout>
      {User &&
        <div className={classes.TodayWrapper}>
          <h2>오늘의 일정!</h2>
          <Chip className = {classes.chipp} label={dayinfo} color="primary" variant="outlined" />
          {!scheduleArr &&
            <div className={classes.noSchedule}>
              <AlarmOffIcon className={classes.icon} />
              <div className={classes.noScheduleComment}>아직 오늘 일정이 없습니다</div>
            </div>}
          {scheduleArr && scheduleArr.map((value, index) =>
            <ScheduleList
              value={value.content}
              id={value.id}
              PropStartTime={value.starttime}
              PropEndTime={value.endtime}
              PropTotalTime={value.totaltime}
              key={index} />
          )}
        </div>
      }
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        className={classes.snackbar}
      >
        <Alert severity="error">
          로그인 후 이용 가능합니다.
                </Alert>
      </Snackbar>
      <BottomLayout value = {'today'}></BottomLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async ({ req, res }) => {
    //원래 브라우저에서 cookie를 알아서 넣어주는데 , SSR시에는 브라우저 개입을 못하니까 프론트서버에서 헤더에 쿠키를 넣어서 보내줘야 한다.
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    })
    store.dispatch({
      type: LOAD_TODAY_REQUEST,
    })
    store.dispatch(END);
    await store.sagaTask.toPromise();
  });

export default Today;