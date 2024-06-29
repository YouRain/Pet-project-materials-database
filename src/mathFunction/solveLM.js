// import * as math from 'mathjs'
import { acos, abs, evaluate, sqrt, bignumber, log10, pow, compare, subtract, divide, log, e, sign } from 'mathjs';
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
// math.config({number: 'BigNumber', precision: 64,})
let a = 1
let b = bignumber(a)
// let a = 1
// let b = 3
// let c = math.divide(1,3)
// let d = math.evaluate('1/3')
// const code1 = compile('bignumber(1)/bignumber(3)')
// const res1 = code1.evaluate()
// console.log((b).toFixed(64))// console.log(res1.toFixed(64))
// console.log((a/b).toFixed(64))
// console.log((d).toFixed(64))

export default function solveLM(dataPoints, setData, settings) {

    // console.log(e)
    let Pi = bignumber(3.1415926535897932384626433832795028841971693993751058209749445923)
    let e = bignumber(2.7182818284590452353602874713526624977572470936999595749669676277)

    let [notationTemperature, notationStrength, constantLM, degreeOfThePolynomial] = settings

    constantLM = bignumber(constantLM)

    let listShortParametrLM = []
    let listShortLogarithmStrength = []
    let listLongParametrLM = []
    let listLongLogarithmStrength = []
    let updatedData = [...dataPoints]
    let minY = bignumber(10e100);
    let maxY = 0;
    let minX = bignumber(10e100);
    let maxX = 0;

    function calcParametrLM(index) {
        const temperature = bignumber(dataPoints[index].temperature)
        const logTime = log10(bignumber(dataPoints[index].time))
        let parametrLM;
        if (notationTemperature == "celsius") {
            parametrLM = evaluate('(temperature + bignumber(273.15)) * (constantLM + logTime)', { constantLM, temperature, logTime })
        } else {
            parametrLM = evaluate('(temperature) * (constantLM + logTime)', { constantLM, temperature, logTime })
        }
        // console.log(+parametrLM) // Здесь всё заебись, сходится с Эксель
        if (+compare(minX, parametrLM) == 1) minX = parametrLM;
        if (+compare(parametrLM, maxX) == 1) maxX = parametrLM;
        updatedData[index].parametrLM = parametrLM.toFixed(1);
        return parametrLM;
    }

    function calcLogarithmStrength(index) {
        let logarithmStrength;
        if (notationStrength == "mpa") {
            logarithmStrength = log10(bignumber(dataPoints[index].strength))
        } else if (notationStrength == "pa") {
            logarithmStrength = log10(bignumber(dataPoints[index].strength / 1000000))
        } else {
            logarithmStrength = log10(bignumber(dataPoints[index].strength * 9.806650))
        }
        // console.log(+logarithmStrength) // Здесь всё заебись, сходится с Эксель
        if (+compare(minY, logarithmStrength) == 1) minY = logarithmStrength;
        if (+compare(logarithmStrength, maxY) == 1) maxY = logarithmStrength;
        updatedData[index].logStrength = logarithmStrength.toFixed(4)
        return logarithmStrength;
    }

    for (let i = 0; i < dataPoints.length; i++) {
        if (dataPoints[i].straight) {
            listShortParametrLM.push(calcParametrLM(i))
            listShortLogarithmStrength.push(calcLogarithmStrength(i))
        }
        if (dataPoints[i].curve) {
            listLongParametrLM.push(calcParametrLM(i))
            listLongLogarithmStrength.push(calcLogarithmStrength(i))
        }
    }

    setData(updatedData)
    // console.log(maxX)
    function linearRegression(arrX, arrY) {
        let summX = 0, summY = 0, summXY = 0, summX2 = 0;
        for (let i = 0; i < arrX.length; i++) {
            const x = arrX[i]
            const y = arrY[i]
            const xy = evaluate('x * y', { x, y })
            const x2 = pow(x, 2)

            summX = evaluate('summX + x', { summX, x })
            summY = evaluate('summY + y', { summY, y })
            summXY = evaluate('summXY + xy', { summXY, xy })
            summX2 = evaluate('summX2 + x2', { summX2, x2 })
        }
        // Заполняем исходную матрицу А
        let matrixA = [[arrX.length, summX], [summX, summX2]]
        // Заполняем вектор результатов B
        let matrixB = [summY, summXY]
        let listCoefficients = methodKramera(matrixA, matrixB)
        listCoefficients.push(findCoefficientOfDetermination(arrX, arrY, summY, listCoefficients))
        return listCoefficients
    }
    function QuadraticRegression(arrX, arrY) {
        let summX = 0, summY = 0, summXY = 0, summX2 = 0, summX2Y = 0, summX3 = 0, summX4 = 0;
        for (let i = 0; i < arrX.length; i++) {
            const x = arrX[i]
            const y = arrY[i]
            const xy = evaluate('x * y', { x, y })
            const x2 = pow(x, 2)
            const x2y = evaluate('x2 * y', { x2, y })
            const x3 = pow(x, 3)
            const x4 = pow(x, 4)

            summX = evaluate('summX + x', { summX, x })
            summY = evaluate('summY + y', { summY, y })
            summXY = evaluate('summXY + xy', { summXY, xy })
            summX2 = evaluate('summX2 + x2', { summX2, x2 })
            summX2Y = evaluate('summX2Y + x2y', { summX2Y, x2y })
            summX3 = evaluate('summX3 + x3', { summX3, x3 })
            summX4 = evaluate('summX4 + x4', { summX4, x4 })
        }
        // Заполняем исходную матрицу А
        let matrixA = [[arrX.length, summX, summX2], [summX, summX2, summX3], [summX2, summX3, summX4]]
        // Заполняем вектор результатов B
        let matrixB = [summY, summXY, summX2Y]
        let listCoefficients = methodKramera(matrixA, matrixB)
        listCoefficients.push(findCoefficientOfDetermination(arrX, arrY, summY, listCoefficients))
        return listCoefficients
    }
    function CubicRegression(arrX, arrY) {
        let summX = 0, summY = 0, summXY = 0, summX2 = 0, summX2Y = 0, summX3 = 0, summX3Y = 0, summX4 = 0, summX5 = 0, summX6 = 0;
        for (let i = 0; i < arrX.length; i++) {
            const x = arrX[i]
            const y = arrY[i]
            const xy = evaluate('x * y', { x, y })
            const x2 = pow(x, 2)
            const x2y = evaluate('x2 * y', { x2, y })
            const x3 = pow(x, 3)
            const x3y = evaluate('x3 * y', { x3, y })
            const x4 = pow(x, 4)
            const x5 = pow(x, 5)
            const x6 = pow(x, 6)

            summX = evaluate('summX + x', { summX, x })
            summY = evaluate('summY + y', { summY, y })
            summXY = evaluate('summXY + xy', { summXY, xy })
            summX2 = evaluate('summX2 + x2', { summX2, x2 })
            summX2Y = evaluate('summX2Y + x2y', { summX2Y, x2y })
            summX3 = evaluate('summX3 + x3', { summX3, x3 })
            summX3Y = evaluate('summX3Y + x3y', { summX3Y, x3y })
            summX4 = evaluate('summX4 + x4', { summX4, x4 })
            summX5 = evaluate('summX5 + x5', { summX5, x5 })
            summX6 = evaluate('summX6 + x6', { summX6, x6 })
        }
        // Заполняем исходную матрицу А
        let matrixA = [[arrX.length, summX, summX2, summX3],
        [summX, summX2, summX3, summX4],
        [summX2, summX3, summX4, summX5],
        [summX3, summX4, summX5, summX6]
        ]
        // Заполняем вектор результатов B
        let matrixB = [summY, summXY, summX2Y, summX3Y]
        let listCoefficients = methodKramera(matrixA, matrixB)
        listCoefficients.push(findCoefficientOfDetermination(arrX, arrY, summY, listCoefficients))
        return listCoefficients
    }
    function QuarticRegression(arrX, arrY) {
        let summX = 0, summY = 0, summXY = 0, summX2 = 0, summX2Y = 0, summX3 = 0, summX3Y = 0, summX4 = 0, summX4Y = 0, summX5 = 0, summX6 = 0, summX7 = 0, summX8 = 0;
        for (let i = 0; i < arrX.length; i++) {
            const x = arrX[i]
            const y = arrY[i]
            const xy = evaluate('x * y', { x, y })
            const x2 = pow(x, 2)
            const x2y = evaluate('x2 * y', { x2, y })
            const x3 = pow(x, 3)
            const x3y = evaluate('x3 * y', { x3, y })
            const x4 = pow(x, 4)
            const x4y = evaluate('x4 * y', { x4, y })
            const x5 = pow(x, 5)
            const x6 = pow(x, 6)
            const x7 = pow(x, 7)
            const x8 = pow(x, 8)

            summX = evaluate('summX + x', { summX, x })
            summY = evaluate('summY + y', { summY, y })
            summXY = evaluate('summXY + xy', { summXY, xy })
            summX2 = evaluate('summX2 + x2', { summX2, x2 })
            summX2Y = evaluate('summX2Y + x2y', { summX2Y, x2y })
            summX3 = evaluate('summX3 + x3', { summX3, x3 })
            summX3Y = evaluate('summX3Y + x3y', { summX3Y, x3y })
            summX4 = evaluate('summX4 + x4', { summX4, x4 })
            summX4Y = evaluate('summX4Y + x4y', { summX4Y, x4y })
            summX5 = evaluate('summX5 + x5', { summX5, x5 })
            summX6 = evaluate('summX6 + x6', { summX6, x6 })
            summX7 = evaluate('summX7 + x7', { summX7, x7 })
            summX8 = evaluate('summX8 + x8', { summX8, x8 })
        }
        // Заполняем исходную матрицу А
        let matrixA = [[arrX.length, summX, summX2, summX3, summX4],
        [summX, summX2, summX3, summX4, summX5],
        [summX2, summX3, summX4, summX5, summX6],
        [summX3, summX4, summX5, summX6, summX7],
        [summX4, summX5, summX6, summX7, summX8]
        ]
        // Заполняем вектор результатов B
        let matrixB = [summY, summXY, summX2Y, summX3Y, summX4Y]
        let listCoefficients = methodKramera(matrixA, matrixB)
        listCoefficients.push(findCoefficientOfDetermination(arrX, arrY, summY, listCoefficients))
        return listCoefficients
    }
    function findCoefficientOfDetermination(arrX, arrY, summY, listCoefficients) {
        const n = arrX.length
        const averY = evaluate('summY / n', { summY, n })
        let summYx_averY_2 = 0, summY_averY_2 = 0, summYx_Y_2 = 0;
        for (let i = 0; i < n; i++) {
            let x = arrX[i]
            let y = arrY[i]
            let Yx = 0
            for (let j = 0; j < listCoefficients.length; j++) {
                const value = listCoefficients[j]
                Yx = evaluate('Yx + pow(x, j) * value', { Yx, x, j, value })
            }
            const Yx_averY_2 = pow(evaluate('Yx - averY', { Yx, averY }), 2)
            const Y_averY_2 = pow(evaluate('y - averY', { y, averY }), 2)
            const Yx_Y_2 = pow(evaluate('Yx - y', { Yx, y }), 2)

            summYx_averY_2 = evaluate('summYx_averY_2 + Yx_averY_2', { summYx_averY_2, Yx_averY_2 })
            summY_averY_2 = evaluate('summY_averY_2 + Y_averY_2', { summY_averY_2, Y_averY_2 })
            summYx_Y_2 = evaluate('summYx_Y_2 + Yx_Y_2', { summYx_Y_2, Yx_Y_2 })
        }
        let coefficientOfDetermination = evaluate('(summYx_averY_2 / summY_averY_2) * 100', { summYx_averY_2, summY_averY_2 })
        // Дисперсия и СКО выборки (не генеральной совокупности) с поправкой Бесселя (n-1), чтобы смещенную оценку сделать несмещенной
        let dispersion = evaluate('summYx_Y_2 / (n - 1)', { summYx_Y_2, n })
        let sko = sqrt(dispersion)
        console.log(+sko)
        return [coefficientOfDetermination, sko]
    }
    function methodKramera(matrixA, matrixB) {
        function findDeterminantMatrix2x2(matrix) {//Находит определитель матрицы 2 на 2
            const a00 = matrix[0][0]
            const a01 = matrix[0][1]
            const a10 = matrix[1][0]
            const a11 = matrix[1][1]
            return evaluate('a00 * a11 - a10 * a01', { a00, a01, a10, a11 })
        }
        function findDeterminantMatrix3x3(matrix) {//Находит определитель матрицы, методом Лапласа. Разложение по первой строке
            if (matrix.length === 2) {//Если матрица 2 на 2
                return findDeterminantMatrix2x2(matrix)
            }
            let summ = 0
            for (let i = 0; i < matrix.length; i++) {//Если матрица 3 на 3 и более
                let minarMatrix = []
                for (let j = 1; j < matrix.length; j++) {
                    const tempArr = matrix[j].slice(0)
                    tempArr.splice(i, 1)
                    minarMatrix.push(tempArr)
                }
                let determinant = findDeterminantMatrix3x3(minarMatrix)
                const a0i = matrix[0][i]
                const znak = pow(-1, i)
                summ = evaluate('summ + a0i * znak * determinant', { summ, a0i, znak, determinant })
            }
            return summ
        }
        //Вычисляем главный определитель матрицы А
        let listCoefficients = []
        let openA = findDeterminantMatrix3x3(matrixA) //Вычисляем главный определитель матрицы А
        for (let i = 0; i < matrixA.length; i++) {
            let matrixAi = matrixA.slice(0) //Правильно копируем массив
            matrixAi.splice(i, 1, matrixB) //Заменяем первый столбец матрицы А на вектор В
            let openAi = findDeterminantMatrix3x3(matrixAi) //Вычисляем определитель матрицы Аi
            listCoefficients.push(evaluate('openAi / openA', { openA, openAi }))
        }
        return listCoefficients
    }
    let arrResultsLinearRegression = linearRegression(listShortParametrLM, listShortLogarithmStrength)
    let arrResultsNonlinearRegression
    if (degreeOfThePolynomial == 2) {
        arrResultsNonlinearRegression = QuadraticRegression(listLongParametrLM, listLongLogarithmStrength)
    } else if (degreeOfThePolynomial == 3) {
        arrResultsNonlinearRegression = CubicRegression(listLongParametrLM, listLongLogarithmStrength)
    } else if (degreeOfThePolynomial == 4) {
        arrResultsNonlinearRegression = QuarticRegression(listLongParametrLM, listLongLogarithmStrength)
    }
    // console.log(arrResultsNonlinearRegression)
    function cardanosFormula(a, b, c) {
        let listRoot = ["Без пересечения"];

        let Q = evaluate('(pow(a, 2) - 3*b) / 9', { a, b })
        let R = evaluate('(2 * pow(a, 3) - 9 * a * b + 27 * c) / 54', { a, b, c })
        let S = evaluate('pow(Q, 3) - pow(R, 2)', { Q, R })
        // console.log(+Q)
        // console.log(+S)
        if (S > 0) {//Уравнение Виетта
            let cosFi = evaluate('R / sqrt(pow(Q, 3))', { R, Q })
            let Fi = acos(cosFi)
            listRoot.push(evaluate('-2 * sqrt(Q) * cos(Fi / 3) - a / 3', { Q, Fi, a }))
            listRoot.push(evaluate('-2 * sqrt(Q) * cos(Fi / 3 - 2 * Pi / 3) - a / 3', { Q, Fi, a, Pi }))
            listRoot.push(evaluate('-2 * sqrt(Q) * cos(Fi / 3 + 2 * Pi / 3) - a / 3', { Q, Fi, a, Pi }))
        } else if (S < 0) {
            let cosFi = bignumber(1)
            let Fi = acos(cosFi)
            listRoot.push(evaluate('-2 * sqrt(Q) * cos(Fi / 3) - a / 3', { Q, Fi, a }))
            listRoot.push(evaluate('-2 * sqrt(Q) * cos(Fi / 3 - 2 * Pi / 3) - a / 3', { Q, Fi, a, Pi }))
            listRoot.push(evaluate('-2 * sqrt(Q) * cos(Fi / 3 + 2 * Pi / 3) - a / 3', { Q, Fi, a, Pi }))
            // let signR = sign(R)
            // R = abs(R)
            // let X = evaluate('R / sqrt(pow(Q, 3))', { R, Q })
            // if (Q > 0) {
            //     let K = evaluate('X + sqrt(pow(X, 2) - 1)', { X })
            //     let archK = log(K)
            //     let Fi = evaluate('archK / 3', { archK, Q })
            //     let chFi = evaluate('(pow(e, Fi) + pow(e, -Fi) / 2)', { e, Fi })
            //     listRoot.push(evaluate('-2 * signR * sqrt(Q) * chFi - a / 3', { signR, Q, chFi, a }))
            // } else if (Q < 0) {
            //     let K = evaluate('X + sqrt(pow(X, 2) + 1)', { X })
            //     let arshK = log(K)
            //     let Fi = evaluate('arshK / 3', { arshK, Q })
            //     let shFi = evaluate('(pow(e, Fi) - pow(e, -Fi) / 2)', { e, Fi })
            //     listRoot.push(evaluate('-2 * signR * sqrt(Q) * shFi - a / 3', { signR, Q, shFi, a }))
            // } else if (Q == 0) {
            //     listRoot.push(evaluate('-pow(c - pow(a, 3) / 27, 1 / 3) - a / 3', { c, a }))
            // }
        } else if (S == 0) {
            listRoot.push(evaluate('-2 * pow(R, 1/ 3) - a / 3', { R, a }))
            listRoot.push(evaluate('pow(R, 1/ 3) - a / 3', { R, a }))
        }
        return listRoot;
    }
    function ferrariersFormula(arrResultsLinearRegression, arrResultsNonlinearRegression) {
        let listRoot = ["Без пересечения"];

        let b4 = arrResultsNonlinearRegression[4]
        let b3 = arrResultsNonlinearRegression[3]
        let b2 = arrResultsNonlinearRegression[2]
        let newb1 = subtract(arrResultsNonlinearRegression[1], arrResultsLinearRegression[1])
        let newb0 = subtract(arrResultsNonlinearRegression[0], arrResultsLinearRegression[0])

        let a = divide(b3, b4)
        let b = divide(b2, b4)
        let c = divide(newb1, b4)
        let d = divide(newb0, b4)

        let p = evaluate('b - 3 * pow(a, 2) / 8', { a, b })
        let q = evaluate('pow(a, 3) / 8 - a * b / 2 + c', { a, b, c })
        let r = evaluate('-3 * pow(a, 4) / 256 + pow(a, 2) * b / 16 - a * c / 4 + d', { a, b, c, d })

        let newA = evaluate('- p / 2', { p })
        let newB = evaluate('- r', { r })
        let newC = evaluate('(p * r - pow(q, 2) / 4) / 2', { p, q, r })

        let listCoeff = cardanosFormula(newA, newB, newC)

        if (listCoeff.length > 1) {
            let rootX = listCoeff.slice(-1)[0]
            let sqrt1 = evaluate('-sqrt(2 * rootX - p)', { rootX, p })
            let sqrt2 = evaluate('+sqrt(2 * rootX - p)', { rootX, p })
            let D1 = evaluate('pow(sqrt1, 2) - 4 * (q / 2 / (-sqrt1) + rootX)', { sqrt1, q, rootX })
            let D2 = evaluate('pow(sqrt2, 2) - 4 * (q / 2 / (-sqrt2) + rootX)', { sqrt2, q, rootX })
            let z1 = evaluate('(-sqrt1 + sqrt(D1)) / 2', { sqrt1, D1 })
            let z2 = evaluate('(-sqrt1 - sqrt(D1)) / 2', { sqrt1, D1 })
            let z3 = evaluate('(-sqrt2 + sqrt(D2)) / 2', { sqrt2, D2 })
            let z4 = evaluate('(-sqrt2 - sqrt(D2)) / 2', { sqrt2, D2 })

            listRoot.push(evaluate('z1 - a / 4', { z1, a }))
            listRoot.push(evaluate('z2 - a / 4', { z2, a }))
            listRoot.push(evaluate('z3 - a / 4', { z3, a }))
            listRoot.push(evaluate('z4 - a / 4', { z4, a }))
        } else {
            return listCoeff;
        }
        return listRoot;
    }
    function newCoefficients(arrResultsLinearRegression, arrResultsNonlinearRegression) {
        let listCoeff = [];
        arrResultsNonlinearRegression.forEach((item, index) => {
            if (index == 0) {
                listCoeff.push(subtract(item, arrResultsLinearRegression[index]))
            } else if (index == 1) {
                listCoeff.push(subtract(item, arrResultsLinearRegression[index]))
            } else {
                listCoeff.push(item)
            }
        })
        return listCoeff;
    }
    function root(arrResultsLinearRegression, arrResultsNonlinearRegression) {
        let listRoots = [];
        // let listRoot = ["Без пересечения"];
        if (arrResultsNonlinearRegression.length === 4) {
            let [newb0, newb1, b2] = newCoefficients(arrResultsLinearRegression, arrResultsNonlinearRegression)
            let discriminant = evaluate('pow(newb1, 2) - 4 * b2 * newb0', { newb1, b2, newb0 })
            if (discriminant > 0) {
                listRoots.push(evaluate('(-newb1 + sqrt(discriminant)) / (2 * b2)', { newb1, discriminant, b2 }))
                listRoots.push(evaluate('(-newb1 - sqrt(discriminant)) / (2 * b2)', { newb1, discriminant, b2 }))
            } else if (discriminant === 0) {
                listRoots.push(evaluate('-newb1 / (2 * b2)', { newb1, b2 }))
            }
            // console.log(isBigNumber(discriminant))
        } else if (arrResultsNonlinearRegression.length === 5) {//Формула Кардано
            let [newb0, newb1, b2, b3] = newCoefficients(arrResultsLinearRegression, arrResultsNonlinearRegression)

            let a = divide(b2, b3)
            let b = divide(newb1, b3)
            let c = divide(newb0, b3)

            listRoots = cardanosFormula(a, b, c)

            // let p = evaluate('newb1 / b3 - pow(b2, 2) / (3 * pow(b3, 2))', { newb1, b3, b2 })
            // let q = evaluate('2 * pow(b2, 3) / (27 * pow(b3, 3)) - b2 * newb1 / (3 * pow(b3, 2)) + newb0 / b3', { newb1, b3, b2, newb0 })
            // let Q = evaluate('pow(p, 3) / 27 + pow(q, 2) / 4', { p, q }) //Дискриминант кубического уравнения
            // if (Q < 0) {//Уравнение Виетта
            //     let cosFi = evaluate('-q / 2 * pow(-3 / p, 1.5)', { p, q })
            //     let Fi = acos(cosFi)

            //     let Pi = bignumber(3.1415926535897932384626433832795028841971693993751058209749445923)

            //     listRoots.push(evaluate('2 * sqrt(-p / 3) * cos(Fi / 3)', { p, Fi }))
            //     listRoots.push(evaluate('2 * sqrt(-p / 3) * cos(Fi / 3 + 2 * Pi / 3)', { p, Fi, Pi }))
            //     listRoots.push(evaluate('2 * sqrt(-p / 3) * cos(Fi / 3 - 2 * Pi / 3)', { p, Fi, Pi }))
            //     // console.log(Pi.toFixed(64))
            // }
        } else if (arrResultsNonlinearRegression.length === 6) {//Формула Феррари
            listRoots = ferrariersFormula(arrResultsLinearRegression, arrResultsNonlinearRegression)
        }
        listRoots.sort((a, b) => a - b);
        let modifyListRoots = listRoots.filter((item) => {
            return +item >= +minX && +item <= +maxX
        });
        modifyListRoots.unshift("Без пересечения");
        return modifyListRoots;
    }
    let arrRoot = root(arrResultsLinearRegression, arrResultsNonlinearRegression)
    return {
        arrResultsLinearRegression,
        arrResultsNonlinearRegression,
        arrRoot,
        minY,
        maxY,
        minX,
        maxX,
    }
}

