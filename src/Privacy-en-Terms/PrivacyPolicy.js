import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-10">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 sm:p-10">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
                <p className="mb-6 text-gray-600 leading-relaxed">
                    At CarAndAll, we take your privacy seriously. This privacy policy
                    explains what data we collect, why we collect it, how we protect it,
                    and your rights concerning your personal data.
                </p>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">1. Who are we?</h2>
                    <p className="text-gray-600">
                        CarAndAll is responsible for processing your personal data as
                        described in this policy. Our contact details are:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                        <li><strong>Name:</strong> Car and All</li>
                        <li><strong>Address:</strong> Johanna Westerdijkplein 75, 2521 EP Den Haag</li>
                        <li><strong>Email:</strong> info@carandall.nl</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">2. What data do we collect?</h2>
                    <p className="text-gray-600">We may collect the following data when you use CarAndAll:</p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                        <li><strong>Account data:</strong> Name, email address, username, and password.</li>
                        <li><strong>Technical data:</strong> IP address and usage statistics.</li>
                        <li><strong>Communication data:</strong> Messages you send to us via email or contact forms.</li>
                        <li><strong>Other data:</strong> Any information you voluntarily provide, such as profile information or preferences.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">3. Why do we collect this data?</h2>
                    <p className="text-gray-600">We collect your data for the following purposes:</p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                        <li>To provide access to and functionality for the web application.</li>
                        <li>To improve our services and user experience.</li>
                        <li>To provide support and respond to inquiries.</li>
                        <li>To comply with legal obligations.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">4. How long do we retain your data?</h2>
                    <p className="text-gray-600">
                        We retain your personal data no longer than necessary for the purposes mentioned above, unless a longer retention period is required by law.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">5. How do we protect your data?</h2>
                    <p className="text-gray-600">We take appropriate technical and organizational measures to protect your data against loss, theft, or unauthorized access. These include:</p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                        <li>Use of SSL encryption.</li>
                        <li>Regular data backups.</li>
                        <li>Restricted access to data for authorized personnel only.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">6. Sharing data with third parties</h2>
                    <p className="text-gray-600">
                        We only share your data with third parties when necessary to provide our services or when required by law. This may include:
                    </p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                        <li>Hosting providers for data storage.</li>
                        <li>Payment service providers for transaction processing.</li>
                        <li>External tools or services for analytics.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">7. Cookies and tracking technologies</h2>
                    <p className="text-gray-600">
                        CarAndAll uses cookies and similar technologies to enhance the functionality of our website and collect usage statistics. For more information, see our Cookie Policy.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">8. Your rights</h2>
                    <p className="text-gray-600">You have the right to:</p>
                    <ul className="list-disc ml-6 text-gray-600 space-y-2">
                        <li>Access the data we hold about you.</li>
                        <li>Correct any incorrect data.</li>
                        <li>Have your data deleted (right to be forgotten).</li>
                        <li>Restrict or object to the processing of your data.</li>
                        <li>Transfer your data to another service provider (data portability).</li>
                    </ul>
                    <p className="text-gray-600 mt-2">
                        To exercise these rights, contact us at <a href="mailto:carandall@gmail.com" className="text-blue-500 underline">carandall@gmail.com</a>.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">9. Changes to this privacy policy</h2>
                    <p className="text-gray-600">
                        We reserve the right to amend this privacy policy. Any changes will be published on this page. We encourage you to review this policy regularly.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">10. Contact</h2>
                    <p className="text-gray-600">
                        If you have any questions or complaints about how we process your data, please contact us at <a href="mailto:info@carandall.nl" className="text-blue-500 underline">info@carandall.nl</a>. You also have the right to file a complaint with the relevant supervisory authority.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
