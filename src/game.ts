import { Vector } from './vector'
import { Player } from './types'
import { Ban } from './ban'
import { Koma } from './koma'
import { findThenPop } from './utils'

export class IllegalOperationError extends Error {}

export class Game {
    ban: Ban
    mochigomaList: Koma[]
    currentPlayer: Player

    constructor(ban: Ban, mochigomaList: Koma[]) {
        this.ban = ban
        this.mochigomaList = mochigomaList
        this.currentPlayer = 'sente'
    }

    play(
        newPos: Vector,
        currentPos: Vector | null,
        komaType: new (owner: Player) => Koma
    ): void {
        let koma
        if (currentPos) {
            const k = this.ban.get(currentPos)
            koma = k && k.owner === this.currentPlayer ? k : undefined
        } else if (komaType) {
            koma = findThenPop(
                this.mochigomaList,
                (k) => k.owner == this.currentPlayer && k instanceof komaType
            )
        } else {
            throw new Error()
        }

        if (
            !koma ||
            !koma
                .reachablePositionList(currentPos, this.ban)
                .some((p) => p.equals(newPos))
        ) {
            throw new IllegalOperationError()
        }

        const komaOnNewPos = this.ban.get(newPos)
        if (komaOnNewPos) {
            this.ban.delete(newPos)
            komaOnNewPos.owner = this.currentPlayer
            this.mochigomaList.push(komaOnNewPos)
        }

        if (currentPos) {
            this.ban.delete(currentPos)
        }
        this.ban.set(newPos, koma)

        this.switchPlayer()
    }

    private switchPlayer(): void {
        if (this.currentPlayer == 'sente') {
            this.currentPlayer = 'gote'
        } else {
            this.currentPlayer = 'sente'
        }
    }
}
