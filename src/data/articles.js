import React from "react";
import "../pages/styles/homepage.css";

function article_1() {

	return {
		date: "7 May 2023",
		title: "The Benefits of Cloud Computing",
		description:
			"Cloud computing offers a range of benefits, including cost savings and increased flexibility. Find out why more businesses are turning to the cloud.",
		keywords: [
			"The Benefits of Cloud Computing",
			"Tharindu",
			"Tharindu N",
			"Tharindu Nayanajith",
		],
		style: `
				.article-content {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.randImage {
					align-self: center;
					outline: 2px solid red;
				}
				`,
		body: (

			<React.Fragment>

				<div className="article-content">

					<div className="paragraph">Content of article 1</div>
					<img
						src="https://picsum.photos/200/300"
						alt="Random content"
					/>

				</div>

			</React.Fragment>
		),
	};
}

function article_2() {
	return {

		date: "7 May 2023",
		title: "Artificial Intelligence in Healthcare",
		description:
			"AI is transforming the healthcare industry, from improving patient outcomes to streamlining operations. Discover the latest applications of this game-changing technology.",
		style: ``,
		keywords: [
			"Artificial Intelligence in Healthcare",
			"Tharindu",
			"Tharindu N",
			"Tharindu Nayanajith",
		],
		body: (

			<React.Fragment>
				<h1>Content of article 2</h1>
				<img
					src="https://picsum.photos/200/300"
					alt="random"
					className="randImage"
				/>
			</React.Fragment>
		),
	};
}

function article_3() {
	return {

		date: "7 May 2023",
		title: "Artificial Intelligence in Healthcare",
		description:
			"AI is transforming the healthcare industry, from improving patient outcomes to streamlining operations. Discover the latest applications of this game-changing technology.",
		style: ``,
		keywords: [
			"Artificial Intelligence in Healthcare",
			"Tharindu",
			"Tharindu N",
			"Tharindu Nayanajith",
		],
		body: (

			<React.Fragment>
				<h1>Content of article 2</h1>
				<img
					src="https://picsum.photos/200/300"
					alt="random"
					className="randImage"
				/>
			</React.Fragment>
		),
	};
}


const myArticles = [article_1, article_2, article_3];

export default myArticles;
