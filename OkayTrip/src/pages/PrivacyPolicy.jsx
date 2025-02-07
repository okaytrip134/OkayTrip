import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen ">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
      </div>

      {/* Introduction */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to Okaytrip. We are committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, share, and protect your personal data when you interact with our services. By using our services, you agree to the terms outlined in this policy. Our goal is to ensure that your experience with us is safe, secure, and tailored to your needs.
        </p>
      </div>

      {/* Information Collection */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Collection</h2>
        <p className="text-gray-700 mb-4">We collect personal information from you in the following ways:</p>
        <ul className="space-y-3 text-gray-700 list-disc pl-6">
          <li><span className="font-medium">Personal Details:</span> Such as your name, email address, phone number, and travel preferences.</li>
          <li><span className="font-medium">Travel and Payment Information:</span> Including your passport details, travel history, payment information, and booking preferences.</li>
          <li><span className="font-medium">Usage Data:</span> Information on how you interact with our website, apps, or services, including IP addresses, browser types, and pages visited.</li>
          <li><span className="font-medium">Third-Party Sources:</span> We may also obtain personal information from third parties, such as payment processors, travel partners, and social media platforms, in order to enhance your experience.</li>
        </ul>
      </div>

      {/* Information Use */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Use</h2>
        <p className="text-gray-700 mb-4">We use your personal data for the following purposes:</p>
        <ul className="space-y-3 text-gray-700 list-disc pl-6">
          <li><span className="font-medium">Booking and Reservations:</span> To process bookings, confirm reservations, and manage your travel itinerary.</li>
          <li><span className="font-medium">Personalized Recommendations:</span> To offer tailored travel suggestions, discounts, and promotions based on your preferences and past travels.</li>
          <li><span className="font-medium">Communication:</span> To contact you with important updates regarding your bookings, offers, and services.</li>
          <li><span className="font-medium">Customer Support:</span> To provide assistance and resolve any issues or inquiries you may have.</li>
          <li><span className="font-medium">Legal and Regulatory Compliance:</span> To comply with legal obligations, such as fraud prevention and tax reporting.</li>
        </ul>
      </div>

      {/* Information Sharing */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Sharing</h2>
        <p className="text-gray-700 mb-4">We respect your privacy and will not sell or rent your personal data to third parties. However, we may share your information in the following situations:</p>
        <ul className="space-y-3 text-gray-700 list-disc pl-6">
          <li><span className="font-medium">With Service Providers:</span> Third-party vendors who help process payments, manage bookings, or offer additional services you request.</li>
          <li><span className="font-medium">For Legal Compliance:</span> If required by law or to protect our legal rights, we may share information to comply with applicable regulations, such as anti-fraud measures or government investigations.</li>
          <li><span className="font-medium">With Your Consent:</span> We may share your data with third parties if you provide explicit consent, such as opting into marketing communications or promotions.</li>
        </ul>
      </div>

      {/* Data Security */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
        <p className="text-gray-700 mb-4">We are committed to safeguarding your personal information. We implement a variety of security measures to protect your data, including:</p>
        <ul className="space-y-3 text-gray-700 list-disc pl-6">
          <li><span className="font-medium">Encryption:</span> To protect sensitive data such as payment details during transmission.</li>
          <li><span className="font-medium">Access Controls:</span> Only authorized personnel have access to personal data, and they are required to maintain confidentiality.</li>
          <li><span className="font-medium">Regular Audits:</span> We conduct regular security audits to identify potential vulnerabilities and mitigate risks.</li>
          <li><span className="font-medium">Secure Storage:</span> Your data is stored in secure servers with advanced security measures to protect against unauthorized access, loss, or misuse.</li>
        </ul>
      </div>

      {/* Customer Rights */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Rights</h2>
        <p className="text-gray-700 mb-4">As a customer, you have the following rights regarding your personal information:</p>
        <ul className="space-y-3 text-gray-700 list-disc pl-6">
          <li><span className="font-medium">Access:</span> You can request access to the personal information we hold about you.</li>
          <li><span className="font-medium">Correction:</span> You can update or correct any inaccurate information.</li>
          <li><span className="font-medium">Deletion:</span> You have the right to request the deletion of your personal data, subject to certain exceptions (e.g., legal obligations).</li>
          <li><span className="font-medium">Opt-Out:</span> You can unsubscribe from marketing communications at any time.</li>
        </ul>
      </div>

      {/* Changes to Privacy Policy */}
      <div className="mb-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to the Privacy Policy</h2>
        <p className="text-gray-700 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. If we make significant changes, we will notify you through email or prominent notices on our website. We encourage you to review this policy periodically to stay informed about how we protect your personal information.
        </p>
      </div>

      {/* Contact Information */}
      <div className="text-center bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions, concerns, or requests regarding this Privacy Policy, or if you wish to exercise your rights under this policy, please contact us at:
        </p>
        <a href="mailto:support@okaytrip.in" className="text-blue-600 hover:text-blue-700 font-semibold">
          support@okaytrip.in
        </a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;