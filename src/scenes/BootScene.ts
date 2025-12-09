import { Graphics, Text, TextStyle } from 'pixi.js'
import { Scene } from '../core/Scene'
import { AssetLoader } from '../core/AssetLoader'
import { SceneManager } from '../core/SceneManager'
import { SoundManager } from '../core/SoundManager'
import { SlotScene } from './SlotScene'
import { GAME_WIDTH, GAME_HEIGHT } from '../core/Config'

export class BootScene extends Scene {
	private progressBar: Graphics
	private progressText: Text

	constructor() {
		super()

		this.progressBar = new Graphics()
		this.addChild(this.progressBar)

		this.progressText = new Text(
			'Loading 0%',
			new TextStyle({
				fill: 0xffffff,
				fontSize: 18,
			})
		)
		this.progressText.anchor.set(0.5)
		this.addChild(this.progressText)
	}

	onShow(): void {
		const width = 400

		this.progressBar.position.set((GAME_WIDTH - width) * 0.5, GAME_HEIGHT * 0.5)
		this.progressText.position.set(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.5 - 40)

		SoundManager.init()

		this.drawProgress(0)
		void this.loadAssets()
	}

	private async loadAssets(): Promise<void> {
		await AssetLoader.loadAll(progress => {
			this.drawProgress(progress)
			this.progressText.text = `Loading ${Math.round(progress * 100)}%`
		})

		SceneManager.changeScene(new SlotScene())
	}

	private drawProgress(progress: number): void {
		const width = 400
		const height = 20

		this.progressBar.clear()
		this.progressBar.beginFill(0x222634)
		this.progressBar.drawRoundedRect(0, 0, width, height, 10)
		this.progressBar.endFill()

		this.progressBar.beginFill(0x10c7ff)
		this.progressBar.drawRoundedRect(
			2,
			2,
			(width - 4) * progress,
			height - 4,
			8
		)
		this.progressBar.endFill()
	}
}
