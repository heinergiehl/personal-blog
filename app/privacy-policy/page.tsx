const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">
        <strong>Effective Date:</strong> [Insert Date]
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Introduction
        </h2>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          Welcome to FileTalky.com (“we,” “us,” or “our”). Your privacy is
          critically important to us. This Privacy Policy explains how we
          collect, use, and protect your personal data when you visit and
          interact with our website and services.
        </p>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          We comply with the General Data Protection Regulation (GDPR), and as a
          data controller, we are committed to ensuring that your privacy is
          protected. Should we ask you to provide certain information by which
          you can be identified, you can be assured that it will only be used in
          accordance with this Privacy Policy.
        </p>
        <p className="text-base text-gray-700 leading-relaxed">
          By using our website and services, you agree to the collection and use
          of information in accordance with this policy. Please take a moment to
          read it carefully.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          1. Information We Collect
        </h2>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          We collect various types of personal data in order to provide and
          improve our service to you. The types of data we may collect include:
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          1.1 Personal Data
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          While using our service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you. Personally identifiable information may include, but is
          not limited to:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Name</li>
          <li>Email Address</li>
          <li>Account Information</li>
          <li>Payment Information (if applicable)</li>
          <li>IP Address</li>
          <li>Usage Data (e.g., browsing behavior, file interaction)</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          1.2 File Data
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          When using FileTalky to interact with files (such as PDFs, images,
          videos, audios, etc.), the files you upload and their metadata may be
          stored temporarily to enable you to use our service.
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          1.3 Usage Data
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          We may collect information about how the service is accessed and used,
          such as:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>Browser Type</li>
          <li>Browser Version</li>
          <li>Pages of our Service that you visit</li>
          <li>Time and Date of your Visit</li>
          <li>Time Spent on Pages</li>
          <li>Unique Device Identifiers</li>
          <li>Other Diagnostic Data</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          1.4 Cookies & Tracking Technologies
        </h3>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          We use cookies and similar tracking technologies to track the activity
          on our service and hold certain information. You can set your browser
          to refuse all or some browser cookies, or to alert you when websites
          set or access cookies. If you disable or refuse cookies, please note
          that some parts of the website may become inaccessible or not function
          properly.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          2. Your Rights Under GDPR
        </h2>
        <p className="text-base text-gray-700 leading-relaxed mb-4">
          If you are a resident of the European Economic Area (EEA), you have
          certain data protection rights under GDPR. FileTalky aims to take
          reasonable steps to allow you to correct, amend, delete, or limit the
          use of your personal data. These rights include:
        </p>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          <li>
            The right to access – You have the right to request copies of your
            personal data.
          </li>
          <li>
            The right to rectification – You have the right to request that we
            correct any information you believe is inaccurate or incomplete.
          </li>
          <li>
            The right to erasure – You have the right to request that we erase
            your personal data, under certain conditions.
          </li>
          <li>
            The right to restrict processing – You have the right to request
            that we restrict the processing of your personal data, under certain
            conditions.
          </li>
          <li>
            The right to object to processing – You have the right to object to
            our processing of your personal data, under certain conditions.
          </li>
          <li>
            The right to data portability – You have the right to request that
            we transfer the data that we have collected to another organization,
            or directly to you.
          </li>
        </ul>
      </section>
      {/* Add more sections here for a complete policy, as needed */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          3. Changes to This Privacy Policy
        </h2>
        <p className="text-base text-gray-700 leading-relaxed">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page. You are
          advised to review this Privacy Policy periodically for any changes.
          Changes to this Privacy Policy are effective when they are posted on
          this page.
        </p>
      </section>
    </div>
  )
}
export default PrivacyPolicy
