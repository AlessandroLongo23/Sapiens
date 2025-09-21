<script>
    import { cardStyle } from '$lib/const/appearance.js';
    import { goto } from '$app/navigation';
    import * as ls from 'lucide-svelte';
    
    let { 
        columns, 
        data, 
        detailPageUrl,
        isLoading,
        handleEditClick,
        handleDeleteClick,
        labelPlural,
        labelSingular,
        elementsPerPage = 10,
        showNumbers = false,
    } = $props();

    let counter = $state(0);
    setInterval(() => {
        counter++;
    }, 10);

    let page = $state(1);

    let sortColumn = $state('');
    let sortDirection = $state('asc');

    let sortedData = $derived.by(() => {
        if (data.length === 0) return [];
        if (!sortColumn) return data;
        return getSortedData(data);
    });

    const getSortedData = (data) => {
        if (!sortColumn) return data;
        
        return [...data].sort((a, b) => {
            if (columns.find(column => column.key === sortColumn).sort) {
                return columns.find(column => column.key === sortColumn).sort(a, b, sortDirection);
            }
            
            let aValue = a[sortColumn] || '';
            let bValue = b[sortColumn] || '';
            
            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    };

    const handleSort = (columnKey) => {
        if (sortColumn === columnKey) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = columnKey;
            sortDirection = 'asc';
        }
    };
</script>

<div class="flex flex-col gap-4 items-start justify-between w-full">
    <div class='shadow-sm overflow-x-auto max-h-130 w-full overflow-y-auto {cardStyle}'>
        <table class="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead class="sticky top-0 z-10 text-zinc-700 bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400">
                <tr>
                    {#if showNumbers}
                        <th scope="col" class="px-4 py-3 border-r border-zinc-500/25 w-10">
                            <ls.Hash class="size-4 mx-auto" />
                        </th>
                    {/if}
                    {#each columns as column}
                        <th scope="col" class="px-4 py-3 border-r border-zinc-500/25 {column?.width}">
                            <button 
                                class="{column.sortable ? 'cursor-pointer' : 'pointer-events-none'} flex items-center justify-between w-full hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                                onclick={() => column.sortable && handleSort(column.key)}
                            >
                                <div class="flex flex-row items-center gap-2">
                                    {#if column.icon}
                                        <column.icon class="size-4" />
                                    {/if}
                                    <span class="text-xs">{column.label.toUpperCase()}</span>
                                </div>
                                {#if column.sortable}
                                    <div class="flex flex-col ml-2">
                                        <ls.ChevronUp class="size-3 {sortColumn === column.key && sortDirection === 'asc' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}" />
                                        <ls.ChevronDown class="size-3 -mt-1 {sortColumn === column.key && sortDirection === 'desc' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}" />
                                    </div>
                                {/if}
                            </button>
                        </th>
                    {/each}
                    <th scope="col" class="px-4 py-3 border-r border-zinc-500/25 pointer-events-none w-24">
                        <div class="flex flex-row items-center gap-2">
                            <ls.MousePointerClick class="size-4" />
                            <span class="text-xs">AZIONI</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#if isLoading}
                    <tr>
                        <td colspan="{columns.length + 1}" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
                            Caricando { labelPlural }...
                        </td>
                    </tr>
                {:else if sortedData.length === 0}
                    <tr class="bg-white dark:bg-zinc-900 font-thin border-t border-zinc-500/25 dark:border-zinc-800">
                        <td colspan="{columns.length + 1}" class="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400 pointer-events-none">
                            Nessun { labelSingular } trovato. Aggiungi il tuo primo { labelSingular } per iniziare.
                        </td>
                    </tr>
                {:else}
                    {#each sortedData as item, i (item.id)}
                        <tr class="bg-white dark:bg-zinc-900 border-t border-zinc-500/25 dark:border-zinc-800">
                            {#if showNumbers}
                                <td class="px-3 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50 text-center">
                                    {i + 1}
                                </td>
                            {/if}
                            {#each columns as column, j}
                                <td 
                                    onclick={() => column.onclick && column.onclick(item)}
                                    class="
                                        px-3 py-2 border-r border-zinc-200/50 dark:border-zinc-700/50 
                                        { column.onclick ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400' : 'pointer-events-none' }
                                        { counter > i * (columns.length + 1) + j ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0' } transition-all duration-200 ease-in-out
                                    "
                                >
                                    {#if column.component}
                                        <svelte:component this={column.component.is} {...column.component.getProps(item)} />
                                    {:else if column.display}
                                        {@html column.display(item)}
                                    {/if}
                                </td>
                            {/each}
                            <td class="flex items-center px-3 py-2 text-center justify-center gap-2 { counter > (i + 1) * (columns.length + 1) - 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0' } transition-all duration-200 ease-in-out">
                                <button 
                                    onclick={(e) => goto(`/admin/${detailPageUrl}/${item.id}`)}
                                    class="font-thin p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-700 text-blue-600 hover:text-blue-900 dark:text-blue-500 hover:underline"
                                >
                                    <ls.Info class="size-4" />
                                </button>

                                <button 
                                    onclick={(e) => handleEditClick(e, item)} 
                                    class="font-thin p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 dark:text-zinc-500 hover:underline"
                                >
                                    <ls.Pencil class="size-4" />
                                </button>

                                <button 
                                    onclick={(e) => handleDeleteClick(e, item)} 
                                    class="font-thin p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-700 text-red-600 hover:text-red-900 dark:text-red-500 hover:underline"
                                >
                                    <ls.Trash2 class="size-4" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>

    <div class="flex flex-row justify-between items-center w-full text-zinc-900 dark:text-zinc-50">
        <p class="text-sm text-zinc-500 dark:text-zinc-400">Mostro {page * elementsPerPage} di {sortedData.length} {labelPlural}</p>

        <div class="flex justify-center items-center">
            <button 
                onclick={() => page = page - 1} 
                class="text-sm rounded-l-lg px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-500/25"
            >
                Precedente
            </button>

            <span class="text-sm px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-500/25">
                {page}
            </span>


            <button 
                onclick={() => page = page + 1} 
                class="text-sm rounded-r-lg px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-500/25"
            >
                Successivo
            </button>
        </div>
    </div>
</div>
