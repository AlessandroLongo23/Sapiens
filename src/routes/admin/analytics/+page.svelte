<script>
	import DashboardStats from '$lib/components/admin/widgets/DashboardStats.svelte';
	import TopEarningsBar from '$lib/components/admin/widgets/TopEarningsBar.svelte';
	import Earnings from '$lib/components/admin/widgets/Earnings.svelte';
	import LecturesTimeDistribution from '$lib/components/admin/widgets/LecturesTimeDistribution.svelte';
	import LecturesWeekDistribution from '$lib/components/admin/widgets/LecturesWeekDistribution.svelte';
</script>

<div class="space-y-4 md:space-y-6">
	<DashboardStats />
	
	<div class="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
		<div class="lg:col-span-4">
			<Earnings />
		</div>
		<div class="lg:col-span-3">
			<TopEarningsBar />
		</div>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
		<div class="lg:col-span-3">
			<LecturesWeekDistribution />
		</div>
		<div class="lg:col-span-4">
			<LecturesTimeDistribution />
		</div>
	</div>
</div>
