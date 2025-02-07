import React from "react";

const RefundPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Refund Policy
      </h1>

      {/* Eligibility for Refunds */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-blue-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🏆 Eligibility for Refunds
        </h2>
        <h4 className="text-base font-semibold text-gray-800 mb-4">Customers may be eligible for a refund in the following circumstances:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>🚫 Cancellation by the Travel Agency:</strong> If the agency cancels a trip for any reason, customers will receive a <strong>full refund</strong> of the total trip cost, including any additional services booked Tours.
          </li>
          <li>
            <strong>🔄 Significant Changes to Itinerary or Accommodations:</strong> If there are significant changes to the original itinerary or accommodations, such as a change in the destination, dates, or quality of the accommodation, customers will have the option to either accept the new arrangements or request a refund.
          </li>
          <li>
            <strong>🩺 Medical Emergencies or Personal Reasons:</strong> If a customer needs to cancel due to a medical emergency or other personal reasons, they may be eligible for a <strong>partial refund</strong>, subject to the terms listed below. Documentation (e.g., medical certificates) will be required for verification.
          </li>
        </ul>
      </div>

      {/* Refund Timelines */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-green-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ⏳ Refund Timelines
        </h2>
        <h4 className="text-base font-semibold text-gray-800 mb-4">Refund requests must be submitted within the following timeframes for consideration:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>💯 Full Refund:</strong> Cancellations made 30 or more days prior to the trip's scheduled departure date will be eligible for a full refund.</li>
          <li><strong>🔸 Partial Refund:</strong> Cancellations made between 15 and 29 days prior to the trip will be eligible for a partial refund. The refund amount will vary based on the specific trip and services booked.</li>
          <li><strong>❌ No Refund:</strong> Cancellations made within 14 days of the scheduled trip departure date will not be eligible for any refund.</li>
          <li><strong>⏱️ Processing Time:</strong> Refund requests will be processed within 10-15 business days once all required documentation has been submitted and approved.</li>
        </ul>
      </div>

      {/* Refund Amounts */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-purple-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          💰 Refund Amounts
        </h2>
        <h4 className="text-base font-semibold text-gray-800 mb-4">The refund amount will depend on when the cancellation request is made and the specifics of the booking:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>✅ Full Refund:</strong> A full refund will be issued if the cancellation is made 30 or more days before the scheduled departure date, minus any non-refundable fees (see below for exclusions).</li>
          <li><strong>🟡 Partial Refund:</strong> Cancellations made 15 to 29 days prior to departure will receive a partial refund. This will generally be 50% to 75% of the total trip cost, depending on the services involved (e.g., flights, accommodations, tours).</li>
          <li><strong>❌ No Refund:</strong> Cancellations made within 14 days of the trip will not be eligible for a refund.</li>
        </ul>
        <p className="mt-4 text-gray-700">Refunds will be issued via the same payment method used for the original booking, unless otherwise specified. Any applicable currency conversion or banking fees may apply.</p>
      </div>

      {/* Exclusions and Limitations */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-yellow-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ⚠️ Exclusions and Limitations
        </h2>
        <h4 className="text-base font-semibold text-gray-800 mb-4">Please note the following exclusions and limitations:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Non-Refundable Fees:</strong> Certain fees such as booking fees, service charges, and administrative fees are non-refundable. These fees are clearly specified at the time of booking.</li>
          <li><strong>Non-Refundable Components:</strong> Certain trip components such as flights, pre-paid accommodations, and activities may not be refundable due to restrictions imposed by the service providers (e.g., airlines, hotels). In these cases, customers may be eligible for a credit or voucher, but not a cash refund.</li>
          <li><strong>Group Bookings & Package Deals:</strong> For group bookings or package deals, specific refund terms may apply based on the agreement made at the time of booking. These terms may differ from individual booking policies and are subject to the terms of the vendors involved.</li>
        </ul>
      </div>

      {/* Refund Process */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-orange-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📩 Refund Process
        </h2>
        <h4 className="text-base font-semibold text-gray-800 mb-4">To request a refund, customers must follow these steps:</h4>
        <ol className="list-decimal list-inside text-gray-700 space-y-4">
          <li>
            <strong>📌 Submit a Refund Request:</strong> Complete the refund request form available on our website or email our customer service team at support@okaytrip.in. Include your booking reference number, trip details, and reason for cancellation.
          </li>
          <li>
            <strong>📎 Provide Required Documentation:</strong> Depending on the reason for the cancellation, you may be required to submit supporting documents, such as:
            <ul className="list-disc list-inside ml-8 mt-2 space-y-1">
              <li>Proof of cancellation (e.g., flight cancellation notice)</li>
              <li>Medical documentation (e.g., doctor's note or hospital records) for medical-related cancellations</li>
              <li>Any other relevant supporting documents as requested</li>
            </ul>
          </li>
          <li>
            <strong>🕵️ Review & Approval:</strong> Once your refund request and documentation are received, our team will review your case and determine the eligibility for a refund. We will notify you of our decision within 5 business days.
          </li>
          <li>
            <strong>💸 Refund Issuance:</strong> If approved, your refund will be processed within 10-15 business days. Refunds will be issued to the original method of payment unless otherwise specified. Please note that additional processing times may apply, depending on your payment provider.
          </li>
        </ol>
      </div>

      {/* Contact Information */}
      <div className="text-center mt-8 p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600">
          If you have any questions or concerns regarding your refund request, feel free to contact us at:
          <br />
          <a href="mailto:support@okaytrip.in" className="text-blue-600 hover:text-blue-700 font-semibold">
            support@okaytrip.in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;