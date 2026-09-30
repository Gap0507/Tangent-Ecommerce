import React from "react";
import localFont from "next/font/local";

const alpino = localFont({
  src: "../../../public/fonts/Alpino-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-alpino",
});

export const metadata = {
  title: "Privacy Policy | Tangent",
  description: "Privacy Policy for Tangent eCommerce",
};

export default function PrivacyPolicy() {
  return (
    <main className={`min-h-screen bg-[#FAF7F2] text-[#0A2540] pt-32 pb-24 px-6 md:px-12 ${alpino.className}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-fraunces font-black text-4xl md:text-6xl mb-4 text-sky-950">Privacy Policy</h1>
        <p className="text-[#0A2540]/60 mb-12 font-semibold">Last Updated: October 2026</p>

        <div className="space-y-10 text-[16px] md:text-[18px] leading-[1.8] text-[#0A2540]/85 font-medium">
          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">1. Introduction</h2>
            <p>
              Welcome to Tangent. We value your privacy and are committed to protecting your personal data. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">2. Information We Collect</h2>
            <p className="mb-4">We collect several different types of information for various purposes to provide and improve our service to you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> When purchasing, we may ask you to provide us with certain personally identifiable information such as your email address, first name and last name, phone number, and shipping address.</li>
              <li><strong>Usage Data:</strong> We may also collect information on how the service is accessed and used. This may include your computer's Internet Protocol (IP) address, browser type, browser version, and pages visited.</li>
              <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our service and hold certain information.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">3. How We Use Your Data</h2>
            <p className="mb-4">Tangent uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and fulfill your orders, including sending emails to confirm your order status.</li>
              <li>To provide customer support.</li>
              <li>To notify you about changes to our service or products.</li>
              <li>To monitor the usage of the service.</li>
              <li>To detect, prevent and address technical issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">4. Sharing Your Data</h2>
            <p>
              We do not sell your personal information to third parties. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential (e.g., shipping providers, payment processors).
            </p>
          </section>

          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">5. Security of Data</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces font-bold text-2xl md:text-3xl mb-4 text-sky-950">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:info@tangentfnb.com" className="text-orange-600 hover:underline font-semibold">info@tangentfnb.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
