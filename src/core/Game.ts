import { Application, Container } from 'pixi.js'
import { SceneManager } from './SceneManager'
import { BACKGROUND_COLOR, DESIGN_WIDTH, DESIGN_HEIGHT } from './Config'
import { BootScene } from '../scenes/BootScene'

export class Game {
	public app: Application
	static instance: Game
	private root: Container

	constructor() {
		Game.instance = this

		this.app = new Application({
			background: BACKGROUND_COLOR,
			resolution: window.devicePixelRatio || 1,
			autoDensity: true,
		})

		document.body.appendChild(this.app.view as HTMLCanvasElement)

		this.root = new Container()
		this.app.stage.addChild(this.root)

		SceneManager.init(this.root)

		this.handleResize()
		window.addEventListener('resize', () => this.handleResize())

		this.app.ticker.add(delta => {
			SceneManager.update(delta)
		})

		SceneManager.changeScene(new BootScene())
	}

	private handleResize(): void {
		const width = window.innerWidth
		const height = window.innerHeight

		this.app.renderer.resize(width, height)

		const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT)

		this.root.scale.set(scale)
		this.root.x = (width - DESIGN_WIDTH * scale) * 0.5
		this.root.y = (height - DESIGN_HEIGHT * scale) * 0.5
	}
}
