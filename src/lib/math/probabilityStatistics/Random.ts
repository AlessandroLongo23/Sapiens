import { Number } from "$lib/math/algebra/Number";
import { Sampler } from "$lib/math/probabilityStatistics/Sampler";

export class Random {
    /**
     * Generates a random float number between min and max
     * 
     * @param min - The minimum value
     * @param max - The maximum value
     * @param condition - The condition that the number must satisfy
     * @param maxIter - The maximum number of iterations
     * @returns 
     */
    static float(
        min: number,
        max: number, 
        condition: (n: Number) => boolean = () => true, 
        maxIter: number = 100
    ): Number {
        let iter: number = 0;
        let n: Number;
        do {
            n = new Number(Math.random() * (max - min) + min);
            iter++;
        } while (!condition(n) && iter < maxIter);
        if (iter >= maxIter) {
            throw new Error('Maximum number of iterations reached');
        }
        return n;
    }

    /**
     * Generates a random integer number between min and max
     * 
     * @param min - The minimum value
     * @param max - The maximum value
     * @param condition - (Optional) The condition that the number must satisfy. Defaults to always `true`.
     * @param maxIter - (Optional) The maximum number of iterations. Defaults to 100.
     * 
     * @returns A random integer number between min and max
     * 
     * @throws Will throw an error if the maximum number of iterations is reached
     * @throws Will throw an error if min > max
     * @throws Will throw an error if max_iterations is < 0
     */
    static int(
        min: number | Number, 
        max: number | Number, 
        condition: (n: Number) => boolean = () => true, 
        maxIter: number = 100
    ): Number {
        if (typeof min === 'number') min = new Number(min);
        if (typeof max === 'number') max = new Number(max);
        let iter: number = 0;
        let n: Number;
        do {
            n = new Number(Math.floor(Math.random() * (max.value - min.value + 1)) + min.value);
            iter++;
        } while (!condition(n) && iter < maxIter);
        if (iter >= maxIter) {
            throw new Error('Maximum number of iterations reached');
        }
        return n;
    }

    /**
     * Generates a random integer array of given length, where each element
     * is between `min` and `max` (inclusive). The generated array must satisfy
     * an optional condition function; otherwise, it retries up to `maxIter` times.
     *
     * @param min - The minimum integer value (inclusive).
     * @param max - The maximum integer value (inclusive).
     * @param length - The length of the resulting array.
     * @param condition - (Optional) A predicate that the generated array must satisfy.
     *                    Defaults to always `true`.
     * @param maxIter - (Optional) The maximum number of attempts to generate an array
     *                  satisfying the condition. Defaults to 100.
     *
     * @returns A random integer array of length `length`. If the condition cannot be
     *          satisfied within `maxIter` iterations, returns the last generated array.
     *
     * @throws Will throw an error if `min > max` or if `length < 0`.
     *
     * @example
     * // Generate an array of 5 random integers between 1 and 10
     * const arr1 = Random.intArray(1, 10, 5);
     * 
     * // Generate an array of 5 random integers between 1 and 10
     * // where all numbers must be even
     * const arr2 = Random.intArray(
     *   1, 
     *   10, 
     *   5, 
     *   (arr) => arr.every(n => n % 2 === 0)
     * );
     */
    static intArray(
        min: number, 
        max: number, 
        length: number, 
        condition: (arr: Number[]) => boolean = () => true, 
        maxIter: number = 100
    ): Number[] {
        let iter: number = 0;
        let arr: Number[];
        do {
            arr = Array.from({ length }, () => Random.int(min, max)) as Number[];
            iter++;
        } while (!condition(arr) && iter < maxIter);

        return arr;
    }

    /**
     * Generates a random choice from an array
     * 
     * @param array - The array to choose from
     * @param condition - (Optional) The condition that the item must satisfy. Defaults to always `true`.
     * @param maxIter - (Optional) The maximum number of iterations. Defaults to 100.
     * @param seed - (Optional) Seed for reproducible results.
     * @returns A random choice from the array
     *
     * @throws Will throw an error if the maximum number of iterations is reached
     */
    static choice<T>(
        array: T[], 
        condition: (item: T) => boolean = () => true, 
        maxIter: number = 100,
        seed?: number
    ): T {
        return Sampler.choice(array, condition, maxIter, seed);
    }

    /**
     * Generates a random array of choices from an array, with repetitions allowed
     * 
     * @param array - The array to choose from
     * @param length - The length of the resulting array
     * @param condition - (Optional) The condition that each item must satisfy. Defaults to always `true`.
     * @param maxIter - (Optional) The maximum number of iterations per element. Defaults to 100.
     * @param seed - (Optional) Seed for reproducible results.
     * 
     * @returns A random array of choices from the array
     *
     * @throws Will throw an error if the maximum number of iterations is reached
     */
    static choices<T>(
        array: T[], 
        length: number, 
        condition: (item: T) => boolean = () => true, 
        maxIter: number = 100,
        seed?: number
    ): T[] {
        return Sampler.choices(array, length, condition, maxIter, seed);
    }

    /**
     * Generates a random sample from an array, without repetitions
     * 
     * @param array - The array to sample from
     * @param size - The size of the resulting array
     * @param condition - (Optional) The condition that the sample must satisfy. Defaults to always `true`.
     * @param maxIter - (Optional) The maximum number of iterations. Defaults to 100.
     * @param seed - (Optional) Seed for reproducible results.
     * @returns A random sample from the array
     * 
     * @throws Will throw an error if sample size is greater than array length
     * @throws Will throw an error if the maximum number of iterations is reached
     */
    static sample<T>(
        array: T[],
        size: number,
        condition: (sample: T[]) => boolean = () => true,
        maxIter: number = 100,
        seed?: number
    ): T[] {
        return Sampler.sample(array, size, condition, maxIter, seed);
    }

    /**
     * Shuffles an array using Fisher-Yates algorithm
     * 
     * @param array - The array to shuffle
     * @param seed - (Optional) Seed for reproducible results.
     * @returns The shuffled array
     */
    static shuffle<T>(array: T[], seed?: number): T[] {
        return Sampler.shuffle(array, seed);
    }


    /**
     * Generates a random boolean value
     * @returns A random boolean value
     */
    static bool(): boolean {
        return Math.random() < 0.5;
    }
}