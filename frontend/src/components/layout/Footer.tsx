import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-navy text-cream pt-[70px] px-10 pb-[30px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1180px] mx-auto mb-[50px]">
        <div className="flex flex-col">
          {/* Logo Placeholder */}
          <span className="text-cream font-fraunces font-black text-2xl tracking-tighter mb-4">TANGENT</span>
          <p className="text-[14px] text-cream/65 max-w-[260px] leading-[1.6]">
            Stay Sharp. Stay Tangent. Elevating everyday energy with unmatched taste and focus.
          </p>
        </div>

        <div className="flex flex-col">
          <h5 className="text-[13px] tracking-[.06em] uppercase text-sand mb-4">Shop</h5>
          <Link href="#" className="block text-[14.5px] text-cream/80 mb-[11px] hover:text-cream">All Energy</Link>
          <Link href="#" className="block text-[14.5px] text-cream/80 mb-[11px] hover:text-cream">Merch</Link>
          <Link href="#" className="block text-[14.5px] text-cream/80 mb-[11px] hover:text-cream">Subscriptions</Link>
        </div>

        <div className="flex flex-col">
          <h5 className="text-[13px] tracking-[.06em] uppercase text-sand mb-4">Support</h5>
          <Link href="#" className="block text-[14.5px] text-cream/80 mb-[11px] hover:text-cream">FAQ</Link>
          <Link href="#" className="block text-[14.5px] text-cream/80 mb-[11px] hover:text-cream">Shipping & Returns</Link>
          <Link href="#" className="block text-[14.5px] text-cream/80 mb-[11px] hover:text-cream">Contact Us</Link>
        </div>

        <div className="flex flex-col">
          <h5 className="text-[13px] tracking-[.06em] uppercase text-sand mb-4">Stay in the loop</h5>
          <p className="text-[14.5px] text-cream/80 mb-3">Sign up for updates, new drops, and 10% off your first order.</p>
          <form className="flex mt-3 max-w-[320px]">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 border-none py-3 px-4 rounded-l-full text-[14px] bg-white text-navy focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-sand text-navy font-bold py-3 px-5 rounded-r-full text-[14px] hover:bg-sand-deep transition-colors cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto pt-[26px] border-t border-cream/15 flex justify-between items-center text-[13px] text-cream/55 flex-wrap gap-3">
        <p>&copy; {new Date().getFullYear()} Tangent Energy. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-cream">
            <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </Link>
          <Link href="#" className="hover:text-cream">
            <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
          </Link>
          <Link href="#" className="hover:text-cream">
            <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
