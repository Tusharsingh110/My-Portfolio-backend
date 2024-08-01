const pagination = (model) => async (req, res, next) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * limit;

        const data = await model.find().limit(limit).skip(skip).exec();
        const totalCount = await model.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        req.results = {
            statusCode: 200,
            paging: {
                totalPages,
                currentPage: page,
                totalItems: totalCount,
                limit
            },
            data
        };
        next();
    } catch (error) {
        console.error("Error fetching data from database:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Error fetching data from database",
            error: error.message
        });
    }
};

module.exports = pagination;
