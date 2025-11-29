import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronLeft,
	faChevronRight,
	faExternalLinkAlt,
	faPause,
	faPlay,
	faQrcode,
	faTimes,
	faDatabase,
	faServer,
	faBrain,
	faWind,
	faChartBar,
	faCogs,
	faChartPie,
	faProjectDiagram,
	faGlobe,
	faRobot,
	faUsers,
	faLeaf,
	faMagic,
	faCode,
	faClock,
	faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
	faAngular,
	faAws,
	faCss3,
	faDocker,
	faGitAlt,
	faGithub,
	faHtml5,
	faJava,
	faJs,
	faNodeJs,
	faNpm,
	faPython,
	faReact,
	faMicrosoft,
} from "@fortawesome/free-brands-svg-icons";

import "../styles/projectModal.css";

const TECH_ICON_MAP = {
	react: faReact,
	node: faNodeJs,
	nodejs: faNodeJs,
	angular: faAngular,
	java: faJava,
	docker: faDocker,
	python: faPython,
	javascript: faJs,
	typescript: faJs,
	html: faHtml5,
	html5: faHtml5,
	css: faCss3,
	css3: faCss3,
	aws: faAws,
	git: faGitAlt,
	github: faGithub,
	npm: faNpm,
	"spring boot": faJava, // Using Java icon for Spring Boot as it's the closest
	rabbitmq: faServer,
	redis: faDatabase,
	"mistral 7b": faBrain,
	tailwind: faWind,
	"framer motion": faMagic,
	azure: faMicrosoft,
	sql: faDatabase,
	dax: faChartBar,
	etl: faCogs,
	"power bi": faChartPie,
	n8n: faProjectDiagram,
	api: faGlobe,
	automation: faRobot,
	collaboration: faUsers,
	sustainability: faLeaf,
};

const getTechIcon = (techName) => {
	const normalizedName = techName.toLowerCase().trim();
	return TECH_ICON_MAP[normalizedName] || faCode; // Default to code icon if not found
};

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const ModalCarousel = ({ media, activeIndex, onPrev, onNext, autoPlay, onToggleAutoPlay }) => {
	if (media.length === 0) {
		return <div className="modal-carousel--placeholder" aria-hidden="true" />;
	}

	const activeItem = media[activeIndex];

	return (
		<div className="modal-carousel">
			<div className="modal-carousel__viewport">
				{activeItem.type === "video" ? (
					<div className="modal-carousel__video-wrapper">
						{activeItem.src.includes("youtube.com") || activeItem.src.includes("youtu.be") ? (
							<iframe
								src={`https://www.youtube.com/embed/${activeItem.src.includes("v=")
									? activeItem.src.split("v=")[1].split("&")[0]
									: activeItem.src.split("/").pop()
									}`}
								title={activeItem.alt}
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="modal-carousel__video"
							></iframe>
						) : activeItem.src.includes("vimeo.com") ? (
							<iframe
								src={`https://player.vimeo.com/video/${activeItem.src.split("/").pop()}`}
								title={activeItem.alt}
								frameBorder="0"
								allow="autoplay; fullscreen; picture-in-picture"
								allowFullScreen
								className="modal-carousel__video"
							></iframe>
						) : (
							<video
								src={activeItem.src}
								controls
								className="modal-carousel__video"
							>
								Your browser does not support the video tag.
							</video>
						)}
					</div>
				) : (
					<img
						src={activeItem.src}
						alt={activeItem.alt}
						loading="lazy"
						className="modal-carousel__image"
					/>
				)}
			</div>
			{media.length > 1 && (
				<div className="modal-carousel__controls">
					<button type="button" className="modal-carousel__nav" onClick={onPrev} aria-label="Previous media">
						<FontAwesomeIcon icon={faChevronLeft} />
					</button>
					<div className="modal-carousel__status" aria-live="polite">
						{activeIndex + 1} / {media.length}
					</div>
					<button type="button" className="modal-carousel__nav" onClick={onNext} aria-label="Next media">
						<FontAwesomeIcon icon={faChevronRight} />
					</button>
					<button
						type="button"
						className="modal-carousel__autoplay"
						onClick={onToggleAutoPlay}
						aria-label={autoPlay ? "Pause carousel autoplay" : "Resume carousel autoplay"}
					>
						<FontAwesomeIcon icon={autoPlay ? faPause : faPlay} />
					</button>
				</div>
			)}
		</div>
	);
};

