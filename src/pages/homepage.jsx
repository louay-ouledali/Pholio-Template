import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import { Typewriter } from 'react-simple-typewriter'
import ProgressBar from "@ramonak/react-progress-bar";
import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faGithub,
	faStackOverflow,
	faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../components/common/logo";

import NavBar from "../components/common/navBar";
import Skills from "../components/homepage/skills";
import Works from "../components/homepage/works";
import AllProjects from "../components/projects/allProjects";

import INFO_DEFAULT from "../data/user";
import SEO from "../data/seo";
import { usePortfolio } from "../context/PortfolioContext";

import "./styles/homepage.css";

const Homepage = () => {
	const { data: INFO, loading } = usePortfolio();
	const [stayLogo, setStayLogo] = useState(false);
	const [logoSize, setLogoSize] = useState(350);
	const [oldLogoSize, setOldLogoSize] = useState(90);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			let scroll = Math.round(window.pageYOffset, 100);
			let newLogoSize = 350 - (scroll * 4);

			if (newLogoSize > 150) {
				setLogoSize(newLogoSize);
				setStayLogo(false);
			} else {
				setLogoSize(150);
				setStayLogo(true);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "home");

	const logoStyle = {
		display: "flex",
		position: stayLogo ? "fixed" : "relative",
		top: stayLogo ? "3vh" : "auto",
		zIndex: 999,
		border: stayLogo ? "1px solid white" : "none",
		borderRadius: stayLogo ? "50%" : "none",
		boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{INFO.main.title}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>
			<div className="page-content">
				<NavBar active="home" />
				<div className="content-wrapper">


					<div className="homepage-container">
						<div className="homepage-first-area">


							<div className="homepage-first-area-left-side">
								<div className="homepage-image-container">
									<div className="homepage-logo-container">
										<div style={logoStyle}>
											<Logo width={logoSize} link={false} />
										</div>
										{stayLogo && (
											<div
												style={{
													width: `${logoSize}px`,
													height: `${logoSize}px`,
													visibility: "hidden",
												}}
											/>
										)}
									</div>
								</div>
							</div>
							<div className="homepage-first-area-right-side">
								<div className="title homepage-title">
									<h3 style={{ paddingTop: '0rem', margin: 'auto 0', fontWeight: 'normal' }}>
										I'm a {' '}
										<span style={{ color: '#ffcc00', fontWeight: 'bold' }}>
											{ }
											<Typewriter
												words={['Dev', 'Designer', 'Data scientist']}
												loop={5555}
												cursor
												cursorStyle='_'
												typeSpeed={70}
												deleteSpeed={50}
												delaySpeed={4000}

											/>
										</span>
									</h3>
								</div>

								<div className="subtitle homepage-subtitle">
									{INFO.homepage.description}
								</div>
								<div className="homepage-socials">
									<a
										href={INFO.socials.twitter}
										target="_blank"
										rel="noreferrer"
									>
										<FontAwesomeIcon
											icon={faTwitter}
											className="homepage-social-icon"
										/>
									</a>
									<a
										href={INFO.socials.github}
										target="_blank"
										rel="noreferrer"
									>
										<FontAwesomeIcon
											icon={faGithub}
											className="homepage-social-icon"
										/>
									</a>
									<a
										href={INFO.socials.stackoverflow}
										target="_blank"
										rel="noreferrer"
									>
										<FontAwesomeIcon
											icon={faStackOverflow}
											className="homepage-social-icon"
										/>
									</a>
									<a
										href={INFO.socials.instagram}
										target="_blank"
										rel="noreferrer"
									>
										<FontAwesomeIcon
											icon={faInstagram}
											className="homepage-social-icon"
										/>
									</a>
									<a
										href={`mailto:${INFO.main.email}`}
										target="_blank"
										rel="noreferrer"
									>
										<FontAwesomeIcon
											icon={faMailBulk}
											className="homepage-social-icon"
										/>
									</a>
								</div>
							</div>
						</div>



						<div className="homepage-projects">
							<AllProjects />
						</div>

						<div className="homepage-after-title">
							<div className="homepage-skills">
								<Skills />
							</div>

							<div className="homepage-works">
								<Works />

							</div>
						</div>


					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Homepage;
