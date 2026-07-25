import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
      <div className="bg-gradient-to-br from-blue to-blue-deep text-cream flex flex-col justify-center px-8 py-[70px] lg:px-[70px] lg:py-[60px]">
        <div className="text-[13px] font-bold tracking-[.14em] text-sand mb-[18px] uppercase">
          Meet Your New Daily Driver
        </div>
        
        <h1 className="font-fraunces text-[clamp(40px,5vw,68px)] leading-[1.04] font-black mb-[22px]">
          Sharp Focus.<br />Zero Crash.
        </h1>
        
        <p className="text-[18px] leading-[1.55] max-w-[420px] text-cream/85 mb-[34px]">
          Tangent combines natural caffeine with L-theanine for a smooth, sustained energy lift that keeps you in the zone—without the jitters.
        </p>
        
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 bg-sand text-navy font-bold text-[16px] py-4 px-8 rounded-full w-fit transition-all duration-200 hover:bg-sand-deep hover:-translate-y-0.5"
        >
          Shop Now
          <ArrowRight className="w-4 h-4" />
        </Link>
        
        <div className="flex gap-[10px] mt-[32px] flex-wrap">
          <div className="text-[12px] font-semibold tracking-[.03em] border border-cream/40 py-1.5 px-3.5 rounded-full text-cream/90">
            Natural Caffeine
          </div>
          <div className="text-[12px] font-semibold tracking-[.03em] border border-cream/40 py-1.5 px-3.5 rounded-full text-cream/90">
            Zero Sugar
          </div>
          <div className="text-[12px] font-semibold tracking-[.03em] border border-cream/40 py-1.5 px-3.5 rounded-full text-cream/90">
            Vegan
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden min-h-[420px] lg:min-h-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
