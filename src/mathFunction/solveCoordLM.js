import { evaluate, isBigNumber, number, compare, bignumber, } from 'mathjs';
import { create, all } from 'mathjs';
const config = {
    epsilon: 1e-12,
    matrix: 'Array',
    number: 'BigNumber',
    precision: 64,
    predictable: false,
    randomSeed: null
}
const math = create(all, config);

export default function solveCoordLM(regression, value, setDataLines) {

    // console.log(value)
    // return
    let arrResultsLinearRegression, arrResultsNonlinearRegression;

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    }

    if (isEmpty(regression)) {
        return
    } else {
        arrResultsLinearRegression = regression.arrResultsLinearRegression
        arrResultsNonlinearRegression = regression.arrResultsNonlinearRegression
    }


    const skoNonlinear = arrResultsNonlinearRegression.slice(-1)[0][1]

    let crossPoint1 = regression.maxX;
    let crossPoint2 = 1000;

    const arrCoordStraightLine = []
    const arrCoordStraightLine2S = []
    const arrCoordStraightLine3S = []

    if (value != "Без пересечения") {
        crossPoint1 = +value;
        crossPoint2 = +value;
    }
    let step = 200;
    for (let i = 0; i <= Math.ceil((crossPoint1 - 1000) / step); i++) {
        let x = 1000 + i * step;
        let yx = 0;
        if (x > crossPoint1) x = crossPoint1
        for (let j = 0; j < arrResultsLinearRegression.length - 1; j++) {
            let coefficient = arrResultsLinearRegression[j]
            yx = evaluate('yx + pow(x,j) * coefficient', { yx, x, j, coefficient })
        }
        // console.log(typeof(x))
        if (yx < 0) continue
        arrCoordStraightLine.push([number(x), +yx])
        if (skoNonlinear > 0) {
            arrCoordStraightLine2S.push([number(x), +evaluate('yx - 2 * skoNonlinear', { yx, skoNonlinear })])
            arrCoordStraightLine3S.push([number(x), +evaluate('yx - 3 * skoNonlinear', { yx, skoNonlinear })])
        }
    }
    // console.log(+regression.maxX)
    // return
    const arrCoordCurveLine = []
    const arrCoordCurveLine2S = []
    const arrCoordCurveLine3S = []
    for (let i = crossPoint2; i < regression.maxX; i = i + 200) {
        let yx = 0;
        let ii = bignumber(i)
        for (let j = 0; j < arrResultsNonlinearRegression.length - 1; j++) {
            let coefficient = arrResultsNonlinearRegression[j]
            yx = evaluate('yx + pow(ii,j) * coefficient', { yx, ii, j, coefficient })
        }
        if (yx < 0) continue
        // console.log(yx)
        arrCoordCurveLine.push([i, +yx])
        if (skoNonlinear > 0) {
            arrCoordCurveLine2S.push([i, +evaluate('yx - 2 * skoNonlinear', { yx, skoNonlinear })])
            arrCoordCurveLine3S.push([i, +evaluate('yx - 3 * skoNonlinear', { yx, skoNonlinear })])
        }
    }
    setDataLines({
        arrCoordStraightLine,
        arrCoordCurveLine,
        arrCoordStraightLine2S,
        arrCoordCurveLine2S,
        arrCoordStraightLine3S,
        arrCoordCurveLine3S,
    })
}