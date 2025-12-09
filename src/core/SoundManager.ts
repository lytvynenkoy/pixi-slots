type SoundMap = Record<string, HTMLAudioElement>

export class SoundManager {
	private static sounds: SoundMap = {}
	private static inited = false

	static async init(): Promise<void> {
		if (this.inited) return
		this.inited = true

		this.sounds.spin = new Audio('assets/sfx/spin.mp3')
		this.sounds.win = new Audio('assets/sfx/win.mp3')
	}

	private static playRaw(name: string): void {
		const s = this.sounds[name]
		if (!s) return
		try {
			s.currentTime = 0
			void s.play()
		} catch {
			return
		}
	}

	static play(name: 'spin' | 'win'): void {
		this.playRaw(name)
	}

	static async playSegment(
		name: 'spin' | 'win',
		start: number,
		duration: number
	): Promise<void> {
		const s = this.sounds[name]
		if (!s) return
		try {
			s.currentTime = start
			void s.play()
			const handle = setTimeout(() => {
				try {
					s.pause()
				} catch {
					return
				}
			}, duration * 1000)
			void handle
		} catch {
			return
		}
	}
}
