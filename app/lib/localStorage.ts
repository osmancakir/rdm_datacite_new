const FORM_KEY = 'dataciteFormDraft'

type FormDataDraft = {
	mandatory?: any
	recommended?: any
	other?: any
}

export function loadFormDraft(): FormDataDraft {
	if (typeof window === 'undefined') return {}
	try {
		const raw = localStorage.getItem(FORM_KEY)
		return raw ? JSON.parse(raw) : {}
	} catch {
		return {}
	}
}

export function saveFormStep(step: keyof FormDataDraft, data: any) {
	try {
		const current = loadFormDraft()
		current[step] = data
		localStorage.setItem(FORM_KEY, JSON.stringify(current))
	} catch (e) {
		console.error('Failed to save form draft:', e)
	}
}
