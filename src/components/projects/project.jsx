import React, { useRef, useState } from "react";

import ProjectCard from "./projectCard";
import ProjectModal from "./modal/ProjectModal";
import "./styles/project.css";

const Project = (props) => {
	const {
		id,
		logo,
		title,
		description,
		linkText,
		link,
		longDescription,
		technologies = [],
		screenshot,
		images = [],
		qr,
		links = [],
		status = "released",
		releaseDate,
		expectedReleaseDate,
	} = props;

	const [open, setOpen] = useState(false);
	const triggerRef = useRef(null);

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<ProjectCard
				ref={triggerRef}
				logo={logo}
				title={title}
				description={description}
				link={link}
				linkText={linkText}
				onOpen={openModal}
				status={status}
				expectedReleaseDate={expectedReleaseDate}
			/>
			<ProjectModal
				projectId={id}
				open={open}
				onClose={closeModal}
				triggerRef={triggerRef}
				title={title}
				description={description}
				longDescription={longDescription}
				images={images}
				screenshot={screenshot}
				logo={logo}
				technologies={technologies}
				links={links}
				link={link}
				linkText={linkText}
				qr={qr}
				status={status}
				releaseDate={releaseDate}
				expectedReleaseDate={expectedReleaseDate}
			/>
		</>
	);
};

export default Project;
