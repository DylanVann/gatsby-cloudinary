export default (widths: number[], getImage: (width: number) => string) =>
    widths
        .map(w => `${getImage(w)} ${w}w`)
        .concat('100vw')
        .join(', ')
