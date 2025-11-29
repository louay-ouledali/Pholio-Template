import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO_DEFAULT from "../data/user"; // eslint-disable-line no-unused-vars
import SEO from "../data/seo";
import { usePortfolio } from "../context/PortfolioContext";

import "./styles/about.css";


// Carousel hook for each section, only auto-advances when visible
function useCarousel(images, sectionId) {
   const [index, setIndex] = useState(0);
   const intervalRef = useRef();
   const [isVisible, setIsVisible] = useState(false);
   const containerRef = useRef();

   useEffect(() => {
	   const node = containerRef.current;
	   const observer = new window.IntersectionObserver(
		   ([entry]) => setIsVisible(entry.isIntersecting),
		   { threshold: 0.5 }
	   );
	   if (node) observer.observe(node);
	   return () => {
		   if (node) observer.unobserve(node);
	   };
   }, []);

   useEffect(() => {
	   if (isVisible) {
		   intervalRef.current = setInterval(() => {
			   setIndex((prev) => (images && images.length > 0 ? (prev + 1) % images.length : 0));
		   }, 6000);
	   } else {
		   clearInterval(intervalRef.current);
	   }
	   return () => clearInterval(intervalRef.current);
   }, [images, isVisible]);

   const [fadeKey, setFadeKey] = useState(0);
   const next = () => {
	   setIndex((prev) => {
		   const nextIdx = (images && images.length > 0 ? (prev + 1) % images.length : 0);
		   setFadeKey(nextIdx + Math.random());
		   return nextIdx;
	   });
   };
   const prev = () => {
	   setIndex((prev) => {
		   const prevIdx = (images && images.length > 0 ? (prev - 1 + images.length) % images.length : 0);
		   setFadeKey(prevIdx + Math.random());
		   return prevIdx;
	   });
   };
   useEffect(() => { setFadeKey(index + Math.random()); }, [index]);
   return [index, next, prev, containerRef, fadeKey];
}

const About = () => {
   const { data: INFO } = usePortfolio();

   useEffect(() => {
	   window.scrollTo(0, 0);
   }, []);

   const currentSEO = SEO.find((item) => item.page === "about");

   // Carousels for each section (with refs)
   const [idx1, next1, prev1, ref1, fadeKey1] = useCarousel(INFO.about.section1.images, 'section1');
   const [idx2, next2, prev2, ref2, fadeKey2] = useCarousel(INFO.about.section2.images, 'section2');
   const [idx3, next3, prev3, ref3, fadeKey3] = useCarousel(INFO.about.section3.images, 'section3');
   const [idx4, next4, prev4, ref4, fadeKey4] = useCarousel(INFO.about.section4.images, 'section4');

   // Modal state for popup image
   const [modalImg, setModalImg] = useState(null);
   const openModal = (src) => setModalImg(src);
   const closeModal = () => setModalImg(null);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`About | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="about" />
				<div className="content-wrapper">
					<div className="about-logo-container">
						<div className="about-logo">
							<Logo width={46} />
						</div>
					</div>

					
					<div className="about-container" ref={ref1}>
						<div className="about-main">
							<div className="about-left-side">
								<div className="about-image-container">
									<div className="about-image-wrapper">
										<button className="about-arrow left" onClick={prev1}>&lt;</button>
<img
   key={fadeKey1}
   src={INFO.about.section1.images[idx1]}
   alt="about"
   className="about-image fade-image"
   style={{ cursor: 'pointer' }}
   onClick={() => openModal(INFO.about.section1.images[idx1])}
/>
										<button className="about-arrow right" onClick={next1}>&gt;</button>
									</div>
								</div>
							</div>
							<div className="about-right2-side">
								<div className="title about-title">
									{INFO.about.section1.title}
								</div>
								<div className="subtitle about-subtitle">
									{INFO.about.section1.description}
								</div>
							</div>
						</div>
					</div>
					<div className="about-container" ref={ref2}>
						<div className="about-main">
							<div className="about-right-side">
								<div className="title about-title">
									{INFO.about.section2.title}
								</div>
								<div className="subtitle about-subtitle">
									{INFO.about.section2.description}
								</div>
							</div>
							<div className="about-left-side">
								<div className="about-image-container">
									<div className="about-image-wrapper">
										<button className="about-arrow left" onClick={prev2}>&lt;</button>
<img
   key={fadeKey2}
   src={INFO.about.section2.images[idx2]}
   alt="about"
   className="about-image fade-image"
   style={{ cursor: 'pointer' }}
   onClick={() => openModal(INFO.about.section2.images[idx2])}
/>
										<button className="about-arrow right" onClick={next2}>&gt;</button>
									</div>
								</div>
							</div>
						</div>
						<div className="about-socials-mobile">
							<Socials />
						</div>
					</div>
					<div className="about-container" ref={ref3}>
						<div className="about-main">
							<div className="about-left-side">
								<div className="about-image-container">
									<div className="about-image-wrapper">
										<button className="about-arrow left" onClick={prev3}>&lt;</button>
<img
   key={fadeKey3}
   src={INFO.about.section3.images[idx3]}
   alt="about"
   className="about-image fade-image"
   style={{ cursor: 'pointer' }}
   onClick={() => openModal(INFO.about.section3.images[idx3])}
/>
										<button className="about-arrow right" onClick={next3}>&gt;</button>
									</div>
								</div>
							</div>
							<div className="about-right2-side">
								<div className="title about-title">
									{INFO.about.section3.title}
								</div>
								<div className="subtitle about-subtitle">
									{INFO.about.section3.description}
								</div>
							</div>
						</div>
					</div>
					<div className="about-container" ref={ref4}>
						<div className="about-main">
							<div className="about-right-side">
								<div className="title about-title">
									{INFO.about.section4.title}
								</div>
								<div className="subtitle about-subtitle">
									{INFO.about.section4.description}
								</div>
							</div>
							<div className="about-left-side">
								<div className="about-image-container">
									<div className="about-image-wrapper">
										<button className="about-arrow left" onClick={prev4}>&lt;</button>
<img
   key={fadeKey4}
   src={INFO.about.section4.images[idx4]}
   alt="about"
   className="about-image fade-image"
   style={{ cursor: 'pointer' }}
   onClick={() => openModal(INFO.about.section4.images[idx4])}
/>
										<button className="about-arrow right" onClick={next4}>&gt;</button>
									</div>
								</div>
								<div className="about-socials">
									<Socials />
								</div>
							</div>
						</div>
						<div className="about-socials-mobile">
							<Socials />
						</div>
					</div>
				</div>
			</div>
		   {/* Modal for popup image */}
		   {modalImg && (
			 <div className="about-modal-overlay" onClick={closeModal}>
			   <div className="about-modal-content" onClick={e => e.stopPropagation()}>
				 <button className="about-modal-close" onClick={closeModal}>&times;</button>
				 <img src={modalImg} alt="about large" className="about-modal-img" />
			   </div>
			 </div>
		   )}
		</React.Fragment>
	);
};

export default About;
