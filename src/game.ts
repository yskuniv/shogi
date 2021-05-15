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
        komaType: new (owner: Player) => Koma | null,
        naru = false
    ): void {
        let koma
        if (currentPos) {
            const k = this.ban.get(currentPos)
            koma = k && k.owner === this.currentPlayer ? k : undefined
        } else if (komaType) {
            if (naru) {
                throw new IllegalOperationError()
            }

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

        if (naru) {
            if (
                !currentPos ||
                !(
                    (this.currentPlayer === 'sente' &&
                        (newPos.row <= 3 || currentPos.row <= 3)) ||
                    (this.currentPlayer === 'gote' &&
                        (newPos.row >= 7 || currentPos.row >= 7))
                )
            ) {
                throw new IllegalOperationError()
            }

            koma.nari = true
        }

        const komaOnNewPos = this.ban.get(newPos)
        if (komaOnNewPos) {
            this.ban.delete(newPos)
            komaOnNewPos.owner = this.currentPlayer
            komaOnNewPos.nari = false
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
