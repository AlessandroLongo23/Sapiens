<script lang="ts">
	import CookieManageLink from '$lib/components/consent/CookieManageLink.svelte';

	const linkClass = 'text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base text-left';
</script>

<footer class="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white relative overflow-hidden border-t border-zinc-500/25">
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
	</div>
	
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
			<div class="lg:col-span-1">
				<p class="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
					Sapiens
				</p>
				<p class="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 max-w-xs">
					Smart help for smart learners. Trasformare le difficoltà in successi, una lezione alla volta.
				</p>
			</div>

			<div>
				<h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
					Navigazione
				</h2>
				<nav class="flex flex-col space-y-3" aria-label="Navigazione">
					<a 
						href="/" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Home
					</a>
					<a 
						href="/pricing" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Prezzi
					</a>
					<a 
						href="/faq" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						FAQ
					</a>
				</nav>
			</div>

			<div>
				<h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
					Informazioni
				</h2>
				<nav class="flex flex-col space-y-3" aria-label="Informazioni">
					<a 
						href="/contacts" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Contatti
					</a>
					<a 
						href="/faq" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Domande frequenti
					</a>
				</nav>
			</div>

			<div>
				<h2 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
					Legale
				</h2>
				<nav class="flex flex-col space-y-3" aria-label="Legale">
					<a 
						href="/terms" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Termini e condizioni
					</a>
					<a 
						href="/privacy" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Privacy
					</a>
					<a 
						href="/cookie" 
						class="text-zinc-400 hover:text-crimson-400 transition-colors duration-200 text-sm sm:text-base"
					>
						Cookie policy
					</a>
					<CookieManageLink class={linkClass} />
				</nav>
			</div>
		</div>

		<div class="border-t border-zinc-500/25 pt-8">
			<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
				<div class="text-center sm:text-left">
					<p class="text-zinc-400 text-xs sm:text-sm">
						© {new Date().getFullYear()} Sapiens. Tutti i diritti riservati.
					</p>
					<p class="text-zinc-400 text-xs mt-1">
						Materiale Didattico Online
					</p>
				</div>

				<div class="text-center sm:text-right">
					<p class="text-zinc-400 text-xs sm:text-sm">
						Fatto con ❤️ per gli studenti
					</p>
				</div>
			</div>
		</div>
	</div>
</footer>