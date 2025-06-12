import React, { useState } from "react";

// Section component for each editable policy block
const Section = ({ title, initialContent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => setIsEditing(false);
  const handleEdit = () => setIsEditing(true);

  return (
    <section className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h2>

      {isEditing ? (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <button
            onClick={handleSave}
            className="mt-3 px-5 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-300">{content}</p>
          <button
            onClick={handleEdit}
            className="mt-3 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Edit
          </button>
        </>
      )}
    </section>
  );
};

// Main PrivacyPolicy component
const PrivacyPolicy = () => {
  const [heading, setHeading] = useState("Privacy Policy");
  const [isEditingHeading, setIsEditingHeading] = useState(false);

  const sections = [
    {
      title: "1. Introduction",
      content:
        "We respect your privacy and are committed to protecting the personal information you share with us.",
    },
    {
      title: "2. Information We Collect",
      content:
        "We may collect personal information such as your name, email address, phone number, and usage data through forms or cookies.",
    },
    {
      title: "3. How We Use Your Information",
      content:
        "Your information is used to provide and improve our services, communicate with you, and ensure legal compliance.",
    },
    {
      title: "4. Sharing Your Information",
      content:
        "We do not share your personal information with third parties, except as required by law or to provide you with our services.",
    },
    {
      title: "5. Data Retention",
      content:
        "We retain your data only as long as necessary for the purposes outlined in this policy.",
    },
    {
      title: "6. Security",
      content:
        "We implement reasonable security measures to protect your personal information.",
    },
    {
      title: "7. Your Rights",
      content:
        "You have the right to access, update, or delete your personal data. You can also opt-out of marketing communications.",
    },
    {
      title: "8. Cookies",
      content:
        "Our website may use cookies to enhance your browsing experience. You can disable cookies in your browser settings.",
    },
    {
      title: "9. Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time. Any changes will be posted on this page.",
    },
    {
      title: "10. Contact Us",
      content:
        "If you have any questions or concerns about this Privacy Policy, please contact us at: support@example.com",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 dark:bg-gray-900 shadow-xl rounded-2xl">
      {isEditingHeading ? (
        <input
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          onBlur={() => setIsEditingHeading(false)}
          className="text-3xl sm:text-4xl font-bold text-center w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-md mb-8 transition"
          autoFocus
        />
      ) : (
        <h1
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 cursor-pointer"
          onClick={() => setIsEditingHeading(true)}
        >
          {heading}
        </h1>
      )}

      {sections.map((section, index) => (
        <Section
          key={index}
          title={section.title}
          initialContent={section.content}
        />
      ))}
    </div>
  );
};

export default PrivacyPolicy;
