// Type declarations for custom prototype extensions

interface Array<T> {
    /**
     * Shuffles the array in place and returns it
     */
    shuffle(): T[];

    /**
     * Returns a random element from the array
     */
    random(): T;

    /**
     * Extracts n random elements from the array
     * @param n - Number of elements to extract
     */
    extract(n: number): T[];
}


interface Set<T> {
    /**
     * Joins the set elements into a string
     * @param joiner - String to join with (default: ', ')
     */
    join(joiner?: string): string;

    /**
     * Returns a new sorted Set
     */
    sort(): Set<T>;
}

