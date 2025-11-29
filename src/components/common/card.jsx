import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./styles/card.css";

const Card = (props) => {
	const { icon, title, body } = props;
	const hasHeader = Boolean(icon) || Boolean(title);
	return (
		<div className="card">
			<div className="card-container">
				{hasHeader && (
					<div className="card-header">
						{icon && (
							<div className="card-icon">
								<FontAwesomeIcon icon={icon} />
							</div>
						)}
						{title && <div className="card-title">{title}</div>}
					</div>
				)}
				<div className="card-body">
					<div className="card-text">{body}</div>
				</div>
			</div>
		</div>
	);
};

export default Card;
