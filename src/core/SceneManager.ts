import { Container } from 'pixi.js'
import { Scene } from './Scene'

export class SceneManager {
	private static root: Container
	private static current: Scene | null = null

	static init(root: Container): void {
		this.root = root
	}

	static changeScene(scene: Scene): void {
		if (this.current) {
			this.current.onHide()
			this.root.removeChild(this.current)
		}

		this.current = scene
		this.root.addChild(scene)
		scene.onShow()
	}

	static update(delta: number): void {
		if (this.current) {
			this.current.update(delta)
		}
	}
}
