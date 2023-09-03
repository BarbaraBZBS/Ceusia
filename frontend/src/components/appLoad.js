'use client';
import React, { useEffect, useRef } from "react";
import Loading from "../app/loading";

export default function AppLoad() {
    const loadRef = useRef()

    useEffect( () => {
        setTimeout( () => {
            loadRef.current.style.display = 'none'
        }, 3000 )
    }, [] )

    return (
        <div ref={ loadRef } className="w-[100vw] h-[100vh] z-[1000] fixed bg-white pt-20" >
            <Loading />
        </div>
    )
}