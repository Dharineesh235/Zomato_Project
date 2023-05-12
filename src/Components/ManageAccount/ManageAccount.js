import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleButton from 'react-google-button';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

const ManageAccount = () => {
    const[login,setLogin]=useState(false);
    const[createAcc,setAcc]=useState(false);
    const[logOUT,setLogout] = useState(false);

    const [userEmail,setUserEmail]=useState(undefined);
    const [PassWord,setPassword]=useState(undefined);

    const [userNewName,setUserNewName]=useState(undefined);
    const [usernewEmail,setUsernewEmail]=useState("");

    const [newPassWord,setnewPassword]=useState(undefined);
    const [rePassword,setRePassword]=useState(undefined);

    const [login_msg, setLoginMsg] = useState("");

    const [login_status, setLoginStatus] = useState(false);
    const [loggeduserData, setLoggedUserData] = useState("")

    const [loginData, setLoginData] = useState({
        userEmail : "",
        passWord : ""
    });

    const [registerData, setRegData] = useState({
        userName:"",
        userEmail:"",
        userPassword:""
    })

    useEffect(()=>{
        if(login_msg==="Log in Successful"){
            setLoginStatus(true);
            console.log(loggeduserData);
            console.log('abcd'.indexOf('@'));
            setTimeout(()=>setLogin(false),1000);
        }
    },[login_msg])

    const customStyles = {
        content: {
          height:'90%',
          width:'90%',  
        //   top: '50%',
        //   left: '50%',
        //   right: 'auto',
        //   bottom: 'auto',
        //   transform: 'translate(-50%, -50%)',
          boxShadow:' 3px 3px 9px 2px grey',
        },
    };

    const customStyles2 = {
        content: {
          height:'90%',
          width:'90%',  
        //   top: '50%',
        //   left: '40%',
        //   top:'0',
        //   right: 'auto',
        //   bottom: 'auto',
        //   marginRight: '-50%',
        //   transform: 'translate(-50%, -50%)',
          boxShadow:' 3px 3px 9px 2px grey'
        },
    };

    const responseFacebook = (response) => {
        console.log(response);
    }
    const responseGoogle = (response) => {
        console.log(response);
    }

    const handleSubmit=(e)=>{

    }
    const handleUser=(e)=>{
        loginData.userEmail=e.target.value;
        setLoginData({...loginData})
    }
    const handlePassword=(e)=>{
        loginData.passWord=e.target.value;
        setLoginData({...loginData})
    }
    const handleRegUserName=(e)=>{
        registerData.userName=e.target.value;
        setRegData({...registerData})
    }
    const handleRegUserEmail=(e)=>{
        registerData.userEmail=e.target.value;
        setRegData({...registerData});
    }
    const handleRegPassword=(e)=>{
        registerData.userPassword=e.target.value;
        setRegData({...registerData});
    }
    const logIn_failed=()=>{
        setTimeout(()=>setLoginMsg(""),3000);
    }

    const logIn_success=()=>{
        setTimeout(()=>setLoginMsg(""),3000);
        return true
    }
    const logOutFunc=()=>{
        setLoggedUserData("");
        setLoginStatus(false);
        setLogout(false);
        loginData.userName="";
        loginData.userEmail="";
        loginData.userPassword="";

    }

    const createAccount=async(e)=>{
        e.preventDefault()
        let res=await fetch("https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/postUser",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(registerData)
        })
        let data=await res.json();
        console.log(data);
        setAcc(false);
    }

    const validateEmail = (email) => {
        let sts= String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
          if(sts!=null) return true
          else return false
      };

      console.log(validateEmail());
    const loginUser=async()=>{
        let res = await fetch(`https://backend-node-zomato-dharineesh-gg.onrender.com/zomato/getAllUsers`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(loginData)
        })
        let data = await res.json();
        data.data.length && setLoggedUserData(data.data[0]);
        console.log(data.data[0]);
        let msg = data.message;
        setLoginMsg(msg);
    
        setTimeout(()=>{
            setLoginMsg("");
        },3000)
        login_msg != "" && login_msg == "Log in Successful" && logIn_success();
        login_msg != "" && login_msg !== "Log in Successful" && logIn_failed();

    }
    let logInorOut=login_status==false ? <a className='a1' onClick={()=>setLogin(true)}>Log In</a> : <a className='a1' onClick={()=>setLogout(true)}>Log out</a>
    let createAccorNot = login_status==true ? <></> : <button className='AccInButton'><a className='a1' onClick={()=>setAcc(true)}>Create Account</a></button>

  return (
    <>
        <div className='headbar'>
            <div className='eLogo'><Link className='eLogo-link-router-dom' to={`/`}>z!</Link></div>
            {login_status==true && <div className='welcomeUser'><small>Welcome</small> <b>{loggeduserData.user_name}</b></div>}
            <div className='accountManage'>
                <div><button className='LogInButton'>{logInorOut}</button></div>
    
                <div className='CreateAcc'>
                    {createAccorNot}
                </div>
            </div>
        </div>


        <Modal
         isOpen={login}
         style={customStyles}
         contentLabel="Example Modal"
         ariaHideApp={false}
        >
           <div > 
                <h2 className='modelHead'>Login</h2> 
                <button className='x' onClick={()=>{
                    setLogin(false);
                    setPassword(undefined);
                    setUserEmail(undefined);
                }}>x</button>
            </div>
            <br/>
                
                <div className='logInbtns'>
                    <div >
                        <input className='inputBox' type='email' placeholder='Enter your Email ID' 
                            onChange={(e)=>{
                                handleUser(e); 
                                return e.target.value=='' ? setUserEmail(undefined):setUserEmail(e.target.value)}}
                        />
                        <br/><br/>
                        <input className='inputBox' type='password' placeholder='Enter Your Password'
                             onChange={(e)=>{
                                handlePassword(e);
                                return e.target.value=='' ? setPassword(undefined):setPassword(e.target.value)}}
                        />
                        <br/><br/>
                        <button className='btn btn-primary' onClick={loginUser} disabled={userEmail!=undefined&&PassWord!=undefined ? false:true}>LogIn</button>
                    </div>
                </div> <br/>
                <div>
                    {login_msg != "" && login_msg !== "Log in Successful" &&
                        <div className = 'logInbtns log-msg-red'>
                            <p>{login_msg}</p>
                        </div>
                    }
                    {login_msg != "" && login_msg === "Log in Successful" && 
                        <div className = 'logInbtns log-msg-green'>
                        <p>{login_msg}</p>
                    </div>
                    }
                    <div className='logInbtns'>
                        <p className='up-in-parent'>If no Account use <b className='up-in' onClick={()=>{setAcc(true);setLogin(false)}}>Sign-Up</b></p>    
                    </div>
                </div>
                 <div className='logInbtns-gf'>
                    <div>
                        <GoogleButton
                            clientId="1021090884211-u92l9v86p37r96dfq9b11q2e2asl4mol.apps.googleusercontent.com"
                            buttonText="LOGIN WITH GOOGLE"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        /> 
                    </div><br/>

                    <div>
                        <FacebookLogin
                            appId="859576005343218"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={responseFacebook} 
                            icon="fa-facebook"
                            textButton='SIGN-IN WITH FACEBOOK'
                        />
                    </div><br/>
                </div>

            
  
        </Modal>

        <Modal
            isOpen={logOUT}
            style={customStyles}
            contentLabel="LogOut"
            ariaHideApp={false}
        >
            <div > 
                <h2 className='modelHead'>Log out</h2> 
                <button className='x' onClick={()=>{
                    setLogout(false);
                    setPassword(undefined);
                    setUserEmail(undefined);
                }}>x</button>
            </div><br/><br/>
            <h4>Dear {loggeduserData.user_name}</h4><br/>
            <p>Confirm <b>LogOut</b></p>
            <div className='log-out-button-container'>
                <div><button onClick={()=>logOutFunc()} id='Confirm' >Confirm</button></div>
                <div><button onClick={()=>setLogout(false)} id='Cancel'>Cancel</button></div>
            </div>
        </Modal>

        <Modal
         isOpen={createAcc}
         style={customStyles2}
         contentLabel="Example Modal"
         ariaHideApp={false}
        >
           <div> 
                <h2 className='modelHead'> Create Account</h2>
                <button className='x' onClick={()=>{
                    setAcc(false);
                    setUserNewName(undefined);
                    setnewPassword(undefined);
                }}>x</button>
            </div><br/>
                {/* <center> */}
            <div className='logInbtns'>
                <div>
                 <form onSubmit={handleSubmit}>
                   
                        <input 
                            className='inputBox'
                            type='text'
                            placeholder='User Name' 
                            onChange={(e)=>{
                                handleRegUserName(e);
                                return e.target.value=='' ? setUserNewName(undefined):setUserNewName(e.target.value);
                            }}/>
                        <br/><br/>
                        <input 
                            className='inputBox'
                            type='email'
                            placeholder='User Email' 
                            onChange={
                               (e)=>{
                                handleRegUserEmail(e);
                                return e.target.value=='' ? setUsernewEmail(undefined):setUsernewEmail(e.target.value)
                            }
                            }/>
                        <br/><br/>
                        <input 
                            className='inputBox'
                            type='password'
                            placeholder='Password'
                            onChange={
                                (e)=>e.target.value=='' ? setnewPassword(undefined):setnewPassword(e.target.value)
                            }/>
                        <br/><br/>
                        <input 
                            className='inputBox'
                            type='password' 
                            placeholder='Re-Enter Password'
                            onChange={
                                (e)=>{
                                    handleRegPassword(e);
                                    return e.target.value=='' ? setRePassword(undefined):setRePassword(e.target.value);
                            }
                            }/>
                        <br/><br/>
                   <br/>
                        <button 
                            type='submit'
                            className='btn btn-primary' 
                            onClick={(e)=>createAccount(e)}
                            disabled={userNewName!=undefined&&usernewEmail!=""&&newPassWord!=undefined&&rePassword==newPassWord && validateEmail(usernewEmail) ? false:true} 
                        >
                            Create Account
                        </button>
                    </form>
                    </div>
            </div> <br/>
            <div className='logInbtns-gf'>
                    <div><GoogleLogin
                        clientId="1021090884211-u92l9v86p37r96dfq9b11q2e2asl4mol.apps.googleusercontent.com"
                        buttonText="SIGN-UP WITH GOOGLE"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                        /> 
                    </div><br/>

                    <div>
                        <FacebookLogin
                            appId="859576005343218"
                            buttonText="SIGN-Up"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={responseFacebook}
                            icon="fa-facebook"
                            textButton='&nbsp;&nbsp;SIGN-UP WITH FACEBOOK'
                        ></FacebookLogin>
                    </div>
                </div>
                {/* </center>    */}
        </Modal>
    </>
  )
}

export default ManageAccount