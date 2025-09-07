<script>
    import * as ls from 'lucide-svelte';

    let {
        isContactModalOpen = $bindable(false),
    } = $props();
</script>

<footer class="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
	</div>
	
	<div class="relative max-w-4xl mx-auto text-center">
		<div class="mb-10 sm:mb-12">
			<h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
				Pronto a Iniziare il Tuo Percorso?
			</h3>
			<p class="text-zinc-300 mb-8 sm:mb-10 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto px-4">
				Contattami per una consulenza gratuita e scopri come posso aiutarti a raggiungere 
				i tuoi obiettivi accademici con un approccio personalizzato.
			</p>
			
			<div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-12">
				<button
					onclick={() => { isContactModalOpen = true }}
					class="btn-primary text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg shadow-elegant-lg group cursor-pointer"
				>
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<ls.Mail class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
						<span>Richiedi una lezione di prova</span>
					</span>
				</button>
				<a
					href="mailto:aleripetizioni2024@gmail.com"
					class="btn-secondary text-zinc-700 dark:text-zinc-200 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg group cursor-pointer"
				>
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<span>Scrivimi una mail</span>
						<ls.Send class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
					</span>
				</a>
			</div>
		</div>
		
		<div class="pt-8 sm:pt-12 border-t border-zinc-700">
			<p class="text-zinc-400 text-base sm:text-lg">© 2024 Alessandro - Ripetizioni Materie Scientifiche</p>
			<p class="text-zinc-500 text-sm mt-2">Trasformare le difficoltà in successi, una lezione alla volta.</p>
		</div>
	</div>
</footer>