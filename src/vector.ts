export class Vector {
    column: number
    row: number

    constructor(column: number, row: number) {
        this.column = column
        this.row = row
    }

    equals(other: Vector): boolean {
        return this.column === other.column && this.row === other.row
    }

    add(other: Vector): Vector {
        return new Vector(this.column + other.column, this.row + other.row)
    }

    scalar_mul(n: number): Vector {
        return new Vector(this.column * n, this.row * n)
    }
}
