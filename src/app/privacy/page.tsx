import type { Metadata } from "next";
import { Footer, INSTAGRAM_URL, Nav } from "@/components/brand";

export const metadata: Metadata = { title: "Privacy notice · Minflix Events" };

// Optional: set PRIVACY_EMAIL on the server to show a contact email here as well as Instagram.
const EMAIL = process.env.PRIVACY_EMAIL;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-2.5">
    <h2 className="m-0 text-xl font-bold">{title}</h2>
    <div className="flex flex-col gap-2.5 text-[15px] leading-relaxed text-[#D6E1E5]">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="orb -right-40 -top-40 size-[480px] bg-magenta/25" />
      <Nav />
      <article className="relative mx-auto flex max-w-[720px] flex-col gap-8 px-4 pb-20 pt-10">
        <header className="flex flex-col gap-2">
          <h1 className="display m-0 text-[clamp(32px,5vw,48px)]">Privacy notice</h1>
          <p className="m-0 text-fog">Minflix Events waitlist · Last updated 11 October 2026</p>
          <p className="m-0 text-[15px] leading-relaxed text-[#D6E1E5]">
            This explains what Minflix collects when you join the Minflix Events waitlist or visit this site, why, and the choices you
            have. It is written to meet the Nigeria Data Protection Act 2023 and the EU and UK GDPR.
          </p>
        </header>

        <Section title="Who we are">
          <p className="m-0">Minflix, the short film streaming platform at minflix.com, runs this waitlist for Minflix Events, its upcoming tool for film festivals.</p>
        </Section>

        <Section title="What we collect">
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5">
            <li><b>Your signup:</b> email, festival name, country, and if you add them, logo, festival type, films per edition, next edition and website or social link.</li>
            <li><b>Your answer</b> to &ldquo;What&apos;s the biggest headache you have running your festival?&rdquo;, if you give one.</li>
            <li><b>How you found us:</b> the campaign tag in the link you used, the site that linked you, or the festival that invited you.</li>
            <li><b>Your consent:</b> the date you agreed to this notice.</li>
            <li><b>Visits:</b> which pages are viewed, counted without cookies. We store a code made from your network address, browser and the date that changes every day and can&apos;t be turned back into your address. We never store your IP address. If your browser sends &ldquo;Do Not Track&rdquo; or Global Privacy Control, we don&apos;t count your visit.</li>
            <li><b>Error reports:</b> if a page fails on your device, the error message, the step it happened at and your browser type, kept for 30 days. Nothing you typed is included.</li>
            <li><b>Spam protection:</b> a one-way code of your network address when you submit the form, kept for 7 days, to limit repeated signups.</li>
          </ul>
        </Section>

        <Section title="Why we use it">
          <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5">
            <li>To contact you about Minflix Events, including when it launches (based on your consent).</li>
            <li>To list your festival in the public Minflix Events Directory and create your festival card (based on your consent).</li>
            <li>To learn which channels bring festivals to us and which features matter most (our legitimate interest in improving Minflix Events).</li>
            <li>To keep the waitlist free of spam and fake listings (our legitimate interest in security).</li>
          </ul>
          <p className="m-0">We don&apos;t sell your information or use it for advertising.</p>
        </Section>

        <Section title="What is public">
          <p className="m-0">
            Your festival&apos;s name, country, type, next edition, website or social link and logo appear in the public directory, on your festival
            card and on the Festival network page. Your email, your biggest-need answer and how you found us are never shown publicly.
          </p>
        </Section>

        <Section title="Where it's stored and for how long">
          <p className="m-0">
            Your information is stored with Supabase, our database provider, on servers in London, United Kingdom. The site itself is hosted
            by Minflix. We keep your signup until Minflix Events launches and for up to 24 months afterwards, unless you ask us to delete it
            sooner. Visit counts are kept for up to 13 months.
          </p>
        </Section>

        <Section title="Your rights">
          <p className="m-0">
            You can ask to see, correct or delete your information, ask us to stop using it, or withdraw your consent at any time. Withdrawing
            consent removes your festival from the directory and stops our emails.
          </p>
          <p className="m-0">
            To do any of this, message us on Instagram at{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="text-white underline">@minflix</a>
            {EMAIL && (
              <>
                {" "}or email <a href={`mailto:${EMAIL}`} className="text-white underline">{EMAIL}</a>
              </>
            )}
            . We reply within 30 days.
          </p>
          <p className="m-0">
            If you&apos;re not happy with how we handle your information, you can complain to the Nigeria Data Protection Commission
            (ndpc.gov.ng), or, in the UK, the Information Commissioner&apos;s Office (ico.org.uk), or your local data protection authority in the EU.
          </p>
        </Section>

        <Section title="Changes">
          <p className="m-0">If we change this notice, we&apos;ll update the date at the top. If a change affects how we use your information, we&apos;ll ask for your consent again.</p>
        </Section>
      </article>
      <Footer />
    </main>
  );
}
