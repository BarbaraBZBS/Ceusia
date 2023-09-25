'use client';
import React, { useEffect, useRef } from "react";
import Loading from "./loading";

export default function AppLoad() {
    const loadRef = useRef()

    useEffect( () => {
        setTimeout( () => {
            loadRef.current.style.display = 'none'
        }, 3000 )
    }, [] )

    return (
        <div ref={ loadRef } className="w-full min-w-screen h-full z-[1000] fixed bg-white pt-20" >
            <Loading />
        </div>
    )
}