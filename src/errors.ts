export const errors = {
    EventSourceError: class extends Error {
        constructor(message?: string, name?: string) {
            super(message)
            this.name = name || 'EventSourceError'
        }
    },
    ValidationError: class extends Error {
        constructor(message?: string, name?: string) {
            super(message)
            this.name = name || 'ValidationError'
        }
    }
}