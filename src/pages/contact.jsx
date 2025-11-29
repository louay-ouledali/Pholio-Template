import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/contact.css";

const Contact = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "contact");

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Contact | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="contact" />
				<div className="content-wrapper">
					<div className="contact-logo-container">
						<div className="contact-logo">
							<Logo width={90} />
						</div>
					</div>

					<div className="contact-container">
						<div className="title contact-title">
							Let's Connect and Build Something Great
						</div>

						<div className="subtitle contact-subtitle">
							Whether you're looking to collaborate on a project, 
							discuss opportunities, or just want to say hello — I'd love 
							to hear from you. The best way to reach me is via email at
							&nbsp;{" "}
							<a href={`mailto:${INFO.main.email}`}>
								{INFO.main.email}
							</a>
							. I typically respond within 24 hours. You can also 
							connect with me on{" "}
							<a
								href={INFO.socials.linkedin}
								target="_blank"
								rel="noreferrer"
							>
								LinkedIn
							</a>
							{" "}for professional inquiries, or check out my work on{" "}
							<a
								href={`https://github.com/${INFO.socials.github}`}
								target="_blank"
								rel="noreferrer"
							>
								GitHub
							</a>
							. I'm always open to interesting conversations about 
							backend development, AI automation, and innovative tech solutions.
						</div>
					</div>

					<div className="socials-container">
						<div className="contact-socials">
							<Socials />
						</div>
					</div>

				
				</div>
			</div>
		</React.Fragment>
	);
};

export default Contact;
