import { Container, Graphics, Text, TextStyle } from 'pixi.js'

interface ButtonOptions {
	label: string
	width: number
	height: number
	onClick: () => void
}

export class Button extends Container {
	private bg: Graphics
	private label: Text
	private handler: () => void
	private disabled = false

	constructor(options: ButtonOptions) {
		super()

		this.handler = options.onClick

		this.bg = new Graphics()
		this.addChild(this.bg)

		this.label = new Text(
			options.label,
			new TextStyle({
				fill: 0xffffff,
				fontSize: 24,
				fontWeight: '700',
			})
		)
		this.label.anchor.set(0.5)
		this.addChild(this.label)

		this.draw(options.width, options.height)

		this.eventMode = 'static'
		this.cursor = 'pointer'

		this.on('pointerdown', () => {
			if (!this.disabled) {
				this.handler()
			}
		})

		this.on('pointerover', () => {
			if (!this.disabled) {
				this.alpha = 1
				this.scale.set(1.03)
			}
		})

		this.on('pointerout', () => {
			this.scale.set(1)
		})
	}

	private draw(width: number, height: number): void {
		this.bg.clear()
		this.bg.beginFill(0x5b35c9)
		this.bg.drawRoundedRect(-width * 0.5, -height * 0.5, width, height, 18)
		this.bg.endFill()
		this.label.position.set(0, 0)
	}

	setDisabled(disabled: boolean): void {
		this.disabled = disabled
		this.alpha = disabled ? 0.6 : 1
		this.cursor = disabled ? 'default' : 'pointer'
		this.eventMode = disabled ? 'none' : 'static'
	}
}
