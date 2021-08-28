import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Image from 'next/image'
import TopLayout from '../components/TopLayout';
import BottomLayout from '../components/BottomLayout';
import todolist from "../public/todolist.png"
import { LOAD_MY_INFO_REQUEST, LOG_OUT_REQUEST } from '../reducers/user';
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop : "30px",
        display : "block",
        margin : "0 auto",
        width : "200px",
    },
    Userchip : {
        marginTop : "50px",
    },
    mainWrapper : {
        textAlign : "center", marginTop : "180px"
    },
    mainMessage : {
        fontSize : "30px",color : "grey",marginTop : "15px"
    },
  }));

import Button from '@material-ui/core/Button';
const Home = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const {User} = useSelector((state)=>state.user); 
    const nickname = User?.nickname;

    const onClickLogout = useCallback(()=>{
        return dispatch({
            type : LOG_OUT_REQUEST
        })
    })
    return(
        <>
            <TopLayout></TopLayout>
            <div className = {classes.mainWrapper}>
                <Image
                    src= {todolist}
                    alt="Picture of the author"
                    width={100}
                    height={100}
                />
                <div className = {classes.mainMessage}>매일매일 후회없이</div>
                <div className = {classes.mainMessage}>기록하자</div>
                {!User && 
                <>
                <Button variant="outlined" color="primary" className = {classes.root} href = '/login'>
                    Login
                </Button>
                <Button variant="outlined" color="primary" className = {classes.root} href = '/signup'>
                    SignUp
                </Button>
                </>}
                {User && 
                <>
                <Chip
                    variant="outlined"
                    size="medium"
                    icon={<FaceIcon />}
                    label={nickname}
                    clickable
                    color="primary"
                    className = {classes.Userchip}
                />
                <Button  variant="outlined" color="primary" className = {classes.root} onClick = {onClickLogout}>Logout</Button>

                </>}
                
            </div>
            <BottomLayout ></BottomLayout>
        </>
    );
}

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
  

export default Home;