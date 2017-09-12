let sinLookUpTable = []

const totalStep = 314
const perStep = (Math.PI * 2) / totalStep
for (let i = 0; i < totalStep; i++) {
	const val = perStep * i
	sinLookUpTable.push(Math.sin(val))
}

export function sinLookUp(step) {
	const index = ~~(step / perStep) % 314
	return sinLookUpTable[index]
}