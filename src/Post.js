import React, {useState, useEffect} from 'react'
import './Post.css'
import {Avatar, Button} from '@mui/material'

// const BASE_URL='http://localhost:8000/'
function Post({key, post, authToken, authTokenType, username}){
    
    // console.log('post', post)

    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')

    useEffect(()=>{
        setComments(post.comments)
        if(post.image_url_type==='absolute'){
            setImageUrl(post.image_url)
        }else{
            setImageUrl(process.env.REACT_APP_BACKEND_URL + post.image_url)
        }
    },[])

    const handleDeletion=(e)=>{
        e?.preventDefault()

        
        // console.log('json_string', json_string)
        const myHeaders=new Headers()
        myHeaders.append('Authorization', authTokenType + ' ' + authToken)
        const requestOptions={
            method:'GET',
            headers:myHeaders
        }

        fetch(process.env.REACT_APP_BACKEND_URL +'/post/delete/' + post.id, requestOptions)
        .then(response=>{
            if(response.ok){
                return response.json()
            }
            throw response
        })
        .then(data=>{
            window.location.reload()
            window.scrollTo(0,0)
        })
        .catch(error=>{
            console.log(error)
        })
    }
    const submitHandler=(e)=>{
        e?.preventDefault()

        
        const json_string=JSON.stringify({
            'username':username,
            'content':newComment,
            'post_id':post.id

        })
        // console.log('json_string', json_string)
        const myHeaders=new Headers()
        myHeaders.append('Authorization', authTokenType + ' ' + authToken)
        myHeaders.append('Content-Type','application/json')
        const requestOptions={
            method:'POST',
            headers:myHeaders,
            body:json_string
        }

        fetch(process.env.REACT_APP_BACKEND_URL +'/comment', requestOptions)
        .then(response=>{
            if(response.ok){
                return response.json()
            }
            throw response
        })
        .then(data=>{
            console.log(data)
            fetchComments()
            setNewComment('')
        })
        .catch(error=>{
            console.log(error)
        })
    
    }

    const fetchComments = ()=>{
        fetch(process.env.REACT_APP_BACKEND_URL +'/comment/all/' + post.id)
        .then(response=>{
            if(response.ok){
                return response.json()
            }
            throw response
        })
        .then(data=>{
            setComments(data)
        })
    }

    // console.log('comments', comments)
    return(
        <div className='post'>
            <div className='post_header'>
                <Avatar
                    alt='Sergey'
                    src=''
                />
                <div className='post_headerInfo'>
                    <h3>{post.user.username}</h3>
                    <Button className='post_delete' onClick={handleDeletion}>Delete</Button>
                </div>
            </div>
            <img 
                className='post_image'
                src={imageUrl}
                alt='instaimage'
            />
            <h4 className='post_text'>{post.caption}</h4>

            <div className='post_comments'>
                {comments.map(comment=>(
                    <p>
                        <strong>{comment.username}:</strong>{comment.content}
                    </p>
                ))
                }
            </div>
            {authToken && (
                <form className='post_commentbox' onSubmit={submitHandler}>
                    <input className='post_input' type='text' placeholder='Add a comment' value={newComment} onChange={(e)=>setNewComment(e.target.value)}/>
                    <button className='post_button' type='submit' disabled={!newComment}>Post</button>
                </form>
            )}
        </div>
    )
}

export default Post