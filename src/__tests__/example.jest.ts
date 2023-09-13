import { expect, describe, it } from '@jest/globals'

describe('example', () => {
    it('Addition', () => {
        const addition = (num1, num2) => {
            return num1 + num2
        }
        expect(addition(1, 3)).toBe(4)
    })
})
