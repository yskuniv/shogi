import { Vector } from './vector'
import { Koma } from './koma'

export class InvalidPositionError extends Error {}

export class Ban {
    static readonly SIZE = 9

    private container: (Koma | null)[][]

    static isValidPosition(pos: Vector): boolean {
        if (
            pos.column >= 1 &&
            pos.column <= Ban.SIZE &&
            pos.row >= 1 &&
            pos.row <= Ban.SIZE
        ) {
            return true
        } else {
            return false
        }
    }

    static validatePosition(pos: Vector): void {
        if (!Ban.isValidPosition(pos)) {
            throw new InvalidPositionError()
        }
    }

    static allPositionList(): Vector[] {
        return Array.from(Array(Ban.SIZE), (_, i) =>
            Array.from(Array(Ban.SIZE), (_, j) => new Vector(i + 1, j + 1))
        ).reduce((a, v) => a.concat(v))
    }

    constructor() {
        this.container = Array.from(Array(Ban.SIZE), () =>
            Array.from(Array(Ban.SIZE), () => null)
        )
    }

    get(pos: Vector): Koma | null {
        Ban.validatePosition(pos)
        return this.container[pos.column - 1][pos.row - 1]
    }

    set(pos: Vector, koma: Koma): void {
        Ban.validatePosition(pos)
        this.container[pos.column - 1][pos.row - 1] = koma
    }

    delete(pos: Vector): void {
        Ban.validatePosition(pos)
        this.container[pos.column - 1][pos.row - 1] = null
    }

    otherKomaListOnColumn(pos: Vector): Koma[] {
        Ban.validatePosition(pos)

        return Array.from(Array(Ban.SIZE), (_, j) => j + 1)
            .filter((row) => row !== pos.row)
            .map((row) => this.container[pos.column - 1][row - 1])
            .filter((k) => k) as Koma[]
    }

    forEach(f: (k: Koma | null, pos: Vector) => unknown): void {
        this.container.forEach((row, i) =>
            row.forEach((k, j) => f(k, new Vector(i + 1, j + 1)))
        )
    }
}
