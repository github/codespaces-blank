import { ensurePeriod } from '../../lib/utils.js'

export const create = (message: string) => new Error(`Alge User Mistake: ${ensurePeriod(message)}`)
