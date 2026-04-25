import { FiX } from "react-icons/fi";
import "./HelpDialog.css";

function HelpDialog({
    isOpen,
    logoSrc,
    profileImageSrc,
    socialLinks,
    onClose,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="modal-backdrop"
            role="presentation"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}>
            <div
                className="modal-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="help-dialog-title">
                <div className="modal-header">
                    <div>
                        <span className="modal-kicker">Help</span>
                        <h2 id="help-dialog-title">Json Toolkit</h2>
                    </div>
                    <button
                        type="button"
                        className="icon-button"
                        aria-label="Close help dialog"
                        onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="modal-grid">
                    <section className="info-card info-card--about">
                        <img
                            className="info-card__avatar info-card__avatar--logo"
                            src={logoSrc}
                            alt="Json Toolkit logo"
                        />
                        <div className="info-card__body">
                            <span className="info-card__eyebrow">About</span>
                            <h3>About Json Toolkit</h3>
                            <p>
                                Json Toolkit is a fast and minimal tool for
                                formatting, validating, and exploring JSON data
                                directly in your browser. It provides a clean
                                and distraction-free environment for working
                                with structured data. No data is stored or sent
                                anywhere — everything runs locally.
                            </p>
                        </div>
                    </section>

                    <section className="info-card info-card--developer">
                        <img
                            className="info-card__avatar info-card__avatar--profile"
                            src={profileImageSrc}
                            alt="Bilal Abdulhadi"
                        />
                        <div className="info-card__body">
                            <span className="info-card__eyebrow">
                                Developer
                            </span>
                            <h3>Bilal Abdulhadi</h3>
                            <p className="profile-role">Web Developer</p>
                            <p className="profile-description">
                                Computer engineer and web developer focused on
                                building clean, reliable, and user-friendly
                                digital tools. Passionate about minimal design,
                                practical products, and creating useful tools
                                without unnecessary complexity.
                            </p>

                            <div
                                className="social-links"
                                aria-label="Developer social links">
                                {socialLinks.map((link) => {
                                    const Icon = link.icon;

                                    return (
                                        <a
                                            key={link.label}
                                            className="social-link"
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={link.label}
                                            title={link.label}>
                                            <Icon />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default HelpDialog;
