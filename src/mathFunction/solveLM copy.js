import { add, compile, evaluate, divide, bignumber } from 'mathjs'
// const { create, all } = require('..')
// const config = {
//     // Default type of number
//     // Available options: 'number' (default), 'BigNumber', or 'Fraction'
//     number: 'BigNumber',
  
//     // Number of significant digits for BigNumbers
//     precision: 20
//   }
//   const math = create(all, config)
//   math.bignumber('2.3e+500')
let a = bignumber(1)
let b = bignumber(3)
let c = divide(a,b)
let d = evaluate('a/b', {a, b})
const code1 = compile('a/b')
const res1 = code1.evaluate({a, b})
console.log((c).toFixed(70))
console.log(res1.toFixed(70))
console.log((a/b).toFixed(50))
export default function solveLM() {

    const constantLM = 20

    let listCheckedShortTerms = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let arrTemp = [20, 300, 350, 400, 450, 500, 550, 600, 650, 700, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 900, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100]
    let arrTime = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 500, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000]
    let arrStrength = [914.2885, 913.1086, 912.4027, 911.3126, 909.6307, 907.0401, 903.0602, 896.9696, 887.7047, 873.7387, 893.3486, 880.0183, 858.7725, 825.7215, 776.1937, 705.9863, 613.9209, 504.7828, 389.8726, 283.0454, 194.6283, 128.2215, 81.8946, 308.792, 884.6582, 865.0605, 833.7273, 785.4619, 715.2189, 621.0031, 507.5715, 387.4949, 276.5172, 186.0977, 119.6967, 74.5625, 45.4732, 876.6187, 851.1578, 810.5711, 748.9992, 662.2718, 552.0682, 429.0002, 309.902, 209.5911, 134.5237, 83.1699, 50.1593, 29.7814]
    let listCheckedLongTerms = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    let listShortParametrLM = []
    let listShortLogarithmStrength = []
    let listLongParametrLM = []
    let listLongLogarithmStrength = []

    for (let i = 0; i < arrTemp.length; i++) {
        const parametrLM = (arrTemp[i] + 273.15) * (constantLM + Math.log10(arrTime[i]))
        const logarithmStrength = Math.log10(arrStrength[i])
        if (listCheckedShortTerms[i]) {
            listShortParametrLM.push(parametrLM)
            listShortLogarithmStrength.push(logarithmStrength)
        }
        if (listCheckedLongTerms[i]) {
            listLongParametrLM.push(parametrLM)
            listLongLogarithmStrength.push(logarithmStrength)
        }
    }

    function linearRegression(arrX, arrY) {
        let summX = 0
        let summY = 0
        let summXY = 0
        let summX2 = 0
        for (let i = 0; i < arrX.length; i++) {
            let x = arrX[i]
            let y = arrY[i]

            let xy = x * y

            let x2 = Math.pow(x, 2)

            summX = summX + x
            summY = summY + y
            summXY = summXY + xy
            summX2 = summX2 + x2
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
        let summX = 0
        let summY = 0
        let summXY = 0
        let summX2 = 0
        let summX2Y = 0
        let summX3 = 0
        let summX4 = 0
        for (let i = 0; i < arrX.length; i++) {
            let x = arrX[i]
            let y = arrY[i]

            let xy = x * y

            let x2 = Math.pow(x, 2)
            let x2y = x2 * y
            let x3 = Math.pow(x, 3)
            let x4 = Math.pow(x, 4)

            summX = summX + x
            summY = summY + y
            summXY = summXY + xy
            summX2 = summX2 + x2
            summX2Y = summX2Y + x2y
            summX3 = summX3 + x3
            summX4 = summX4 + x4
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
        let summX = 0
        let summY = 0
        let summXY = 0
        let summX2 = 0
        let summX2Y = 0
        let summX3 = 0
        let summX3Y = 0
        let summX4 = 0
        let summX5 = 0
        let summX6 = 0
        for (let i = 0; i < arrX.length; i++) {
            let x = arrX[i]
            let y = arrY[i]

            let xy = x * y

            let x2 = Math.pow(x, 2)
            let x2y = x2 * y
            let x3 = Math.pow(x, 3)
            let x3y = x3 * y
            let x4 = Math.pow(x, 4)
            let x5 = Math.pow(x, 5)
            let x6 = Math.pow(x, 6)

            summX = summX + x
            summY = summY + y
            summXY = summXY + xy
            summX2 = summX2 + x2
            summX2Y = summX2Y + x2y
            summX3 = summX3 + x3
            summX3Y = summX3Y + x3y
            summX4 = summX4 + x4
            summX5 = summX5 + x5
            summX6 = summX6 + x6
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
    function findCoefficientOfDetermination(arrX, arrY, summY, listCoefficients) {
        let averY = summY / arrX.length
        let summYx_averY_2 = 0
        let summY_averY_2 = 0
        let summYx_Y_2 = 0
        for (let i = 0; i < arrX.length; i++) {
            let x = arrX[i]
            let y = arrY[i]
            let Yx = 0
            for (let j = 0; j < listCoefficients.length; j++) {
                Yx = Yx + Math.pow(x, j) * listCoefficients[j]
            }
            let Yx_averY_2 = Math.pow(Yx - averY, 2)
            let Y_averY_2 = Math.pow(y - averY, 2)

            let Yx_Y_2 = Math.pow(Yx - y, 2)

            summYx_averY_2 = summYx_averY_2 + Yx_averY_2
            summY_averY_2 = summY_averY_2 + Y_averY_2
            summYx_Y_2 = summYx_Y_2 + Yx_Y_2
        }
        let coefficientOfDetermination = (summYx_averY_2 / summY_averY_2) * 100
        let dispersion = summYx_Y_2 / (arrX.length - 1)
        let sko = Math.sqrt(dispersion)
        return [coefficientOfDetermination, sko]
    }
    function methodKramera(matrixA, matrixB) {
        function findDeterminantMatrix2x2(matrix) {//Находит определитель матрицы 2 на 2
            return matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]
        }
        function findDeterminantMatrix3x3(matrix) {//Находит определитель матрицы, методом Лапласа. Разложение по первой строке
            if (matrix.length === 2) {//Если матрица 2 на 2
                return findDeterminantMatrix2x2(matrix)
            }
            let summ = 0
            for (let i = 0; i < matrix.length; i++) {//Если матрица 3 на 3 и более
                let minarMatrix = []
                for (let j = 1; j < matrix.length; j++) {
                    let tempArr = matrix[j].slice(0)
                    tempArr.splice(i, 1)
                    minarMatrix.push(tempArr)
                }
                let determinant = findDeterminantMatrix3x3(minarMatrix)
                summ = summ + matrix[0][i] * Math.pow(-1, i) * determinant
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
            listCoefficients.push(openAi / openA)
        }
        return listCoefficients
    }
    let arrResultsLinearRegression = linearRegression(listShortParametrLM, listShortLogarithmStrength)
    console.log(arrResultsLinearRegression)
    let arrResultsNonlinearRegression = QuadraticRegression(listLongParametrLM, listLongLogarithmStrength)
    console.log(arrResultsNonlinearRegression)
    let arrResultsNonlinearRegression2 = CubicRegression(listLongParametrLM, listLongLogarithmStrength)
    console.log(arrResultsNonlinearRegression2)

    function root(listResultsLinearRegression, listResultsNonlinearRegression) {
        let listRoot = []
        if (listResultsNonlinearRegression.length === 4) {
            let b2 = listResultsNonlinearRegression[2]
            let newb1 = listResultsNonlinearRegression[1] - listResultsLinearRegression[1]
            let newb0 = listResultsNonlinearRegression[0] - listResultsLinearRegression[0]
            let discriminant = Math.pow(newb1, 2) - 4 * b2 * newb0
            if (discriminant > 0) {
                listRoot.push((-newb1 + Math.sqrt(discriminant)) / (2 * b2))
                listRoot.push((-newb1 - Math.sqrt(discriminant)) / (2 * b2))
            } else if (discriminant === 0) {
                listRoot.push(-newb1 / (2 * b2))
            }
        } else if (listResultsNonlinearRegression.length === 5) {//Формула Кардано
            let b3 = listResultsNonlinearRegression[3]
            let b2 = listResultsNonlinearRegression[2]
            let newb1 = listResultsNonlinearRegression[1] - listResultsLinearRegression[1]
            let newb0 = listResultsNonlinearRegression[0] - listResultsLinearRegression[0]

            let p = newb1 / b3 - Math.pow(b2, 2) / (3 * Math.pow(b3, 2))
            let q = 2 * Math.pow(b2, 3) / (27 * Math.pow(b3, 3)) - b2 * newb1 / (3 * Math.pow(b3, 2)) + newb0 / b3
            let Q = Math.pow(p, 3) / 27 + Math.pow(q, 2) / 4 //Дискриминант кубического уравнения
            if (Q < 0) {//Уравнение Виетта
                let cosFi = -q / 2 * (Math.pow(-3 / p, 1.5))
                let Fi = Math.acos(cosFi)

                // let Pi = 3.1415926535897932384626433832795

                listRoot.push(2 * Math.sqrt(-p / 3) * Math.cos(Fi / 3))
                listRoot.push(2 * Math.sqrt(-p / 3) * Math.cos(Fi / 3 + 2 * Math.PI / 3))
                listRoot.push(2 * Math.sqrt(-p / 3) * Math.cos(Fi / 3 - 2 * Math.PI / 3))
            }
        }
        return listRoot
    }
    console.log(root(arrResultsLinearRegression, arrResultsNonlinearRegression2))
    // console.log(Math.bignumber(0.1))
}