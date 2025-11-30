<script lang="ts">
    import { BillingOption } from '$lib/data/billing-options';

	interface Props {
		value?: BillingOption;
		onChange?: (value: BillingOption) => void;
		class?: string;
	}

	let { value = BillingOption.MONTHLY, onChange, class: className = '' }: Props = $props();

	function handleToggle(newValue: BillingOption) {
		if (onChange) {
			onChange(newValue);
		}
	}
</script>

<div class="flex items-center justify-center gap-4 {className}">
	<span class="text-sm font-medium {value === BillingOption.MONTHLY ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'} transition-colors">
		Mensile
	</span>
	
	<button
		type="button"
		role="switch"
		aria-checked={value === BillingOption.SEMESTER}
		aria-label="Seleziona periodo di fatturazione"
		onclick={() => handleToggle(value === BillingOption.MONTHLY ? BillingOption.SEMESTER : BillingOption.MONTHLY)}
		class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors {value === BillingOption.SEMESTER ? 'bg-crimson-500' : 'bg-zinc-300 dark:bg-zinc-600'}"
	>
		<span
			class="inline-block h-6 w-6 transform rounded-full bg-white transition-transform {value === BillingOption.SEMESTER ? 'translate-x-7' : 'translate-x-1'}"
		></span>
	</button>
	
	<span class="text-sm font-medium {value === BillingOption.SEMESTER ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'} transition-colors">
		Semestrale
	</span>
</div>

