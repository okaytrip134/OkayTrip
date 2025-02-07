import React from "react";
import logo from "../assets/Logo/Trip ok new 2 black-01.png"; // Adjust path as needed

const CopyrightPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen">
      
      {/* ✅ Company Logo */}
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Company Logo" className="h-16 md:h-20" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        📜 Copyright Policy
      </h1>

      {/* 🔍 Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔍 Introduction</h2>
        <p className="text-gray-700">
          This <strong>Copyright Policy</strong> outlines how content on <strong>OkayTrip</strong> is protected and the guidelines for its use. By accessing our website, you <strong>agree to respect copyright laws</strong> and intellectual property rights.
        </p>
      </section>

      {/* 🛡️ Copyright Ownership */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🛡️ Copyright Ownership</h2>
        <p className="text-gray-700">
          All content on this website, including but not limited to <strong>text, images, videos, graphics, designs, logos, and code</strong>, is <strong>owned by OkayTrip</strong> or its licensed partners unless otherwise stated. Unauthorized use, reproduction, or modification <strong>is strictly prohibited</strong>.
        </p>
      </section>

      {/* ✅ Permitted Uses */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">✅ Permitted Uses</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Personal use, such as reading and sharing content with proper attribution.</li>
          <li>Quoting small portions of content with a <strong>clear credit to OkayTrip</strong>.</li>
          <li>Using official press materials <strong>with written permission</strong>.</li>
        </ul>
      </section>

      {/* 🚫 Prohibited Uses */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚫 Prohibited Uses</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Reproducing, modifying, or distributing content <strong>without permission</strong>.</li>
          <li>Using our logos, images, or branding for <strong>commercial purposes</strong>.</li>
          <li>Copying travel itineraries, guides, or tour details for <strong>resale or redistribution</strong>.</li>
          <li>Scraping, mirroring, or replicating our website content.</li>
        </ul>
      </section>

      {/* ⚖️ Copyright Infringement & Reporting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">⚖️ Copyright Infringement & Reporting</h2>
        <p className="text-gray-700">
          If you believe that any content on OkayTrip <strong>infringes on your copyright</strong>, please contact us immediately. Provide:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
          <li><strong>A description</strong> of the copyrighted material and its location.</li>
          <li><strong>Your contact information</strong> (Name, Email, Phone).</li>
          <li><strong>A statement of ownership</strong> confirming your rights.</li>
        </ul>
        <p className="mt-2">
          📧 Email us at: <a href="mailto:copyright@okaytrip.in" className="text-blue-600">copyright@okaytrip.in</a>
        </p>
      </section>

      {/* 📄 License to Users */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📄 License to Users</h2>
        <p className="text-gray-700">
          Users are granted a <strong>limited, non-exclusive, revocable license</strong> to access and use the content <strong>for personal and non-commercial purposes</strong> only. This license <strong>does not</strong> grant ownership or the right to redistribute content.
        </p>
      </section>

      {/* 🌎 Third-Party Content */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🌎 Third-Party Content</h2>
        <p className="text-gray-700">
          Some images, logos, or resources on OkayTrip may be <strong>licensed from third parties</strong>. The respective copyrights and trademarks <strong>belong to their owners</strong>. If you need to use such content, please obtain permission from the original copyright holder.
        </p>
      </section>

      {/* 🔄 Changes to This Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🔄 Changes to This Policy</h2>
        <p className="text-gray-700">
          OkayTrip reserves the right to <strong>modify or update</strong> this Copyright Policy at any time. Changes will be effective immediately upon posting on our website.
        </p>
      </section>

      {/* 📩 Contact Information */}
      <section className="text-center mt-8">
        <p className="text-gray-600">
          If you have any questions, please reach out to us at: <br />
          📧 <a href="mailto:support@okaytrip.in" className="text-blue-600">support@okaytrip.in</a>
        </p>
      </section>
    </div>
  );
};

export default CopyrightPolicy;
