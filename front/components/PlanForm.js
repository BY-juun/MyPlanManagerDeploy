import React, { useCallback, useEffect,useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useInput from '../hooks/useInput';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux';
import { SUBMIT_PLAN_REQUEST } from '../reducers/plan';

const useStyles = makeStyles((theme) => ({
    inputField : {
      width: "180px",
      marginRight : "10px",
    },
    button : {
        marginTop : "13px",
        marginLeft : "15px",
    },
    formWrapper : {
        marginTop : "10px",
        marginBottom : "15px",
    },
    submitComplete : {

    }
  }));
  
const PlanForm = ({dayInfo}) => {
    const [plan,onChangePlan] = useInput('');
    const [checkSubmit, setCheckSubmit] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const {submitPlanDone, checkplan} = useSelector((state)=>state.plan);

    useEffect(()=>{
        if(submitPlanDone)
        {
            if(plan === checkplan)
            {
                setCheckSubmit(true);
            }
        }
    },[submitPlanDone,plan,checkplan])

    const submitPlan = useCallback((e)=>{
        e.preventDefault();
        return dispatch({
            type : SUBMIT_PLAN_REQUEST,
            data : {
                plan,dayInfo
            }
        })
    },[plan]);

    return(
        <div>
            <form className = {classes.formWrapper}>
                <TextField label="Plan" value={plan} required onChange={onChangePlan} className = {classes.inputField}></TextField>
                {checkSubmit
                ?   
                <>
                    <Button variant="outlined" size="medium" color="secondary" className = {classes.button}>
                        완료
                    </Button>
                </>
                :
                <>
                    <Button variant="outlined" size="medium" color="primary" type="submit" className = {classes.button} onClick = {submitPlan}>
                        등록
                    </Button>
                </> }
                
            </form>
        </div>
    )
};


PlanForm.propTypes = {
    dayInfo: PropTypes.string.isRequired,
}

export default PlanForm;