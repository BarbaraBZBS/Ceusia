'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterLink() {
    const currentRoute = usePathname();
    return (
        <Link className={ currentRoute === '/about' ? "text-clamp1 signLink activeLink uppercase" : "signLink text-clamp1" } href="/about">About</Link>
    )
}
