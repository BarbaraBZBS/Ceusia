'use client';
import React, { useState, useEffect } from 'react';

export default function LinkVideo( { postLink, postid } ) {
    const [ video, setVideo ] = useState();

    useEffect( () => {
        const handleVideo = () => {
            console.log( 'post link : ', postLink )
            if ( postLink.includes( "https://www.yout" ) ) {
                let embed = postLink.replace( "watch?v=", "embed/" );
                setVideo( embed.split( "&" )[ 0 ] );
            }
            else if ( postLink.includes( "https://yout" ) ) {
                let embLink = postLink.replace( "youtu.be/", "www.youtube.com/embed/" );
                let finLink = embLink.split( "?feature=shared" )[ 0 ];
                setVideo( finLink.split( "&" )[ 0 ] )
            }
        };
        handleVideo()
    }, [ postLink, video ] )

    return (
        <>
            {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/mkqqwLuq30w?si=qzmipKdPCYUERrq-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */ }
            { video ?
                <iframe className='border-0 rounded-[10px] mx-auto my-3' width="98%" height="200"
                    src={ video }
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
                // allowfullscreen></iframe>
                : <div className='my-1 mx-2 flex justify-center'><a className=' text-[blue]' href={ postLink }>{ postLink }</a></div> }
        </>
    )
}
