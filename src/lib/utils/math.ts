export const ceilToMultiple = (value: number, multiple: number): number => {
	return Math.ceil(value / multiple) * multiple;
}

export const floorToMultiple = (value: number, multiple: number): number => {
	return Math.floor(value / multiple) * multiple;
}

export const roundToMultiple = (value: number, multiple: number): number => {
	return Math.round(value / multiple) * multiple;
}