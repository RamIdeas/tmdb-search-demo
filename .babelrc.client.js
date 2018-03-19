const browsers = process.env.NODE_ENV === 'production' ? 'last 2 versions' : 'Chrome 63';

const CONFIG = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: { browsers },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        [
            'babel-plugin-styled-components',
            {
                ssr: true,
                displayName: true,
            },
        ],
    ],
};

module.exports = CONFIG;
