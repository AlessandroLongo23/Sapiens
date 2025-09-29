import { themeStore } from '$lib/components/shared/ui/theme/theme.js';

export const getPlaceholderImage = () => {
    if (themeStore.theme === 'light') {
        return '/placeholder.png';
    }
    return '/placeholder-dark.png';
}

export const getTopicIcon = (topic) => {
    return '/teoria/' + topic.path.join('/') + '/icon.png';
}