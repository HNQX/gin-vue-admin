const size = 200

export default class PulsingDot {
    constructor(prop) {

        const { width = 200, height = 200, map } = prop || {}
        this.width = width
        this.height = height
        this.data = new Uint8Array(this.width * this.height * 4)
        this.map = map
    }

    onAdd() {
        let canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        this.context = canvas.getContext('2d')
    }

    render() {
        let duration = 1000
        let t = (performance.now() % duration) / duration

        let radius = (size / 2) * 0.3
        let outerRadius = (size / 2) * 0.7 * t + radius
        let context = this.context

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height)
        context.beginPath()
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')'
        context.fill()

        // draw inner circle
        context.beginPath()
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2)
        context.fillStyle = 'rgba(255, 100, 100, 1)'
        context.strokeStyle = 'rgba(255, 100, 100, 1)'
        context.lineWidth = 2 + 4 * (1 - t)
        context.fill()
        context.stroke()

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data

        this.map.triggerRepaint()

        return true
    }
}
