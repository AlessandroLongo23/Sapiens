/**
 * Utility functions for random sampling with optional conditions.
 */
export class Sampler {
    /**
     * Fisher–Yates shuffle (unbiased, efficient).
     * Optionally uses a seeded RNG for reproducibility.
     */
    private static fisherYatesShuffle<T>(array: T[], rng: () => number = Math.random): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Creates a reproducible pseudo-random number generator using a seed.
     * Simple linear congruential generator (LCG).
     */
    private static seededRng(seed: number): () => number {
        let s = seed % 2147483647;
        if (s <= 0) s += 2147483646;
        return () => (s = (s * 16807) % 2147483647) / 2147483647;
    }

    /**
     * Shuffles an array in place using Fisher-Yates algorithm.
     * @param array - Source array to shuffle.
     * @param seed - Optional seed for reproducible results.
     * @returns The shuffled array.
     */
    static shuffle<T>(array: T[], seed?: number): T[] {
        const rng = seed !== undefined ? this.seededRng(seed) : Math.random;
        return this.fisherYatesShuffle(array, rng);
    }

    /**
     * Returns a single random element from an array.
     * @param array - Source array.
     * @param condition - Optional condition that the element must satisfy.
     * @param maxIter - Maximum attempts before throwing an error.
     * @param seed - Optional seed for reproducible results.
     * @returns A random element from the array.
     * @throws Will throw an error if the maximum number of iterations is reached.
     */
    static choice<T>(
        array: T[],
        condition: (item: T) => boolean = () => true,
        maxIter = 100,
        seed?: number
    ): T {
        if (array.length === 0) {
            throw new Error('Cannot choose from an empty array');
        }

        const rng = seed !== undefined ? this.seededRng(seed) : Math.random;
        let iter = 0;
        let item: T;

        do {
            const index = Math.floor(rng() * array.length);
            item = array[index];
            iter++;
        } while (!condition(item) && iter < maxIter);

        if (iter >= maxIter) {
            throw new Error('Maximum number of iterations reached without satisfying condition');
        }

        return item;
    }

    /**
     * Returns multiple random elements from an array, with repetition allowed.
     * @param array - Source array.
     * @param size - Number of elements to sample.
     * @param condition - Optional condition that each element must satisfy.
     * @param maxIter - Maximum attempts per element before throwing an error.
     * @param seed - Optional seed for reproducible results.
     * @returns Array of random elements with repetition allowed.
     */
    static choices<T>(
        array: T[],
        size: number,
        condition: (item: T) => boolean = () => true,
        maxIter = 100,
        seed?: number
    ): T[] {
        if (array.length === 0) {
            throw new Error('Cannot choose from an empty array');
        }

        const rng = seed !== undefined ? this.seededRng(seed) : Math.random;
        const result: T[] = [];

        for (let i = 0; i < size; i++) {
            let iter = 0;
            let item: T;

            do {
                const index = Math.floor(rng() * array.length);
                item = array[index];
                iter++;
            } while (!condition(item) && iter < maxIter);

            if (iter >= maxIter) {
                throw new Error('Maximum number of iterations reached without satisfying condition');
            }

            result.push(item);
        }

        return result;
    }

    /**
     * Returns a random sample of given size, without repetition.
     * @param array - Source array.
     * @param size - Number of elements to sample.
     * @param condition - Optional condition that the entire sample must satisfy.
     * @param maxIter - Maximum attempts before throwing an error.
     * @param seed - Optional seed for reproducible results.
     * @returns Array of random elements without repetition.
     * @throws Will throw an error if sample size is greater than array length.
     * @throws Will throw an error if the maximum number of iterations is reached.
     */
    static sample<T>(
        array: T[],
        size: number,
        condition: (sample: T[]) => boolean = () => true,
        maxIter = 100,
        seed?: number
    ): T[] {
        if (size > array.length) {
            throw new Error('Sample size is greater than array length');
        }

        const rng = seed !== undefined ? this.seededRng(seed) : Math.random;
        let iter = 0;
        let sample: T[];

        do {
            sample = this.sampleWithoutReplacement(array, size, rng);
            iter++;
        } while (!condition(sample) && iter < maxIter);

        if (iter >= maxIter && !condition(sample)) {
            throw new Error('Maximum number of iterations reached without satisfying condition');
        }

        return sample;
    }

    /**
     * Returns a random sample of given size, without repetition.
     * Internal method without condition checking for efficiency.
     * @param array - Source array.
     * @param size - Number of elements to sample.
     * @param rng - Optional RNG for reproducibility.
     */
    static sampleWithoutReplacement<T>(
        array: T[],
        size: number,
        rng: () => number = Math.random
    ): T[] {
        if (size > array.length) {
            throw new Error('Sample size is greater than array length');
        }
        const shuffled = this.fisherYatesShuffle(array, rng);
        return shuffled.slice(0, size);
    }
}
