import TopLayout from '../components/TopLayout';
import BottomLayout from '../components/BottomLayout';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import useInput from '../hooks/useInput';
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiKakaoTalkLine } from 'react-icons/ri';
import { AiOutlineFacebook, AiOutlineGoogle } from 'react-icons/ai';
import Router from 'next/router';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from "../store/configureStore";
import { END } from 'redux-saga';
import axios from 'axios';
import { red } from '@material-ui/core/colors';
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';
import { backUrl } from '../config/config';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  mainWrapper: {
    textAlign: "center",
    marginTop: "30px",
  },
  wrapper: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  inputWrapper: {
    marginTop: "17px",
    marginBottom: "15px"
  },
  inputField: {
    width: "200px"
  },
  warningMessage: {
    color: "red",
  },
  snackbar: {
    marginBottom: "70px",
  },
  snackbar2: {
    marginTop: "350px",
  },
}));

const signup = () => {
  const dispatch = useDispatch();
  const [email, onChangeEmail, setEmail] = useInput('');
  const [nickname, onChangeNickname, setNickname] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isSignup,setIsSignup] = useState(false);

  const { User, signUpDone, signUpError } = useSelector((state) => state.user);
  const classes = useStyles();
  useEffect(() => {
    if (signUpDone) {
      setOpen(true);
      setTimeout(() => {
        Router.push('/');
      }, 2000)

    }
  }, [signUpDone])

  useEffect(() => {
    if (User) {
      setIsUser(true);
      setTimeout(() => {
        Router.push('/');
      }, 2000)
    }
  }, [User]);

  useEffect(() => {
    if (signUpError) {
      setIsSignup(true);
      setEmail('');
      setNickname('');
      setPassword('');
      setPasswordCheck('');
    }
  }, [signUpError])

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordError(e.target.value !== password);
    setPasswordCheck(e.target.value);
  }, [password]);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        email,
        password,
        nickname,
      },
    });
  }, [email, nickname, password, passwordCheck]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSignup(false);
  };

  return (
    <>
      <TopLayout></TopLayout>
      {!User &&
        <div className={classes.mainWrapper}>
          <form onSubmit={onSubmitForm}>
            <div className={classes.inputWrapper}>
              <TextField label="Email" value={email} required onChange={onChangeEmail} className={classes.inputField}></TextField>
            </div>
            <div className={classes.inputWrapper}>
              <TextField label="Nickname" value={nickname} required onChange={onChangeNickname} className={classes.inputField}></TextField>
            </div>
            <div className={classes.inputWrapper}>
              <TextField label="Password" type="password" value={password} required onChange={onChangePassword} className={classes.inputField}></TextField>
            </div>
            <div className={classes.inputWrapper}>
              <TextField label="PasswordCheck" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} className={classes.inputField}></TextField>
            </div>
            {passwordError && <div className={classes.warningMessage}>비밀번호가 일치하지 않습니다.</div>}
            <div className={classes.inputWrapper}>
              <Button variant="outlined" size="medium" color="primary" type="submit" className={classes.inputField}>
                SignUp
          </Button>
            </div>
          </form>
          <div className={classes.inputWrapper}>
            <Button href={`${backUrl}/user/kakao`} variant="outlined" size="medium" color="primary" type="submit" className={classes.inputField} startIcon={<RiKakaoTalkLine />}>
              카카오톡 회원가입
          </Button>
          </div>
          <div sclassName={classes.inputWrapper}>
            <Button href={`${backUrl}/user/facebook`} variant="outlined" size="medium" color="primary" type="submit" className={classes.inputField} startIcon={<AiOutlineFacebook />}>
              페이스북 회원가입
          </Button>
          </div>
          <div className={classes.inputWrapper}>
            <Button href={`${backUrl}/user/google`} variant="outlined" size="medium" color="primary" type="submit" className={classes.inputField} startIcon={<AiOutlineGoogle />}>
              구글 회원가입
          </Button>
          </div>

        </div>
      }

      <Snackbar open={open} autoHideDuration={3000} className={classes.snackbar}>
        <Alert severity="success">
          회원가입이 완료되었습니다. 메인화면으로 돌아갑니다
                        </Alert>
      </Snackbar>
      <Snackbar open={isUser} autoHideDuration={3000} className={classes.snackbar2}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="error">
          이미 로그인한 회원은 회원가입을 할 수 없습니다.
                        </Alert>
      </Snackbar>
      <Snackbar open={isSignup} autoHideDuration={2000} className={classes.snackbar} onClose = {handleClose}>
        <Alert severity="error" onClose = {handleClose}>
          {signUpError}
        </Alert>
      </Snackbar>
      <BottomLayout></BottomLayout>
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
    store.dispatch(END);
    await store.sagaTask.toPromise();
  });


export default signup;