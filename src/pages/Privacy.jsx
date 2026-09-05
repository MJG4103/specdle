import { CONTACT_EMAIL, AMAZON_TAG, GOATCOUNTER_CODE } from "../config.js";

export default function Privacy() {
  return (
    <section className="space-y-4 text-sm">
      <h2 className="text-lg font-bold">Privacy</h2>
      <p><strong>No accounts, no sign-in, no server of ours.</strong> Specdle is a static site. Your guesses, stats and streak are stored in your browser's local storage and never sent to us. Clearing site data deletes them.</p>
      <p><strong>Analytics.</strong> {GOATCOUNTER_CODE
        ? "We use GoatCounter, a privacy-friendly counter that records page views and a few events (a puzzle won or lost, the share button) without cookies or personal identifiers."
        : "None at the moment. If we add a counter it will be cookie-free and this page will say so."}</p>
      <p><strong>Advertising.</strong> Specdle is free and may show display ads. Ad partners can set cookies and use identifiers, subject to your consent where the law requires it; we will name the partner here before any ad appears.</p>
      <p><strong>Affiliate links.</strong> {AMAZON_TAG
        ? "As an Amazon Associate, Specdle earns from qualifying purchases made through links marked as such. Amazon may set cookies when you follow one."
        : "Result pages may later link to Amazon with an affiliate tag; when they do, the link will be labelled and this page updated."}</p>
      <p><strong>Hosting.</strong> The site is served by Microsoft Azure Static Web Apps, which logs requests (IP address, user agent) for operation and security like any web host.</p>
      <p><strong>Contact.</strong> {CONTACT_EMAIL}</p>
      <p className="text-xs text-zinc-500">Last updated 2026-09-05.</p>
    </section>
  );
}
