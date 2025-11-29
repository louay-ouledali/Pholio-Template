import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Article from "../components/articles/article";

import INFO_DEFAULT from "../data/user";
import SEO from "../data/seo";
import { usePortfolio } from "../context/PortfolioContext";

import "./styles/articles.css";

const Articles = () => {
	const { data: INFO, articles } = usePortfolio();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "articles");

	// Sort articles by order if available
	const sortedArticles = [...(articles || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Articles | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="articles" />
				<div className="content-wrapper">
					<div className="articles-logo-container">
						<div className="articles-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="articles-main-container">
						<div className="title articles-title">
							{INFO.articles.title}
						</div>

						<div className="subtitle articles-subtitle">
							{INFO.articles.description}
						</div>

						<div className="articles-container">
							<div className="articles-wrapper">
								{sortedArticles.map((article, index) => (
									<div
										className="articles-article"
										key={index}
									>
										<Article
											key={index}
											date={article.date}
											title={article.title}
											description={article.description}
											link={article.link || `/article/${index + 1}`}
										/>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Articles;
