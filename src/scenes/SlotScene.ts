import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js'
import gsap from 'gsap'
import { Scene } from '../core/Scene'
import { GAME_WIDTH, GAME_HEIGHT } from '../core/Config'
import { AssetLoader } from '../core/AssetLoader'
import { Button } from '../ui/Button'
import { BetModal } from '../ui/BetModal'
import { SoundManager } from '../core/SoundManager'

const COLS = 3
const ROWS = 3
const SYMBOL_SIZE = 130
const SYMBOL_GAP = 14

const PANEL_WIDTH = 560
const PANEL_HEIGHT = 560

type ReelData = {
	container: Container
	symbols: Sprite[]
}

export class SlotScene extends Scene {
	private panel: Graphics
	private reelsContainer: Container
	private reelsMask: Graphics
	private reels: ReelData[] = []
	private textures: Texture[] = []

	private balanceText: Text
	private betText: Text
	private statusText: Text

	private spinButton: Button
	private betModal: BetModal | null = null

	private balance = 1000
	private bet = 50
	private isSpinning = false

	private symbolsData: number[][] = []

	constructor() {
		super()

		this.textures = [
			AssetLoader.getTexture('sym1'),
			AssetLoader.getTexture('sym2'),
			AssetLoader.getTexture('sym3'),
			AssetLoader.getTexture('sym4'),
			AssetLoader.getTexture('sym5'),
		]

		this.panel = new Graphics()
		this.addChild(this.panel)

		this.reelsContainer = new Container()
		this.addChild(this.reelsContainer)

		this.reelsMask = new Graphics()
		this.addChild(this.reelsMask)
		this.reelsContainer.mask = this.reelsMask

		this.balanceText = new Text(
			'Balance: 1000',
			new TextStyle({
				fill: 0xffffff,
				fontSize: 24,
				fontWeight: '700',
			})
		)
		this.balanceText.anchor.set(0, 0.5)
		this.addChild(this.balanceText)

		this.betText = new Text(
			'Bet: 50',
			new TextStyle({
				fill: 0xffd54f,
				fontSize: 22,
				fontWeight: '700',
			})
		)
		this.betText.anchor.set(1, 0.5)
		this.betText.eventMode = 'static'
		this.betText.cursor = 'pointer'
		this.betText.on('pointerdown', () => this.openBetModal())
		this.addChild(this.betText)

		this.statusText = new Text(
			'Press SPIN to play',
			new TextStyle({
				fill: 0xb0c4ff,
				fontSize: 18,
			})
		)
		this.statusText.anchor.set(0.5)
		this.addChild(this.statusText)

		this.spinButton = new Button({
			label: 'SPIN',
			width: 260,
			height: 74,
			onClick: () => this.handleSpin(),
		})
		this.addChild(this.spinButton)

		this.createReels()
		this.layout()
		this.randomizeInitial()
	}

	private createReels(): void {
		for (let c = 0; c < COLS; c++) {
			const colContainer = new Container()
			const symbols: Sprite[] = []

			for (let r = 0; r < ROWS; r++) {
				const spr = new Sprite(this.textures[0])
				spr.width = SYMBOL_SIZE
				spr.height = SYMBOL_SIZE
				spr.y = r * (SYMBOL_SIZE + SYMBOL_GAP)
				colContainer.addChild(spr)
				symbols.push(spr)
			}

			colContainer.x = c * (SYMBOL_SIZE + SYMBOL_GAP)
			this.reelsContainer.addChild(colContainer)
			this.reels.push({ container: colContainer, symbols })
		}
	}

	private layout(): void {
		const panelX = (GAME_WIDTH - PANEL_WIDTH) * 0.5
		const panelY = (GAME_HEIGHT - PANEL_HEIGHT) * 0.5 - 80

		this.panel.clear()
		this.panel.beginFill(0x111428)
		this.panel.drawRoundedRect(panelX, panelY, PANEL_WIDTH, PANEL_HEIGHT, 32)
		this.panel.endFill()

		const totalWidth = COLS * SYMBOL_SIZE + (COLS - 1) * SYMBOL_GAP
		const totalHeight = ROWS * SYMBOL_SIZE + (ROWS - 1) * SYMBOL_GAP

		const startX = panelX + (PANEL_WIDTH - totalWidth) * 0.5
		const startY = panelY + (PANEL_HEIGHT - totalHeight) * 0.5

		this.reelsContainer.position.set(startX, startY)

		this.reelsMask.clear()
		this.reelsMask.beginFill(0xffffff)
		this.reelsMask.drawRoundedRect(
			startX - SYMBOL_GAP * 0.5,
			startY - SYMBOL_GAP * 0.5,
			totalWidth + SYMBOL_GAP,
			totalHeight + SYMBOL_GAP,
			24
		)
		this.reelsMask.endFill()

		this.balanceText.position.set(panelX + 24, panelY + 26)
		this.betText.position.set(panelX + PANEL_WIDTH - 24, panelY + 26)

		this.spinButton.position.set(GAME_WIDTH * 0.5, panelY + PANEL_HEIGHT + 80)
		this.statusText.position.set(GAME_WIDTH * 0.5, this.spinButton.y + 60)
	}

