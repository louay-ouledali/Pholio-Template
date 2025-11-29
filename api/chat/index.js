const { generateResponse } = require('../lib/ai-agent');
const { getPortfolioContext } = require('../lib/data-loader');

module.exports = async function (context, req) {
    context.log('Processing Chat Request');

    const { message, history } = req.body;

    if (!message) {
        context.res = {
            status: 400,
            body: { error: "Message is required" }
        };
        return;
    }

    try {
        // 1. Load Context (Resume, Projects, etc.)
        const portfolioContext = await getPortfolioContext();

        // 2. Generate AI Response
        const response = await generateResponse(message, history || [], portfolioContext);

        context.res = {
            status: 200,
            body: { 
                reply: response,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        context.log.error("Error in chat function:", error);
        context.res = {
            status: 500,
            body: { error: "Internal Server Error", details: error.message }
        };
    }
};
