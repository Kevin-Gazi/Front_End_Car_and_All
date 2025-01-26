import React from "react";

const TermsAndConditions = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
            <p className="mb-4">
                Welcome to CarandAll! These terms and conditions outline the rules and
                regulations for using our services. By creating an account or using our
                platform, you agree to these terms.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">1. Definitions</h2>
            <p>
                - <b>"Platform":</b> The CarandAll website and application.<br />
                - <b>"User":</b> Any individual who creates an account or uses the platform.<br />
                - <b>"Vehicle":</b> Cars or other vehicles owned and rented out by CarandAll.<br />
                - <b>"Renter":</b> A user who rents a vehicle through the platform.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">2. Ownership of Vehicles</h2>
            <p>
                All vehicles available on the platform are owned by CarandAll. Renters
                have no ownership rights or permanent usage rights to the vehicles.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">
                3. Account Creation
            </h2>
            <p>
                By creating an account, users confirm that they are at least 24 years
                old. Users are responsible for providing accurate and up-to-date
                information during the registration process.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">4. Rental Terms</h2>
            <p>
                - Vehicles can be rented by any registered user without age
                restrictions beyond the account creation requirement.<br />
                - Renters are responsible for the vehicle during the rental period and
                must report any damage or loss immediately.<br />
                - Vehicles may be used without regional restrictions, as permitted by
                applicable laws.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">5. Liability and Damage</h2>
            <p>
                Renters are fully responsible for any damage, loss, or additional costs
                incurred during the rental period unless otherwise specified in the
                rental agreement.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">6. Cancellation Policy</h2>
            <p>
                Cancellations must be made at least 24 hours before the start of the
                rental period. Cancellation fees may apply as outlined in the rental
                agreement.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">
                7. Changes to Terms
            </h2>
            <p>
                CarandAll reserves the right to update these terms at any time. Users
                will be notified of significant changes, and continued use of the
                platform implies acceptance of the updated terms.
            </p>

            <h2 className="text-xl font-semibold mt-4 mb-2">8. Contact Us</h2>
            <p>
                For questions or concerns regarding these terms, please contact us at
                support@carandall.com.
            </p>

            <p className="mt-4">
                By using CarandAll, you acknowledge and agree to these Terms and
                Conditions. Thank you for choosing our platform!
            </p>
        </div>
    );
};

export default TermsAndConditions;
