import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex flex-row justify-between">
            <div>
                <Link href="/">
                    <Image
                        src="/images/logo.png"
                        alt="ceusia Logo"
                        width={180}
                        height={37}
                    />
                </Link>
            </div>
            <nav className="flex flex-col justify-evenly">
                <Link href="/">Home</Link>
                <Link href="/">Profile</Link>
            </nav>
        </header>
    )
}