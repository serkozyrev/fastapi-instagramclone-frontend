import React, {useEffect, useState} from 'react'
import './App.css';
import Post from './Post'
import {Box, Button, Input, Modal} from '@mui/material'
import ImageUpload from './ImageUpload';

// const BASE_URL='http://localhost:8000'



function App() {

  const [openSignIn, setOpenSignIn] = useState(false)
  const [openSignUp, setOpenSignUp] = useState(false)
  const [posts, setPosts] = useState([]);
  const [usernameLocal, setLocalUsername] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [authToken,setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null)
  const [userId, setUserId] = useState('')

  useEffect(()=>{
    setAuthToken(window.localStorage.getItem('authToken'))
    setAuthTokenType(window.localStorage.getItem('authTokenType'))
    setUsername(window.localStorage.getItem('username'))
    setUserId(window.localStorage.getItem('userId'))
  },[])

  useEffect(()=>{
    authToken?window.localStorage.setItem('authToken', authToken):window.localStorage.removeItem('authToken')
    authTokenType?window.localStorage.setItem('authTokenType', authTokenType):window.localStorage.removeItem('authTokenType')
    userId?window.localStorage.setItem('userId', userId):window.localStorage.removeItem('userId')
    usernameLocal?window.localStorage.setItem('username', usernameLocal):window.localStorage.removeItem('username')
  },[authToken, authTokenType, userId, usernameLocal])

  const signIn = async(e)=>{
    e?.preventDefault();

    // let formData= new FormData()
    // formData.append('username', username)
    // formData.append('password', password)
    let formData= new URLSearchParams()
    formData.append('username', username)
    formData.append('password', password)
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();
      setAuthToken(data.access_token);
      setAuthTokenType(data.token_type);
      setUserId(data.user_id);
      setLocalUsername(data.username);
      setUsername("");
      setPassword("");
      setEmail("");
      setOpenSignIn(false);
    } catch (error) {
      console.log(error);
      alert(error.message || "Login failed");
    }
  }
  const signUp = (e)=>{
    e?.preventDefault();
    
    let formDataSignUp= JSON.stringify({
      username:username,
      email:email,
      password:password
    })

    const requestOptions = {
      method:'POST',
      headers:{"Content-Type": "application/json"},
      body:formDataSignUp
    }
    fetch(process.env.REACT_APP_BACKEND_URL + '/user/', requestOptions)
    .then(response=>{
        if(response.ok){
          return response.json()
        }
        throw response
    })
    .then(data=>{
      signIn()
    })
    .catch(error=>{
      console.log(error)
      alert(error)
    })
    setOpenSignUp(false)
  }
  useEffect(() => {
    const fetchPosts = async()=>{
      try{
        const response = await fetch(process.env.REACT_APP_BACKEND_URL +'/post/all')
        if(!response.ok){
          throw  new Error(`Http error: ${response.status}`)
        }
        const data = await response.json()
        const result=[...data].sort((a,b)=>{
          return new Date(b.timestamp) - new Date(a.timestamp)
        })
        setPosts(result)
      }catch(error){
        console.log(error)
      }
    }
    fetchPosts()
   
  }, [])

  const signOut=(event)=>{
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId('')
    setLocalUsername('')
  }

  // console.log('usernameLocal', usernameLocal)
  return (
    <div className='app'>
      <Modal open={openSignIn} onClose={()=>setOpenSignIn(false)}>
        <Box
          sx={{
            backgroundColor: "background.paper",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            border: "2px solid #000",
            boxShadow: 24,
            pt: 2,
            pr: 4,
            pb: 3,
            pl: 4,
          }}
        >
          <form className='app_signIn' onSubmit={signIn}>
            <center>
              <img className='app_headerImage' src='https://img.freepik.com/premium-vector/instagram-logo_628407-1909.jpg' alt='instagram'/>
            </center>
            <Input placeholder='username' type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <Input placeholder='password' type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Button type='submit'>Login</Button>
          </form>
        </Box>
      </Modal> 


      <Modal open={openSignUp} onClose={()=>setOpenSignUp(false)}>
        <Box
          sx={{
            backgroundColor: "background.paper",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            border: "2px solid #000",
            boxShadow: 24,
            pt: 2,
            pr: 4,
            pb: 3,
            pl: 4,
          }}
        >
          <form className='app_signIn' onSubmit={signUp}>
            <center>
              <img className='app_headerImage' src='https://img.freepik.com/premium-vector/instagram-logo_628407-1909.jpg' alt='instagram'/>
            </center>
            <Input placeholder='username' type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <Input placeholder='email' type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <Input placeholder='password' type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Button type='submit'>Sign Up</Button>
          </form>
        </Box>
      </Modal> 
      <div className='app_header'>
        <img className='app_headerImage' src='https://img.freepik.com/premium-vector/instagram-logo_628407-1909.jpg' alt='instagram'/>
        {authToken ?(
          <Button onClick={()=>{signOut()}}>Logout</Button>
        ):(<div className=''>
          <Button onClick={()=>{setOpenSignIn(true)}}>Login</Button>
          <Button onClick={()=>{setOpenSignUp(true)}}>SignUp</Button>
        </div>)}
      </div>
      <div className='app_posts'>
        {
          posts.map(post=>(
            <Post key={post.id} post={post} authToken={authToken}
              authTokenType={authTokenType}
              userId={userId} username={usernameLocal}/>
          ))
        }

        {
          authToken?
          (
            <div>
              <ImageUpload
              authToken={authToken}
              authTokenType={authTokenType}
              userId={userId}
              />
            </div>
          ):(
            <h3>You need to login to upload</h3>
          )
        }
      </div>
    </div>
  );
}

export default App;
