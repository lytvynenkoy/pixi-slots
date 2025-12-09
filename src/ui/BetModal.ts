import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import { GAME_WIDTH, GAME_HEIGHT } from '../core/Config'
import { Button } from './Button'

export class BetModal extends Container {
	private value: number
	private valueText: Text

	constructor(
		currentBet: number,
		minBet: number,
		maxBet: number,
		onApply: (bet: number) => void,
		onClose: () => void
	) {
		super()

		this.value = currentBet

		const overlay = new Graphics()
		overlay.beginFill(0x000000, 0.6)
		overlay.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
		overlay.endFill()
		this.addChild(overlay)

		const boxWidth = 420
		const boxHeight = 260

		const box = new Graphics()
		box.beginFill(0x111428)
		box.drawRoundedRect(
			(GAME_WIDTH - boxWidth) * 0.5,
			(GAME_HEIGHT - boxHeight) * 0.5,
			boxWidth,
			boxHeight,
			20
		)
		box.endFill()
		this.addChild(box)

		const title = new Text(
			'Set bet',
			new TextStyle({
				fill: 0xffffff,
				fontSize: 24,
				fontWeight: '700',
			})
		)
		title.anchor.set(0.5)
		title.position.set(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 - 80)
		this.addChild(title)

		this.valueText = new Text(
			String(this.value),
			new TextStyle({
				fill: 0xffd54f,
				fontSize: 32,
				fontWeight: '700',
			})
		)
		this.valueText.anchor.set(0.5)
		this.valueText.position.set(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 - 20)
		this.addChild(this.valueText)

		const minus = new Button({
			label: '-',
			width: 80,
			height: 60,
			onClick: () => {
				this.value = Math.max(minBet, this.value - 10)
				this.valueText.text = String(this.value)
			},
		})
		minus.position.set(GAME_WIDTH * 0.5 - 120, GAME_HEIGHT * 0.5 - 20)
		this.addChild(minus)

		const plus = new Button({
			label: '+',
			width: 80,
			height: 60,
			onClick: () => {
				this.value = Math.min(maxBet, this.value + 10)
				this.valueText.text = String(this.value)
			},
		})
		plus.position.set(GAME_WIDTH * 0.5 + 120, GAME_HEIGHT * 0.5 - 20)
		this.addChild(plus)

		const apply = new Button({
			label: 'OK',
			width: 140,
			height: 60,
			onClick: () => {
				onApply(this.value)
				onClose()
			},
		})
		apply.position.set(GAME_WIDTH * 0.5 - 90, GAME_HEIGHT * 0.5 + 80)
		this.addChild(apply)

		const cancel = new Button({
			label: 'Cancel',
			width: 140,
			height: 60,
			onClick: () => {
				onClose()
			},
		})
		cancel.position.set(GAME_WIDTH * 0.5 + 90, GAME_HEIGHT * 0.5 + 80)
		this.addChild(cancel)
	}
}
