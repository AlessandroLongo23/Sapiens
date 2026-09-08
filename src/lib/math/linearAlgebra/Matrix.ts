export class Matrix {
    rows: number;
    columns: number;
    data!: number[][];
    
    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
    }
}