import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactTrustBadges } from "@/components/contact/ContactTrustBadges";
import { ContactVisitUs } from "@/components/contact/ContactVisitUs";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactStayConnected } from "@/components/contact/ContactStayConnected";

export const metadata: Metadata = {
  title: "Contact Us | Tangent",
  description:
    "Get in touch with Tangent Beverages. Have a question, feedback, or want to say hi? Drop us a message and we'll get back to you soon.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <ContactHero />
      <ContactTrustBadges />
      <ContactVisitUs />
      <ContactFAQ />
      <ContactStayConnected />
    </div>
  );
}