const TechList = ({ technologies = [] }) => {
	if (technologies.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="modal-tech-title" className="modal-sidebar__section">
			<h3 id="modal-tech-title" className="modal-sidebar__heading">
				Technologies
			</h3>
			<ul className="modal-tech-list">
				{technologies.map((tech, index) => {
					const icon = getTechIcon(tech);
					return (
						<li key={`${tech}-${index}`} className="modal-tech-list__item" title={tech}>
							<FontAwesomeIcon icon={icon} />
						</li>
					);
				})}
			</ul>
		</section>
	);
};

const ProjectLinks = ({ links = [] }) => {
	if (!links || links.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="modal-links-title" className="modal-sidebar__section">
			<h3 id="modal-links-title" className="modal-sidebar__heading">
				Resources
			</h3>
			<ul className="modal-links">
				{links.map((item, index) => (
					<li key={`${item.href}-${index}`} className="modal-links__item">
						<a href={item.href} target="_blank" rel="noopener noreferrer">
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</section>
	);
};

const ProjectMeta = ({ qr, link, linkText, status, expectedReleaseDate, releaseDate }) => {
	const isUpcoming = status === "upcoming";

	const formatDate = (dateString) => {
		if (!dateString) return null;
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	};

	return (
		<section aria-labelledby="modal-meta-title" className="modal-sidebar__section">
			<h3 id="modal-meta-title" className="modal-sidebar__heading">
				Quick access
			</h3>
			<div className="modal-meta">
				{isUpcoming && (
					<div className="modal-meta__upcoming-badge">
						<FontAwesomeIcon icon={faClock} />
						<span>Upcoming Project</span>
					</div>
				)}
				{isUpcoming && expectedReleaseDate && (
					<div className="modal-meta__release-date">
						<FontAwesomeIcon icon={faCalendarAlt} />
						<span>Expected: {formatDate(expectedReleaseDate)}</span>
					</div>
				)}
				{!isUpcoming && releaseDate && (
					<div className="modal-meta__release-date released">
						<FontAwesomeIcon icon={faCalendarAlt} />
						<span>Released: {formatDate(releaseDate)}</span>
					</div>
				)}
				{qr ? (
					<img src={qr} alt="Project QR code" className="modal-meta__qr" loading="lazy" />
				) : (
					<div className="modal-meta__qr--placeholder" aria-hidden="true">
						<FontAwesomeIcon icon={faQrcode} />
					</div>
				)}
				{link && !isUpcoming && (
					<a className="modal-meta__primary" href={link} target="_blank" rel="noopener noreferrer">
						{linkText || "View project"}
						<FontAwesomeIcon icon={faExternalLinkAlt} />
					</a>
				)}
				{isUpcoming && (
					<div className="modal-meta__coming-soon">
						<span>🚀 Coming Soon</span>
					</div>
				)}
			</div>
		</section>
	);
};

const useFocusTrap = (containerRef, isActive, onClose, triggerRef) => {
	useEffect(() => {
		if (!isActive) {
			return;
		}

		const node = containerRef.current;
		if (!node) {
			return;
		}

		const focusable = Array.from(node.querySelectorAll(FOCUSABLE_SELECTOR));
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const previouslyFocused = document.activeElement;

		const handleKeyDown = (event) => {
			if (event.key === "Tab" && focusable.length > 0) {
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}

			if (event.key === "Escape") {
				event.preventDefault();
				onClose();
			}
		};

		node.addEventListener("keydown", handleKeyDown);

		if (first) {
			first.focus({ preventScroll: true });
		}

		const triggerElement = triggerRef?.current;

		return () => {
			node.removeEventListener("keydown", handleKeyDown);
			if (triggerElement) {
				triggerElement.focus({ preventScroll: true });
			} else if (previouslyFocused instanceof HTMLElement) {
				previouslyFocused.focus({ preventScroll: true });
			}
		};
	}, [containerRef, isActive, onClose, triggerRef]);
};

const ProjectModal = ({
	open,
	onClose,
	triggerRef,
	title,
	description,
	longDescription,
	images = [],
	screenshot,
	logo,
	technologies,
	links,
	link,
	linkText,
	qr,
	status = "released",
	releaseDate,
	expectedReleaseDate,
}) => {
	const modalId = useId();
	const descriptionId = `${modalId}-description`;
	const labelId = `${modalId}-title`;
	const containerRef = useRef(null);
	const overlayRef = useRef(null);

	const media = useMemo(() => {
		const collected = [];
		
		if (Array.isArray(images) && images.length > 0) {
			// Handle both new object structure and legacy string structure
			const processedImages = images.filter(Boolean).map((item, index) => {
				if (typeof item === 'string') {
					return { type: 'image', src: item, alt: `${title} showcase ${index + 1}` };
				}
				return { ...item, alt: `${title} showcase ${index + 1}` };
			});
			collected.push(...processedImages);
		}

		if (collected.length === 0 && screenshot) {
			collected.push({ type: 'image', src: screenshot, alt: `${title} screenshot` });
		}

		if (collected.length === 0 && logo) {
			collected.push({ type: 'image', src: logo, alt: `${title} logo` });
		}

		return collected;
	}, [images, logo, screenshot, title]);

	const [activeIndex, setActiveIndex] = useState(0);
	const [autoPlay, setAutoPlay] = useState(media.length > 1);
	const autoPlayRef = useRef(null);

	useEffect(() => {
		if (!open) {
			return undefined;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	useEffect(() => {
		if (!open) {
			return;
		}
		setActiveIndex(0);
		setAutoPlay(media.length > 1);
	}, [open, media.length]);

	useEffect(() => {
		if (!open || !autoPlay || media.length <= 1) {
			return undefined;
		}

		autoPlayRef.current = setInterval(() => {
			setActiveIndex((current) => (current + 1) % media.length);
		}, 5000);

		return () => {
			if (autoPlayRef.current) {
				clearInterval(autoPlayRef.current);
			}
		};
	}, [autoPlay, media.length, open]);

	useFocusTrap(containerRef, open, onClose, triggerRef);

	const handleOverlayClick = (event) => {
		if (event.target === overlayRef.current) {
			onClose();
		}
	};

	const handlePrev = () => {
		setAutoPlay(false);
		setActiveIndex((current) => (current - 1 + media.length) % media.length);
	};

	const handleNext = () => {
		setAutoPlay(false);
		setActiveIndex((current) => (current + 1) % media.length);
	};

	const toggleAutoplay = () => {
		setAutoPlay((prev) => !prev);
	};

	if (!open) {
		return null;
	}

	return createPortal(
		<div
			className="project-modal-overlay"
			role="presentation"
			ref={overlayRef}
			onMouseDown={handleOverlayClick}
		>
			<div
				className="project-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby={labelId}
				aria-describedby={descriptionId}
				ref={containerRef}
			>
				<button type="button" className="modal-close" onClick={onClose} aria-label={`Close ${title} details`}>
					<FontAwesomeIcon icon={faTimes} />
				</button>

				<div className="project-modal__body">
					<header className="project-modal__header">
						<h2 id={labelId}>{title}</h2>
						{description && (
							<p className="project-modal__summary">{description}</p>
						)}
					</header>

					<div className="project-modal__content">
						<div className="modal-main">
							<ModalCarousel
								media={media}
								activeIndex={activeIndex}
								onPrev={handlePrev}
								onNext={handleNext}
								autoPlay={autoPlay}
								onToggleAutoPlay={toggleAutoplay}
							/>

							<section id={descriptionId} className="modal-description">
								{longDescription ? longDescription : description}
							</section>
						</div>

						<aside className="modal-sidebar">
							<ProjectMeta 
								qr={qr} 
								link={link} 
								linkText={linkText} 
								status={status}
								releaseDate={releaseDate}
								expectedReleaseDate={expectedReleaseDate}
							/>
							<ProjectLinks links={links} />
							<TechList technologies={technologies} />
						</aside>
					</div>
				</div>
			</div>
		</div>,
		document.body
	);
};

export default ProjectModal;
