// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Zondax TEE',
    tagline: 'TEE-based Remote Signers',
    url: 'https://tee.zondax.ch',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'zondax', // Usually your GitHub org/user name.
    projectName: 'zondax-tee', // Usually your repo name.
    noIndex: true,

    presets: [
        [
            '@docusaurus/preset-classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl: 'https://github.com/zondax/tee-docs/edit/master/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Zondax TEE',
                logo: {
                    alt: 'Zondax TEE',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'report/intro',
                        position: 'left',
                        label: 'Report',
                    },
                    {
                        type: 'doc',
                        docId: 'testing/intro',
                        position: 'left',
                        label: 'Testing Guide',
                    },
                    {
                        type: 'doc',
                        docId: 'technical/intro',
                        position: 'left',
                        label: 'Technical',
                    },
                    {
                        to: 'https://zondax.ch',
                        label: 'Zondax',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [],
                copyright: `Copyright © ${new Date().getFullYear()} Zondax GmbH`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
}

module.exports = config
