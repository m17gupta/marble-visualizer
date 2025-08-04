export const getMinMaxBBPoint = (segmentationInt: number[]): [number, number, number, number] => {
    if (!segmentationInt || segmentationInt.length < 2 || segmentationInt.length % 2 !== 0) {
        throw new Error("Invalid segmentationInt array");
    }
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i < segmentationInt.length; i += 2) {
        xs.push(segmentationInt[i]);
        ys.push(segmentationInt[i + 1]);
    }
    const xmin = Math.min(...xs);
    const xmax = Math.max(...xs);
    const ymin = Math.min(...ys);
    const ymax = Math.max(...ys);
    return [xmin, ymin, xmax, ymax];
};