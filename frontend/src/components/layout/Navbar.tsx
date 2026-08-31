import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, Menu } from "lucide-react";

export function Navbar() {
  return (
    <>
      <div className="bg-navy text-cream text-center text-[13px] tracking-[.02em] py-[9px] px-4 font-medium">
        $3.49 flat rate shipping <span className="opacity-55 mx-2">•</span> Orders $40+ ship FREE
      </div>

      <nav className="bg-cream flex items-center justify-between py-[18px] px-10 sticky top-0 z-50 border-b border-navy/10">
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/shop" className="text-[15px] font-semibold text-navy relative group">
            Shop All
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
          </Link>
          <Link href="/contact-us" className="text-[15px] font-semibold text-navy relative group">
            Contact us
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
          </Link>
          <Link href="/blog" className="text-[15px] font-semibold text-navy relative group">
            Blog
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
          </Link>
        </div>

        <div className="flex-1 flex justify-center md:justify-center md:flex-none">
          <Link href="/" className="flex items-center">
            <Image
              src="/tangent-logo.avif"
              alt="Tangent Logo"
              width={180}
              height={46}
              className="h-[46px] w-auto object-contain"
              style={{ width: "auto" }}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-[26px]">
          <button className="bg-transparent p-0.5 flex items-center group">
            <User className="w-[21px] h-[21px] stroke-navy group-hover:stroke-coral transition-colors" />
          </button>
          <button className="bg-transparent p-0.5 flex items-center group">
            <ShoppingCart className="w-[21px] h-[21px] stroke-navy group-hover:stroke-coral transition-colors" />
          </button>
          <button className="md:hidden bg-transparent p-0.5 flex items-center">
            <Menu className="w-6 h-6 stroke-navy" />
          </button>
        </div>
      </nav>
    </>
  );
}
