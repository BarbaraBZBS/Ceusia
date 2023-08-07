import React from 'react'
import axios from 'axios'


async function getPosts() {
    const res = await axios.get( 'http://localhost:8000/api/posts' )
    //add authorization bearer with token in cookie??
    // console.log( 'res: ', res )
    const data = res.data
    console.log( 'res data: ', data )
    return data
}

export default async function PostCards() {
    const posts = await getPosts()
    console.log( posts )

    return (
        <div>
            { posts?.map( ( post ) => (
                <div key={ post.id }>
                    <div>
                        { post.title ? <h2>{ post.title }</h2> : '' }
                    </div>
                    <div>
                        <p>{ post.content }</p>
                    </div>
                    <div>
                        { post.fileUrl && post.fileUrl?.includes( 'image' ) ? <img src={ post.fileUrl } alt="post image" /> : post.fileUrl?.includes( 'video' ) ? <video id={ post.id } width="320" height="176" controls > <source src={ post.fileUrl } type='video/mp4' /> Your browser does not support HTML5 video. </video> : post.fileUrl?.includes( 'audio' ) ? <audio controls > <source src={ post.fileUrl } type='audio/mp3' /> Your browser does not support the audio tag.</audio> : '' }
                    </div>
                    <div>
                        { post.link ? <p>{ post.link }</p> : '' }
                    </div>
                    <div>
                        <p>{ post.user.username }</p>
                    </div>
                    <div>
                        <span>{ post.likes }👍 { post.dislikes }👎 </span>
                    </div>

                </div>
            ) ) }
        </div>
    )
}