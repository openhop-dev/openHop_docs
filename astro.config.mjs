// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.pymc.dev',
	integrations: [
		starlight({
			title: 'pyMC Docs',
			description: 'Documentation hub for pyMC Core, pyMC Repeater, pyMC HA Integration, and the pyMC HA Add-on',
			favicon: '/favicon.png',
			head: [
				{
					tag: 'script',
					content: `(() => {
	try {
		if (typeof localStorage !== 'undefined' && !localStorage.getItem('starlight-theme')) {
			localStorage.setItem('starlight-theme', 'dark');
		}
	} catch {}
})();`,
				},
				{
					tag: 'script',
					content: `(() => {
	const markExternalLinks = () => {
		document.querySelectorAll('a[href]').forEach((link) => {
			const href = link.getAttribute('href');
			if (!href || href.startsWith('#') || href.startsWith('/') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

			try {
				const url = new URL(href, window.location.href);
				if (url.origin === window.location.origin) return;

				link.target = '_blank';
				const rel = new Set((link.getAttribute('rel') || '').split(/\\s+/).filter(Boolean));
				rel.add('noopener');
				rel.add('noreferrer');
				link.setAttribute('rel', [...rel].join(' '));
			} catch {}
		});
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', markExternalLinks, { once: true });
	} else {
		markExternalLinks();
	}
})();`,
				},
			],
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
			},
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
				baseUrl: 'https://github.com/pyMC-dev/pyMC_docs/edit/main/',
			},
			sidebar: [
				{
					label: 'Projects',
					items: [
						{
							label: 'pyMC Core',
							autogenerate: { directory: 'projects/pymc-core' },
						},
						{
							label: 'pyMC Repeater',
							autogenerate: { directory: 'projects/pymc-repeater' },
						},
						{
							label: 'pyMC HA Integration',
							autogenerate: { directory: 'projects/pymc-ha-integration' },
						},
						{
							label: 'pyMC HA Add-on',
							autogenerate: { directory: 'projects/pymc-ha-addon' },
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
