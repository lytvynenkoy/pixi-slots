import { Container } from 'pixi.js'

export abstract class Scene extends Container {
	onShow(): void {}
	onHide(): void {}
	update(delta: number): void {}
}
