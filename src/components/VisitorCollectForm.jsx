export default function VisitorCollectForm({ name, email, consent, setName, setEmail, setConsent, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-default mb-1">Full name</label>
        <input
          className="w-full px-4 py-2 rounded-lg border border-white/40 dark:border-white/20 bg-white/30 dark:bg-black/30 text-default focus:ring-2 focus:ring-focus focus:border-primary outline-none placeholder-gray-500 dark:placeholder-gray-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-default mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 rounded-lg border border-white/40 dark:border-white/20 bg-white/30 dark:bg-black/30 text-default focus:ring-2 focus:ring-focus focus:border-primary outline-none placeholder-gray-500 dark:placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex items-start space-x-2">
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="w-4 h-4 text-primary bg-transparent border-white/40 rounded focus:ring-focus"
        />
        <label htmlFor="consent" className="text-sm">
          I consent to Sedna processing my name and email to send a one-time PIN for sign-in. I confirm I’ve read the <a href="https://digirockinnovations.com/privacy-policy" className="underline">Privacy Policy</a> and <a href="https://digirockinnovations.com/terms-of-service" className="underline">Terms</a>.
        </label>
      </div>
      <p className="text-xs text-muted">Sedna uses your name and email only to deliver a one-time PIN and record your sign-in for security and analytics. See our Privacy Policy for details on retention and your rights.</p>
      <button
        type="submit"
        disabled={!consent}
        className="w-full py-3 text-lg font-semibold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50"
      >
        Continue
      </button>
    </form>
  );
}
