module.exports = {
    webpack: (config, { isServer }) => {
        // For watching changes more frequently in development
        if (!isServer) {
            config.watchOptions.poll = 300;
        }
        return config;
    }
};
