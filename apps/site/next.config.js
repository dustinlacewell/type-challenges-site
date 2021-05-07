const withPlugins = require('next-compose-plugins');

const withMDX = require('@next/mdx')({extension: /\.mdx$/})

const withNx = require('@nrwl/next/plugins/with-nx');


module.exports = withPlugins([
    [withNx, {
        nx: {
        // Set this to false if you do not want to use SVGR
        // See: https://github.com/gregberge/svgr
            svgr: true,
        },
    }],
    [withMDX, {pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx']}],
])
