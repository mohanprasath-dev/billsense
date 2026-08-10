'use client';

import { motion } from 'motion/react';

const TEAM_MEMBERS = [
	{
		name: 'Mohan Prasath',
		role: 'Founder & Developer',
		avatar: 'MP',
	},
	{
		name: 'Thejashree J P',
		role: 'Research & Data Lead',
		avatar: 'TJ',
	},
];

const CONTACT_LINKS = [
	{
		label: 'LinkedIn',
		value: 'in/mohanprasath21',
		href: 'https://www.linkedin.com/in/mohanprasath21/',
		icon: (
			<svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
				<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
			</svg>
		),
	},
	{
		label: 'Agency Website',
		value: 'taskdrift.in',
		href: 'https://www.taskdrift.in/',
		icon: (
			<svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<circle cx="12" cy="12" r="10" />
				<line x1="2" y1="12" x2="22" y2="12" />
				<path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
			</svg>
		),
	},
	{
		label: 'Email',
		value: 'info.taskdrift@gmail.com',
		href: 'mailto:info.taskdrift@gmail.com',
		icon: (
			<svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
			</svg>
		),
	},
	{
		label: 'Portfolio',
		value: 'mohanprasath.dev',
		href: 'https://mohanprasath.dev',
		icon: (
			<svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
	},
];

export default function LandingTeamAndContact() {
	return (
		<section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200/60">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
				{/* Team Section */}
				<div id="team">
					<span className="inline-block px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-3 border border-slate-200">
						The Team
					</span>
					<h2 className="type-heading-1 text-slate-900 mb-4">
						Built by TaskDrift
					</h2>
					<p className="type-subheadline text-slate-600 mb-8 max-w-md">
						Designed and developed with extreme care to bring transparency and clarity to healthcare.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{TEAM_MEMBERS.map((member) => (
							<motion.div
								key={member.name}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ type: 'spring', damping: 25, stiffness: 200 }}
								className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-teal-200 transition-colors"
							>
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
									{member.avatar}
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 text-base leading-snug">
										{member.name}
									</h3>
									<p className="text-xs font-medium text-slate-500 mt-0.5">
										{member.role}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Contact Block */}
				<div id="contact">
					<span className="inline-block px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-100">
						Get In Touch
					</span>
					<h2 className="type-heading-1 text-slate-900 mb-4">
						Contact & Enquiries
					</h2>
					<p className="type-subheadline text-slate-600 mb-8 max-w-md">
						Connect with Mohan Prasath for feedback, inquiries, or web development partnerships.
					</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{CONTACT_LINKS.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="block"
							>
								<motion.div
									whileTap={{ scale: 0.97 }}
									transition={{ type: 'spring', damping: 25, stiffness: 400 }}
									className="glass-card rounded-xl p-4 flex items-center gap-3.5 hover:border-teal-300 hover:shadow-sm transition-all group"
								>
									<div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
										{link.icon}
									</div>
									<div className="min-w-0">
										<p className="text-xs font-medium text-slate-500">
											{link.label}
										</p>
										<p className="text-sm font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
											{link.value}
										</p>
									</div>
								</motion.div>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