	private getRandomTexture(): Texture {
		const id = (Math.random() * this.textures.length) | 0
		return this.textures[id]
	}

	private randomizeInitial(): void {
		this.symbolsData = []
		for (let r = 0; r < ROWS; r++) {
			const row: number[] = []
			for (let c = 0; c < COLS; c++) {
				const id = (Math.random() * this.textures.length) | 0
				row.push(id)
				this.reels[c].symbols[r].texture = this.textures[id]
			}
			this.symbolsData.push(row)
		}
	}

	private handleSpin(): void {
		if (this.isSpinning) return

		if (this.balance < this.bet) {
			this.statusText.text = 'Not enough balance'
			return
		}

		this.balance -= this.bet
		this.updateBalanceText()

		this.isSpinning = true
		this.spinButton.setDisabled(true)
		this.statusText.text = 'Spinning...'

		const finalResult: number[][] = []
		for (let r = 0; r < ROWS; r++) {
			const row: number[] = []
			for (let c = 0; c < COLS; c++) {
				const id = (Math.random() * this.textures.length) | 0
				row.push(id)
			}
			finalResult.push(row)
		}
		this.symbolsData = finalResult

		const baseSteps = 14
		const extraStepsPerReel = 4
		const stepDuration = 0.08
		const reelDelay = 0.15

		const longestSteps = baseSteps + extraStepsPerReel * (COLS - 1)
		const totalSpinTime =
			reelDelay * (COLS - 1) + stepDuration * longestSteps + 0.2

		SoundManager.playSegment('spin', 3, totalSpinTime)

		let completed = 0

		for (let i = 0; i < COLS; i++) {
			const steps = baseSteps + i * extraStepsPerReel
			this.spinSingleReel(i, steps, i * reelDelay, finalResult, () => {
				completed++
				if (completed === COLS) {
					this.finishSpin()
				}
			})
		}
	}

	private spinSingleReel(
		index: number,
		steps: number,
		delay: number,
		finalResult: number[][],
		onComplete: () => void
	): void {
		const reel = this.reels[index]
		const originalY = reel.container.y
		const distance = SYMBOL_SIZE + SYMBOL_GAP

		let currentStep = 0

		const doStep = () => {
			if (currentStep >= steps) {
				for (let r = 0; r < ROWS; r++) {
					const id = finalResult[r][index]
					reel.symbols[r].texture = this.textures[id]
				}
				reel.container.y = originalY
				onComplete()
				return
			}

			currentStep++

			gsap.to(reel.container, {
				y: originalY + distance,
				duration: 0.08,
				ease: 'none',
				onComplete: () => {
					const symbols = reel.symbols
					for (let r = ROWS - 1; r > 0; r--) {
						symbols[r].texture = symbols[r - 1].texture
					}
					symbols[0].texture = this.getRandomTexture()

					reel.container.y = originalY
					doStep()
				},
			})
		}

		gsap.delayedCall(delay, doStep)
	}

	private finishSpin(): void {
		const centerRow = 1
		const a = this.symbolsData[centerRow][0]
		const b = this.symbolsData[centerRow][1]
		const c = this.symbolsData[centerRow][2]

		let win = 0

		if (a === b && b === c) {
			win = this.bet * 5
		} else if (a === b || a === c || b === c) {
			win = Math.round(this.bet * 0.5)
		}

		if (win > 0) {
			this.balance += win
			this.statusText.text = `You win ${win}`
			SoundManager.play('win')
		} else {
			this.statusText.text = 'No win, try again'
		}

		this.updateBalanceText()
		this.isSpinning = false
		this.spinButton.setDisabled(false)
	}

	private updateBalanceText(): void {
		this.balanceText.text = `Balance: ${this.balance}`
		this.betText.text = `Bet: ${this.bet}`
	}

	private openBetModal(): void {
		if (this.betModal || this.isSpinning) return

		this.spinButton.setDisabled(true)

		this.betModal = new BetModal(
			this.bet,
			10,
			1000,
			newBet => {
				this.bet = newBet
				this.updateBalanceText()
			},
			() => this.closeBetModal()
		)

		this.addChild(this.betModal)
	}

	private closeBetModal(): void {
		if (!this.betModal) return

		this.removeChild(this.betModal)
		this.betModal.destroy({ children: true })
		this.betModal = null

		if (!this.isSpinning) {
			this.spinButton.setDisabled(false)
		}
	}
}
