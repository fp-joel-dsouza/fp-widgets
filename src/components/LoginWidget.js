import React, { Suspense, useState } from "react"
import { isMobile } from "react-device-detect";
import Modal from 'react-modal';
import './LoginWidget.css'
import { Input,Button } from 'antd'
import validator from 'validator' 
import OtpInput from "react-otp-input";
import TimeCounter from "./TimerCounter";



const customStylesMobile = {
    content: {
        width:`100%`,
        height:`100%`,
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
        boxShadow: `0 -4px 37px 0 rgba(0, 0, 0, 0.09)`
    },
    overlay: { zIndex: 1000 }
};

const customStyles = {
    content: {
        width: `414px`,
        height: `334px`,
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: `0 -4px 37px 0 rgba(0, 0, 0, 0.09)`
    },
    overlay: { zIndex: 1000 }
  };

const style = {
    focusStyle:{
        borderColor: "#ffffff #ffffff #4966FF #ffffff",
        outline:"none",
        border:"0px 0px 1px 0px"
    },
    inputStyle:{
        width: "3.5rem",
        textAlign: "center",
        margin: "5px 20px 40px",
        fontSize: "22px",
        height: "50px",
        borderColor: "#ffffff #ffffff #808080 #ffffff",
        outline:"none",
        color:"#4966FF"
    },
    containerStyle:{
        margin: "0 auto",
        paddingTop: "20px",
        position:"absolute",
        top: "110px",
        left: "60px"
    },
    containerMobileStyle:{
        margin: "0 auto",
        paddingTop: "20px",
        position:"absolute",
        top: "260px",
        left: "10px"
    }
}


const baseUrl = window.location.href.split(window.location.pathname)[0];

