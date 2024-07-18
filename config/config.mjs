const config = {
    port: process.env.PORT || 8006,
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 8006}`,
    mongoDbUri: process.env.mongoDbUri,
};

export default config;
