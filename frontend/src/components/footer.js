import React from "react";
import Image from "next/image";
import Link from "next/link";


export default function Footer() {
    return (
        <footer>
            <div>
                <nav>
                    <Link href="/about">About</Link>
                </nav>
            </div>
            <div>
                <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Eget nisl hendrerit pellentesque nunc molestie quisque mattis. Finibus nostra cubilia ipsum scelerisque faucibus nullam ligula conubia curabitur.
                    Ipsum nulla nunc risus potenti risus nisi dictum. Facilisis mattis tincidunt proin consequat; enim nullam. Ridiculus eu urna auctor efficitur quisque felis habitant? Nulla suspendisse curae lectus;
                    gravida eros feugiat sollicitudin faucibus. Bibendum curae bibendum fermentum etiam etiam. Semper interdum sed faucibus ornare eleifend.
                </p>
            </div>
            <div>
                📧 logi@ceusia.com
                📞 565 54 985 653 333
                📬 569 floral street 98632 ALJIFLAS
            </div>
            <div>
                <p>Copyright 1999-2023 by Ceusia. All Rights Reserved.</p>
            </div>
            <div>
                <Image
                    src="/images/logoSm.png"
                    alt="ceusia Logo"
                    width={ 50 }
                    height={ 0 }
                />
            </div>
        </footer>
    )
}