const LoginWidget = ({showLogin,showModal})=>{
    const [validationError, setValidationError] = useState(false);
    const [validationCheckbox, setValidationCheckbox] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [mobileNumber, setMobile] = useState("");
    const [referCode, setReferCode] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [inputStyle, setInputStyle] = useState(style.inputStyle);
    const [verifyColor, setVerifyColor] = useState({});
    const [toggleLogin, setToggleLogin] = useState(false)
    const [urlChange, setUrlChange] = useState("loginAndGetOtp")
    const [urlVerifyChange, setUrlVerifyChange] = useState("loginAndVerifyOtp")
    const [resendColor, setResendColor] = useState("#808080")
    const [resendPointer, setResendPointer] = useState("")
    const [enableResend, setEnableResend] = useState(false)
    const [showTimer, setShowTimer] = useState(true)

    console.log(showLogin)



    const validateCheckbox = (e)=>{
        console.log(e.target.checked)
        setValidationCheckbox(e.target.checked);
    }

    const validateMobile = (e)=>{
        const isValidPhoneNumber = validator.isMobilePhone(e.target.value) && e.target.value.length===10;
        console.log(isValidPhoneNumber)
        if (isValidPhoneNumber) {
            setValidationError(false);
            setMobile(e.target.value);
            setErrorMessage("");
        }
        else{
            setErrorMessage("Please enter a 10 digit mobile number");
            setValidationError(true);
        }
    }

    const handleReferalCode = (e) =>{
        setReferCode(e.target.value)
    }


    const  getOtp = async()=>{
        const url = `${baseUrl}/app/${urlChange}/`;
        const response =  await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
             mobile:mobileNumber,
             referCode:referCode
            })
        });
        if(response.status === 200)
        {
            const result = await response.json()
            if(result.Error === "NA")
            {
                setValidationError(false)
                setShowOtp(true)
            }
            else{
                setValidationError(true)
                setErrorMessage(result.Error)
            }
        }
    }

    const handleLoginClick= ()=>{
        const isValidPhoneNumber = validator.isMobilePhone(mobileNumber) && mobileNumber.length===10;
        
        if(!isValidPhoneNumber)
        {
            setValidationError(true);
            setErrorMessage("Please enter a 10 digit mobile number");
        }
        else if (!validationCheckbox)
        {
            setValidationError(true);
            setErrorMessage("Please check the agreement box");
        }
        else{
            setValidationError(false)
            setErrorMessage("")
            getOtp();
        }

    }

    const verifyOtp = async () =>{
        const url = `${baseUrl}/app/${urlVerifyChange}/`;
        const response =  await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
             mobile:mobileNumber,
             otp:otpInput
            })
        });

        if(response.status === 200)
        {
            const result = await response.json()
            if(result.Error === "NA")
            {
                localStorage.clear();
                localStorage.setItem("FPTOKEN", result.Token);
                setTimeout(function () {
                    window.location.href = `${baseUrl}/app/v2/dashboard`
                }, 3000);
            }
            else{
                setErrorMessage(result.Error)
            }
        }
    }

    const toggleLoginUI = ()=>{
        setToggleLogin(!toggleLogin)
        if(!toggleLogin)
        {
            setUrlChange("createUserAndGetOtp")
            setUrlVerifyChange("createUserAndVerifyOtp")
            
        }
        else{
            setUrlChange("loginAndGetOtp")
            setUrlVerifyChange("loginAndVerifyOtp")
        }
        setMobile("")
        setValidationError(false)
        setErrorMessage("")
    }

    const handleBlur = (e)=>{
        setInputStyle({
            width: "3.5rem",
            textAlign: "center",
            margin: "5px 20px 40px",
            fontSize: "22px",
            height: "50px",
            outline:"none",
            borderColor: "#ffffff #ffffff #4966FF #ffffff",
            color:"#4966FF"
        })
    }
    const handleChangeOtp = (e)=>{
        setOtpInput(e)
        console.log(e)
        if(e.length === 4)
        {
            setInputStyle({
                width: "3.5rem",
                textAlign: "center",
                margin: "5px 20px 40px",
                fontSize: "22px",
                height: "50px",
                outline:"none",
                borderColor: "#ffffff #ffffff #4966FF #ffffff",
                color:"#4966FF"
            })
            setVerifyColor({background:'linear-gradient(170.41deg,#33F1BD -2.8%, #0091FF 206.38%)'})
        }
        else
        {
            setInputStyle({
                width: "3.5rem",
                textAlign: "center",
                margin: "5px 20px 40px",
                fontSize: "22px",
                height: "50px",
                outline:"none",
                borderColor: "#ffffff #ffffff #808080 #ffffff",
                color:"#4966FF"
            })
            setVerifyColor({backgroundColor:"#808080"})

        }
    }

    const handleResend= ()=>{
        getOtp()
        setEnableResend(false)
        setResendColor("#808080")
        setResendPointer("")
    }

    const handleResendOTP= ()=>{
        setResendColor("#4966FF")
        setResendPointer("pointer")
        setEnableResend(true)
    }

    const contentSignUp = <Suspense fallback={<div></div>}>
        <div className={`col-6 login-widget__title${!isMobile ? "-desktop":""}`}>
            Welcome
            <div className={`login-widget__subtitle${!isMobile ? "-desktop":""}`}>
                Sign up to register
            </div>
        </div>
        <div>
            <Input onChange={handleReferalCode}  placeholder={`Enter a referal code`} className={`login-widget__number${!isMobile ? "-desktop":""}`} />
            <Input onChange={validateMobile}  placeholder={`Enter mobile number`} className={`login-widget__number${!isMobile ? "-desktop":""}`} />
            {validationError && <span className={`login-widget__validation-signup${!isMobile ? "-desktop":""}`} >{errorMessage}</span>}
            <div className={`login-widget__checkbox${!isMobile ? "-desktop":""}`}>
                <input type={`checkbox`} style={{marginRight:10}} onChange={validateCheckbox}/>
                <span>I agree to the <a rel={`noreferrer`} target={`_blank`} href={`./terms-and-conditions/`}><h4 style={{all: 'unset'}}>Terms & Conditions</h4></a> and <a target={`_blank`} href='./privacy-policy/'> Privacy Policy</a> of Financepeer</span>
            </div>
            <Button onClick={handleLoginClick} className={`login-widget__loginbutton${!isMobile ? "-desktop":""}`}>
                Sign up
            </Button>
            <div className={`login-widget__signuplink${!isMobile ? "-desktop":""}`}>
                Existing user? <span className={`login-widget__signuptext`} onClick={toggleLoginUI}>Login</span>
            </div>
            
        </div>
    </Suspense>

    const contentMobile = <Suspense fallback={<div></div>}>
        <div className={`col-6 login-widget__title${!isMobile ? "-desktop":""}`}>
            Welcome
            <div className={`login-widget__subtitle${!isMobile ? "-desktop":""}`}>
                Login to continue
            </div>
        </div>
        <div>
            <Input onChange={validateMobile}  placeholder={`Enter mobile number`} className={`login-widget__number${!isMobile ? "-desktop":""}`} />
            {validationError && <span className={`login-widget__validation${!isMobile ? "-desktop":""}`} >{errorMessage}</span>}
            <div className={`login-widget__checkbox${!isMobile ? "-desktop":""}`}>
                <input type={`checkbox`} style={{marginRight:10}} onChange={validateCheckbox}/>
                <span>I agree to the <a rel={`noreferrer`} target={`_blank`} href={`./terms-and-conditions/`}><h4 style={{all: 'unset'}}>Terms & Conditions</h4></a> and <a target={`_blank`} href='./privacy-policy/'> Privacy Policy</a> of Financepeer</span>
            </div>
            <Button onClick={handleLoginClick} className={`login-widget__loginbutton${!isMobile ? "-desktop":""}`}>
                Login
            </Button>
            <div className={`login-widget__signuplink${!isMobile ? "-desktop":""}`}>
                New user? <span className={`login-widget__signuptext`} onClick={toggleLoginUI}> Sign Up </span>
            </div>
        </div>
        </Suspense>

    const contentOtp = <Suspense fallback={<div></div>}>
            <div className={`col-6 login-widget__title${!isMobile ? "-desktop":"-mobile"}`}>
                Mobile Verification
                <div className={`login-widget__subtitle${!isMobile ? "-desktop":"-mobile"}`}>
                    Please enter OTP received on your mobile number <span style={{color:'#000000'}}>{mobileNumber}</span>&nbsp;<span style={{color:'#0B80EC'}}>change</span>
                </div>
            </div>
            <OtpInput
                  onChange={handleChangeOtp}
                  numInputs={4}
                  value={otpInput}
                  inputStyle={inputStyle}
                  shouldAutoFocus={true}
                  focusStyle={style.focusStyle}
                  onBlur={handleBlur}

                  containerStyle={isMobile ? style.containerMobileStyle:style.containerStyle}
            />
            <span style={{fontSize: "10px",left: !isMobile ? "80px": "30px"}} className={`login-widget__resend-ui${!isMobile ? "-desktop":"-mobile"}`}>OTP sent</span>{showTimer && <TimeCounter resendHandler={handleResendOTP} style={{textAlign: "center",fontSize: "10px",left: !isMobile ? "125px":'75px',color:"#808080"}} className={`login-widget__resend-ui${!isMobile ? "-desktop":"-mobile"}`} />}
            <span onClick={enableResend && (()=>handleResend())} style={{fontSize: "12px",left: !isMobile ? "275px":"220px",color:resendColor,cursor:resendPointer}}  className={`login-widget__resend-ui${!isMobile ? "-desktop":"-mobile"}`}>Resend OTP</span>
            <Button onClick={verifyOtp} style={verifyColor} className={`login-widget__verifybutton${!isMobile ? "-desktop":"-mobile"}`}>
                Verify
            </Button>
        </Suspense>

   
    return (showModal ? <Modal
                isOpen={showLogin}
                style={isMobile ? customStylesMobile : customStyles}
            >
                {showOtp ? contentOtp : toggleLogin ? contentSignUp : contentMobile}
            </Modal> :showOtp ? contentOtp : toggleLogin ? contentSignUp : contentMobile
            )
}

export default LoginWidget