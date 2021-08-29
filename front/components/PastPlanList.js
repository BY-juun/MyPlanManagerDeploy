import React, { useEffect,useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';

const useStyles = makeStyles((theme) => ({
    wrapper : {
        marginBottom : "56px",
        marginLeft: "20px",
        marginRight : "20px",
        border : "1px solid grey",
        borderRadius : "15px",
        padding : "10px",
    },
    plan : {
        marginTop : "10px",
        marginBottom : "10px",
        color : "black",
        textAlign : "center",
    },
    icon : {
        color : "#3f51b5",
        verticalAlign : "middle",
        marginBottom : "3px",
    },
    span : {
        marginRight : "50px",

    },
    chip : {
        marginBottom : "15px"
    },
    totalTimediv : {
        marginTop : "20px",
        marginBottom : "10px"
    }

  }));
  

const PastPlanList = ({dayinfo, planList}) => {
    const classes = useStyles();
    const [totaltime,setTotaltime] = useState(0);
    useEffect(()=>{
        if(planList){
            setTotaltime(0);
            planList.map((value,index)=>{
                setTotaltime(prevTotaltime => prevTotaltime + value.totaltime)
            })
        }
    },[planList])
    return(
        <div className = {classes.wrapper}>
            <Chip
                label={String(dayinfo).substr(0,4) + "년 " +String(dayinfo).substr(4,2) + "월 " + String(dayinfo).substr(6,8) + "일"}
                color="primary"
                variant="outlined"
                className = {classes.chip}
            />
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>계획</TableCell>
                            <TableCell align="left">시간</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {planList && planList.map((value,index)=>
                        <TableRow key={index}>
                            <TableCell align="left"><ListAltOutlinedIcon className = {classes.icon}/>{value.content}</TableCell>
                            <TableCell align="left"><ScheduleIcon className = {classes.icon}/>{Math.floor(value.totaltime/60)}시간 {value.totaltime %60}분</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
            </Table>
            </TableContainer>
            {totaltime 
            ? <div className = {classes.totalTimediv}><AddAlarmIcon className = {classes.icon}/> 총 시간 : {Math.floor(totaltime/60)}시간 {totaltime %60}분</div>
            : null}
        </div>
    )
};

export default PastPlanList