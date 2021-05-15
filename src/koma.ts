import { Vector } from './vector'
import { Ban } from './ban'
import { Player } from './types'

export class InvalidPositionSpecifiedError extends Error {}

export abstract class Koma {
    owner: Player
    nari: boolean

    constructor(owner: Player) {
        this.owner = owner
        this.nari = false
    }

    reachablePositionList(ownPos: Vector | null, ban: Ban): Vector[] {
        if (ownPos) {
            if (!Ban.isValidPosition(ownPos)) {
                throw new InvalidPositionSpecifiedError()
            }

            const res: Vector[] = []

            this.exploreReachablePosition((motion: Vector) => {
                const p = ownPos.add(motion.scalar_mul(this.direction()))
                if (Ban.isValidPosition(p)) {
                    const k = ban.get(p)
                    if (k === null || k.owner !== this.owner) {
                        res.push(p)

                        if (k === null) {
                            return true
                        }
                    }
                }

                return false
            })

            return res
        } else {
            return Ban.allPositionList().filter(
                (p) => ban.get(p) === null && this.isAllowedToPut(p, ban)
            )
        }
    }

    abstract exploreReachablePosition(
        selector: (motion: Vector) => boolean
    ): void

    isAllowedToPut(_position: Vector, _ban: Ban): boolean {
        return true
    }

    direction(): number {
        if (this.owner === 'sente') {
            return -1
        } else {
            return 1
        }
    }
}

export class Gyoku extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        ;[
            new Vector(-1, 1),
            new Vector(0, 1),
            new Vector(1, 1),
            new Vector(-1, 0),
            new Vector(1, 0),
            new Vector(-1, -1),
            new Vector(0, -1),
            new Vector(1, -1),
        ].forEach(selector)
    }
}

export class Hisha extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        for (let i = 1; selector(new Vector(0, i)); i++);
        for (let i = 1; selector(new Vector(-i, 0)); i++);
        for (let i = 1; selector(new Vector(i, 0)); i++);
        for (let i = 1; selector(new Vector(0, -i)); i++);

        if (this.nari) {
            ;[
                new Vector(-1, 1),
                new Vector(1, 1),
                new Vector(-1, -1),
                new Vector(1, -1),
            ].forEach(selector)
        }
    }
}

export class Kaku extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        for (let i = 1; selector(new Vector(-i, i)); i++);
        for (let i = 1; selector(new Vector(i, i)); i++);
        for (let i = 1; selector(new Vector(-i, -i)); i++);
        for (let i = 1; selector(new Vector(i, -i)); i++);

        if (this.nari) {
            ;[
                new Vector(0, 1),
                new Vector(-1, 0),
                new Vector(1, 0),
                new Vector(0, -1),
            ].forEach(selector)
        }
    }
}

export class Kin extends Koma {
    static exploreReachablePosition(selector: (v: Vector) => boolean): void {
        ;[
            new Vector(-1, 1),
            new Vector(0, 1),
            new Vector(1, 1),
            new Vector(-1, 0),
            new Vector(1, 0),
            new Vector(0, -1),
        ].forEach(selector)
    }

    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        Kin.exploreReachablePosition(selector)
    }
}

export class Gin extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        if (!this.nari) {
            ;[
                new Vector(-1, 1),
                new Vector(0, 1),
                new Vector(1, 1),
                new Vector(-1, -1),
                new Vector(1, -1),
            ].forEach(selector)
        } else {
            Kin.exploreReachablePosition(selector)
        }
    }
}

export class Keima extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        if (!this.nari) {
            ;[new Vector(-1, 2), new Vector(1, 2)].forEach(selector)
        } else {
            Kin.exploreReachablePosition(selector)
        }
    }
}

export class Kyosha extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        if (!this.nari) {
            for (let i = 1; selector(new Vector(0, i)); i++);
        } else {
            Kin.exploreReachablePosition(selector)
        }
    }
}

export class Fu extends Koma {
    exploreReachablePosition(selector: (v: Vector) => boolean): void {
        if (!this.nari) {
            selector(new Vector(0, 1))
        } else {
            Kin.exploreReachablePosition(selector)
        }
    }

    isAllowedToPut(position: Vector, ban: Ban): boolean {
        return ban
            .otherKomaListOnColumn(position)
            .every((k) => !(k.owner === this.owner && k instanceof Fu))
    }
}
