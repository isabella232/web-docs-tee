// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Zondax TEE',
  tagline: 'Proof of concept | TEE-based Remote Signers',
  url: 'https://tee.zondax.ch',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'zondax', // Usually your GitHub org/user name.
  projectName: 'zondax-tee', // Usually your repo name.
  noIndex: true,

  plugins: [require.resolve('docusaurus-lunr-search')],

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
        title: 'Zondax TEE - PoC',
        logo: {
          alt: 'Zondax TEE - PoC',
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
            docId: 'technical/intro',
            position: 'left',
            label: 'Technical',
          },
          {
            type: 'doc',
            docId: 'demo/intro',
            position: 'left',
            label: 'Demo',
          },
          {
            type: 'doc',
            docId: 'faq',
            position: 'left',
            label: 'FAQ',
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
        additionalLanguages: ['rust'],
      },
    }),
}

module.exports = config
