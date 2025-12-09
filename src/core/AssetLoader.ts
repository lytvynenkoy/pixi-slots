import { Assets, Texture } from 'pixi.js'
import { TextureMap } from './Config'

const manifest: Record<string, string> = {
	sym1: 'assets/symbols/sym1.png',
	sym2: 'assets/symbols/sym2.png',
	sym3: 'assets/symbols/sym3.png',
	sym4: 'assets/symbols/sym4.png',
	sym5: 'assets/symbols/sym5.png',
}

export class AssetLoader {
	private static textures: TextureMap = {}

	static async loadAll(onProgress?: (progress: number) => void): Promise<void> {
		const entries = Object.entries(manifest)
		const total = entries.length
		let loaded = 0

		for (const [key, url] of entries) {
			const tex = await Assets.load<Texture>(url)
			this.textures[key] = tex
			loaded++
			if (onProgress) {
				onProgress(loaded / total)
			}
		}
	}

	static getTexture(name: string): Texture {
		const tex = this.textures[name]
		if (!tex) {
			throw new Error(`Texture ${name} not found`)
		}
		return tex
	}
}
