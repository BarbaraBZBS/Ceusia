'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Footer() {
    const currentRoute = usePathname();

    return (
        <footer className="mt-5 bg-gray-200 bg-opacity-60 flex flex-col text-appmagenta">
            <div className="flex justify-end p-3 m-3">
                <nav className="linkAnim signLink">
                    <Link className={ currentRoute === '/about' ? "text-clamp1 signLink activeLink uppercase" : "signLink text-clamp1" } href="/about">About</Link>
                </nav>
            </div>
            <div className="text-clamp2 mx-7 text-center">
                <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Eget nisl hendrerit pellentesque nunc molestie quisque mattis. Finibus nostra cubilia ipsum scelerisque faucibus nullam ligula conubia curabitur.
                    Ipsum nulla nunc risus potenti risus nisi dictum. Facilisis mattis tincidunt proin consequat; enim nullam. Nulla suspendisse curae lectus; gravida eros feugiat sollicitudin faucibus.
                    Bibendum curae bibendum fermentum etiam etiam.
                </p>
            </div>
            <div className="my-2 flex flex-col justify-center items-center text-clamp2">
                <a href={ `mailto:${ 'logi@ceusia.com' }` }>📧 logi@ceusia.com</a>
                <a href={ `tel:${ '565 54 985 653 333' }` }>📞 565 54 985 653 333</a>
                <p>📬 569 floral street 98632 ALJIFLAS</p>
            </div>
            <div className="flex justify-center text-clamp2 items-center text-center">
                <p>Copyright 1999-2023 by Ceusia. All Rights Reserved.</p>
            </div>
            <div className="flex justify-center my-2">
                <Image className="h-auto object-cover"
                    src="/images/logoSmRound.png"
                    alt="ceusia footer logo"
                    width={ 35 }
                    height={ 35 }
                />
            </div>
        </footer>
    )
}