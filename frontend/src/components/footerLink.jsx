'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterLink() {
    const currentRoute = usePathname();
    return (
        <Link className={ currentRoute === '/about' ? "text-clamp1 hover:text-appturq hover:translate-y-1 active:text-appturq active:underline transition-all duration-200 ease-in-out text-apppink focus:text-apppink drop-shadow-linkTxt underline uppercase" : "hover:text-appturq hover:translate-y-1 active:text-appturq focus:text-appturq active:underline transition-all duration-200 ease-in-out text-clamp1" } href="/about" as={ '/about' }>About</Link>
    )
}
