import React from "react";

const TermsConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Terms & Conditions
      </h1>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📜 Introduction</h2>
        <p className="text-gray-700">
          Welcome to <b>OkayTrip.</b> By accessing and using our website and services, you agree to comply with the following <b>terms & conditions</b>. Please read them carefully before booking a trip or using any services.
        </p>
      </section>

      {/* User Responsibilities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">👥 User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Users must provide <b>accurate personal details</b> when making a booking.</li>
          <li>Users are responsible for ensuring their <b>passport, visa, and travel documents</b> are valid.</li>
          <li>Users must comply with local laws, customs, and travel regulations of the destination.</li>
          <li>Any misuse of the platform, including fraudulent transactions, will lead to <b>account suspension</b>.</li>
        </ul>
      </section>

      {/* Booking & Payment Policies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">💳 Booking & Payment</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>A <b>deposit or full payment</b> may be required to confirm a booking.</li>
          <li>All payments must be made through our <b>secure online payment gateway</b>.</li>
          <li>Certain bookings may be <b>non-refundable</b>, as specified at the time of purchase.</li>
          <li>We are not responsible for <b>currency conversion charges</b> or bank fees.</li>
        </ul>
      </section>

      {/* Cancellations & Refunds */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚫 Cancellations & Refunds</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Refunds will be processed according to our <a href="/refund-policy" className="text-blue-600">Refund Policy</a>.</li>
          <li>Cancellations made within <b>14 days</b> of departure may not be eligible for a refund.</li>
          <li>Service fees and <b>non-refundable components</b> (e.g., flights, accommodation) may be deducted.</li>
        </ul>
      </section>

      {/* Travel Disruptions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">✈️ Travel Disruptions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>OkayTrip is not liable for <b>flight delays, cancellations, or force majeure events</b>.</li>
          <li>Alternative arrangements may be provided in case of disruptions, but we <b>do not guarantee refunds</b> for third-party services.</li>
        </ul>
      </section>

      {/* Liability Disclaimer */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚖️ Liability Disclaimer</h2>
        <p className="text-gray-700">
          We strive to provide the best travel experiences; however, <b>we do not assume liability</b> for:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Delays, losses, injuries, accidents, or damages during travel.</li>
          <li>Third-party service failures (e.g., hotels, airlines, car rentals).</li>
          <li>Acts of nature, war, civil disturbances, or pandemics.</li>
        </ul>
      </section>

      {/* Privacy Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔒 Privacy & Data Security</h2>
        <p className="text-gray-700">
          By using our services, you agree to our <a href="/privacy-policy" className="text-blue-600">Privacy Policy</a>. Your personal data is stored securely and will not be shared with third parties without consent.
        </p>
      </section>

      {/* Changes to Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔄 Changes to Terms</h2>
        <p className="text-gray-700">
          We reserve the right to <b>update or modify</b> these terms at any time. Any changes will be effective immediately upon posting on our website.
        </p>
      </section>

      {/* Contact Information */}
      <section className="text-center mt-8">
        <p className="text-gray-600">
          If you have any questions, contact us at: <br />
          📧 <a href="mailto:support@okaytrip.in" className="text-blue-600">support@okaytrip.in</a>
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
