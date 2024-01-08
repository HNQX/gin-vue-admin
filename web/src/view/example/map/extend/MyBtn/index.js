/* eslint-disable indent */
import L from 'leaflet'

export default class MyBtn extends L.Control {
    constructor(prop) {
        super(prop)
        this.list = prop
    }

    onAdd(map) {
        const list = this.list
        const cname = 'leaflet-control-btn'
        const container = L.DomUtil.create('div', cname + ' leaflet-bar')

        list &&
            list.length &&
            list.forEach((i) => {
                this._create(i.text, i.title, cname + i.class, container, () => map.fire('btnClick', i))
            })

        return container
    }

    onRemove(map) { }

    _create(html, title, className, container, fn) {
        const link = L.DomUtil.create('a', className, container)
        link.innerHTML = html
        link.title = title

        link.setAttribute('role', 'button')
        link.setAttribute('aria-label', title)

        L.DomEvent.disableClickPropagation(link)
        L.DomEvent.on(link, 'click', L.DomEvent.stop)
        L.DomEvent.on(link, 'click', fn, this)

        return link
    }
}
