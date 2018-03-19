const CONFIG = {
    presets: [
        [
            '@babel/preset-env',
            { targets: { node: 'current' }, },
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

if( process.env.NODE_ENV === 'test' ) {
    CONFIG.plugins.unshift('babel-plugin-jest-hoist');
}

module.exports = CONFIG;
