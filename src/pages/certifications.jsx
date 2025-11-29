import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faAward, 
    faCertificate, 
    faExternalLinkAlt,
    faLanguage,
    faShieldAlt,
    faGraduationCap,
    faUserCheck,
    faTrophy
} from "@fortawesome/free-solid-svg-icons";

import NavBar from "../components/common/navBar";
import Logo from "../components/common/logo";
import INFO from "../data/user";
import SEO from "../data/seo";
import { usePortfolio } from "../context/PortfolioContext";

import "./styles/certifications.css";

const Certifications = () => {
    const { certifications, achievements } = usePortfolio();
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const currentSEO = SEO.find((item) => item.page === "certifications") || SEO[0];

    const handleCardClick = (cert) => {
        if (cert.link) {
            window.open(cert.link, "_blank", "noopener,noreferrer");
        } else if (cert.image) {
            setSelectedImage(cert.image);
        }
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    // Separate language tests from professional certifications
    const languageTests = certifications.filter(c => c.type === "language");
    const professionalCerts = certifications.filter(c => c.type === "professional" || !c.type);

    const getTypeIcon = (type) => {
        switch(type) {
            case "language": return faLanguage;
            case "test": return faShieldAlt;
            case "achievement": return faTrophy;
            case "presence": return faUserCheck;
            case "formation": return faGraduationCap;
            default: return faCertificate;
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case "language": return "#3B82F6";
            case "test": return "#10B981";
            case "achievement": return "#F59E0B";
            case "presence": return "#8B5CF6";
            case "formation": return "#EC4899";
            default: return "#6B7280";
        }
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Certifications | ${INFO.main.title}`}</title>
                <meta name="description" content={currentSEO.description} />
                <meta name="keywords" content={currentSEO.keywords.join(", ")} />
            </Helmet>

            <div className="page-content">
                <NavBar active="certifications" />
                <div className="content-wrapper">
                    <div className="certifications-logo-container">
                        <div className="certifications-logo">
                            <Logo width={46} />
                        </div>
                    </div>

                    <div className="certifications-container">
                        <div className="title certifications-title">
                            Certifications & Achievements
                        </div>

                        <div className="subtitle certifications-subtitle">
                            Professional certifications, test scores, and achievements earned throughout my journey.
                        </div>

                        {/* Section 1: Test Scores & Professional Certifications */}
                        <div className="cert-section">
                            <div className="cert-section-header">
                                <FontAwesomeIcon icon={faShieldAlt} className="section-icon" />
                                <h2>Test Scores & Certifications</h2>
                            </div>
                            <p className="cert-section-desc">
                                Professional certifications and standardized test scores from recognized institutions.
                            </p>

                            <div className="certifications-list">
                                {/* Professional Certifications */}
                                {professionalCerts.map((cert, index) => (
                                    <div 
                                        key={cert.id || index} 
                                        className={`certification-card ${cert.link || cert.image ? 'clickable' : ''}`}
                                        onClick={() => handleCardClick(cert)}
                                    >
                                        <div className="cert-type-badge" style={{ backgroundColor: getTypeColor("test") }}>
                                            <FontAwesomeIcon icon={faCertificate} />
                                        </div>
                                        <div className="cert-content">
                                            <div className="cert-title">{cert.name}</div>
                                            <div className="cert-issuer">{cert.issuer}</div>
                                            {cert.score && (
                                                <div className="cert-score">
                                                    <span className="score-label">{cert.scoreLabel || "Score"}:</span>
                                                    <span className="score-value">{cert.score}</span>
                                                </div>
                                            )}
                                            <div className="cert-date">{cert.date}</div>
                                            {cert.link && (
                                                <div className="cert-link-indicator">
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Verify
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Language Test Scores */}
                                {languageTests.map((cert, index) => (
                                    <div 
                                        key={cert.id || `test-${index}`} 
                                        className={`certification-card language-card ${cert.link ? 'clickable' : ''}`}
                                        onClick={() => handleCardClick(cert)}
                                    >
                                        <div className="cert-type-badge" style={{ backgroundColor: getTypeColor("language") }}>
                                            <FontAwesomeIcon icon={faLanguage} />
                                        </div>
                                        <div className="cert-content">
                                            <div className="cert-title">{cert.name}</div>
                                            <div className="cert-issuer">{cert.issuer}</div>
                                            {cert.score && (
                                                <div className="cert-score">
                                                    <span className="score-label">{cert.scoreLabel || "Score"}:</span>
                                                    <span className="score-value">{cert.score}</span>
                                                </div>
                                            )}
                                            <div className="cert-date">{cert.date}</div>
                                            {cert.link && (
                                                <div className="cert-link-indicator">
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} /> Verify
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Achievement Certificates */}
                        <div className="cert-section">
                            <div className="cert-section-header">
                                <FontAwesomeIcon icon={faAward} className="section-icon" />
                                <h2>Achievement Certificates</h2>
                            </div>
                            <p className="cert-section-desc">
                                Certificates of achievement, participation, and professional training.
                            </p>

                            <div className="achievements-list">
                                {achievements.map((achievement, index) => (
                                    <div 
                                        key={achievement.id || index} 
                                        className={`achievement-card ${achievement.link || achievement.image ? 'clickable' : ''}`}
                                        onClick={() => handleCardClick(achievement)}
                                    >
                                        <div className="achievement-icon" style={{ backgroundColor: getTypeColor(achievement.type) }}>
                                            <FontAwesomeIcon icon={getTypeIcon(achievement.type)} />
                                        </div>
                                        <div className="achievement-content">
                                            <div className="achievement-type-label" style={{ color: getTypeColor(achievement.type) }}>
                                                {achievement.type === "presence" ? "Certificate of Presence" : 
                                                 achievement.type === "formation" ? "Training Certificate" :
                                                 achievement.type === "achievement" ? "Achievement" : "Certificate"}
                                            </div>
                                            <div className="achievement-title">{achievement.name}</div>
                                            <div className="achievement-issuer">{achievement.issuer}</div>
                                            {achievement.description && (
                                                <div className="achievement-description">{achievement.description}</div>
                                            )}
                                            <div className="achievement-date">{achievement.date}</div>
                                            {achievement.link && (
                                                <div className="achievement-link">
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} /> View Certificate
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedImage && (
                <div className="cert-modal-overlay" onClick={closeModal}>
                    <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="cert-modal-close" onClick={closeModal}>&times;</button>
                        <img src={selectedImage} alt="Certification" className="cert-modal-image" />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Certifications;
