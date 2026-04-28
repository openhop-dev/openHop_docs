// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.pymc.dev',
	integrations: [
		starlight({
			title: 'pyMC Docs',
			description: 'Documentation hub for pyMC_core and pyMC_Repeater',
			logo: {
				light: './src/assets/pymc-logo.png',
				dark: './src/assets/pymc-logo.png',
				replacesTitle: false,
			},
			customCss: ['./src/styles/brand.css'],
			social: [
				{ icon: 'github', label: 'pyMC on GitHub', href: 'https://github.com/pymc-dev' },
			],
			editLink: {
				baseUrl: 'https://github.com/pymc-dev/MC_PROJECT/edit/main/pyMC_docs/',
			},
			sidebar: [
				{
					label: 'Projects',
					items: [
						{
							label: 'pyMC_core',
							autogenerate: { directory: 'projects/pymc-core' },
						},
						{
							label: 'pyMC_Repeater',
							autogenerate: { directory: 'projects/pymc-repeater' },
						},
					],
				},
				{
					label: 'About this Documentation',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: '' },
						{ label: 'Contributing', slug: 'contributing' },
					],
				},
			],
		}),
	],
});
