import React, { Fragment, useRef, useState } from "react";
import "./LarsonMiller.css";
import Table from "./Table";
import solveLM from "../../mathFunction/solveLM";
import EChartLM from "./EChartLM";
import solveCoordLM from "../../mathFunction/solveCoordLM";
import cl from "./MainLM.module.css";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import ListboxLM from "./ListboxLM";

function MainLM() {

    const [separator, setSeparator] = useState("\t");
    const [typeData, setTypeData] = useState("");
    const [file, setFile] = useState("");
    const [fileName, setFileName] = useState(".txt")
    const [notationTemperature, setNotationTemperature] = useState("celsius");
    const [notationStrength, setNotationStrength] = useState("mpa");
    const [constantLMSettings, setConstantLMSettings] = useState("user");
    const [constantLM, setConstantLM] = useState(20);
    const [degreeOfThePolynomial, setDegreeOfThePolynomial] = useState(2);
    const [dataPoints, setDataPoints] = useState([]);
    const [dataLines, setDataLines] = useState({});
    const [roots, setRoots] = useState(["Без пересечения"]);
    const [regression, setRegression] = useState({});
    const [selectedRoot, setSelectedRoot] = useState(roots[0]);
    const selectRoot = useRef(null);

    const [determinationStraight, setDeterminationStraight] = useState("");
    const [skoStraight, setSkoStraight] = useState("");
    const [determinationCurve, setDeterminationCurve] = useState("");
    const [skoCurve, setSkoCurve] = useState("");


    function changeSeparator(event) {
        if (event.target.value == "tabulation") {
            setSeparator("\t")
            return
        }
        setSeparator(event.target.value)
    }
    function changeTypeData(event) {
        setTypeData(event.target.value)
    }
    function changeNotationTemperature(event) {
        setNotationTemperature(event.target.value)
    }
    function changeNotationStrength(event) {
        setNotationStrength(event.target.value)
    }
    function handleFileChange(event) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0])
        setFileName(event.target.files[0].name)
        reader.onload = (data) => {
            if (data.target.result) {
                let newline = "";
                if (data.target.result.includes("\r\n")) {
                    newline = "\r\n"
                } else if (data.target.result.includes("\r")) {
                    newline = "\r"
                } else if (data.target.result.includes("\n")) {
                    newline = "\n"
                }
                const arrText = data.target.result.split(newline);
                const localData = [];
                arrText.map((line) => {
                    const arrLine = line.split(separator)
                    if (arrLine.length == 3) {
                        if (arrLine[1] < 1) {
                            localData.push({ straight: 1, curve: 0, temperature: arrLine[0], time: arrLine[1], strength: arrLine[2] })
                        } else {
                            localData.push({ straight: 0, curve: 1, temperature: arrLine[0], time: arrLine[1], strength: arrLine[2] })
                        }
                    } else if (arrLine.length == 5) {
                        localData.push({ straight: +arrLine[0], curve: +arrLine[1], temperature: arrLine[2], time: arrLine[3], strength: arrLine[4] })
                    } else {

                    }
                }
                )
                setDataPoints(localData);
            }
            // event.target.value = "";
        }
        // reader.onerror = (error) => {
        //     console.error("Неправильный тип файла")
        // }
        // setFile("")
        // console.log(event.target.getValue())
    }
    function saveToFile(e) {
        let text = "";
        dataPoints.forEach((item) => {
            text = text + `${item.straight}${separator}${item.curve}${separator}${item.temperature}${separator}${item.time}${separator}${item.strength}\n`
        });
        const href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
        e.target.href = href
        // e.target.download = "text.txt"
    }
    // Solver Settings
    function changeConstantLMSettings(event) {
        setConstantLMSettings(event.target.value)
    }
    function changeConstantLM(event) {
        setConstantLM(event.target.value = event.target.value.replace(/[^0-9.]/g, ""))
    }
    function changeDegreeOfThePolynomial(event) {
        setDegreeOfThePolynomial(event.target.value)
    }
    // set value SKO
    function setSKO(regression) {
        setDeterminationStraight(`${Math.floor(regression.arrResultsLinearRegression.slice(-1)[0][0] * 100) / 100}%`)
        setSkoStraight(Math.floor(regression.arrResultsLinearRegression.slice(-1)[0][1] * 1000) / 1000)
        setDeterminationCurve(`${Math.floor(regression.arrResultsNonlinearRegression.slice(-1)[0][0] * 100) / 100}%`)
        setSkoCurve(Math.floor(regression.arrResultsNonlinearRegression.slice(-1)[0][1] * 1000) / 1000)
    }

    return (
        <>
            <div className={cl.leftSide}>

                <div className={cl.leftSideImport}>
                    <div className={cl.importTittle}>
                        Настройки импорта
                    </div>
                    <div className={cl.importSettingsContainer}>
                        <div className={cl.radioContainer}>
                            <div className={cl.radioTittle}>
                                Разделитель
                            </div>
                            <div className={cl.radioWrapper}>
                                <input type="radio" className={cl.radioInput} id="tab" name="separator" value="tabulation" defaultChecked={true} onChange={changeSeparator} />
                                <label className={cl.radioLabel} htmlFor="tab">Таб</label>
                            </div>
                            <div className={cl.radioWrapper}>
                                <input type="radio" className={cl.radioInput} id="space" name="separator" value=" " onChange={changeSeparator} />
                                <label className={cl.radioLabel} htmlFor="space">Пробел</label>
                            </div>
                            <div className={cl.radioWrapper}>
                                <input type="radio" className={cl.radioInput} id="comma" name="separator" value="," onChange={changeSeparator} />
                                <label className={cl.radioLabel} htmlFor="comma">,</label>
                            </div>
                            <div className={cl.radioWrapperLast}>
                                <input type="radio" className={cl.radioInput} id="semicolon" name="separator" value=";" onChange={changeSeparator} />
                                <label className={cl.radioLabel} htmlFor="semicolon">;</label>
                            </div>
                        </div>
                        <div className={cl.notationContainer}>
                            <div className={cl.radioContainer} style={{ marginBottom: "25px" }}>
                                <div className={cl.radioTittle}>
                                    Температура
                                </div>
                                <div className={cl.radioWrapper}>
                                    <input type="radio" className={cl.radioInput} id="celsius" name="temperature" value="celsius" defaultChecked={true} onChange={changeNotationTemperature} />
                                    <label className={cl.radioLabel} htmlFor="celsius">&#8451;</label>
                                </div>
                                <div className={cl.radioWrapperLast}>
                                    <input type="radio" className={cl.radioInput} id="kelvin" name="temperature" value="kelvin" onChange={changeNotationTemperature} />
                                    <label className={cl.radioLabel} htmlFor="kelvin">K</label>
                                </div>
                            </div>
                            <div className={cl.radioContainer}>
                                <div className={cl.radioTittle}>
                                    Напряжения
                                </div>
                                <div className={cl.radioWrapper}>
                                    <input type="radio" className={cl.radioInput} id="mpa" name="strength" value="mpa" defaultChecked={true} onChange={changeNotationStrength} />
                                    <label className={cl.radioLabel} htmlFor="mpa">МПа</label>
                                </div>
                                <div className={cl.radioWrapper}>
                                    <input type="radio" className={cl.radioInput} id="pa" name="strength" value="pa" onChange={changeNotationStrength} />
                                    <label className={cl.radioLabel} htmlFor="pa">Па</label>
                                </div>
                                <div className={cl.radioWrapperLast}>
                                    <input type="radio" className={cl.radioInput} id="kgs" name="strength" value="kgs" onChange={changeNotationStrength} />
                                    <label className={cl.radioLabel} htmlFor="kgs">кгс/мм&#178;</label>
                                </div>
                            </div>
                        </div>
                        <div className={cl.fileSourceBtn} onClick={(e) => e.preventDefault}>
                            <input className={cl.fileInput} type="file" id="upload-file" name="upload-file" accept=".txt,.dat,.mac" value={file}
                                onChange={(e) => {
                                    handleFileChange(e)
                                }}
                            />
                            <label className={cl.fileBtn} htmlFor="upload-file" ><span>Выберите файл</span></label>
                        </div>
                    </div>
                    {/* <div className={cl.radioContainer}>
                        <div className={cl.radioTittle}>
                            Тип данных
                        </div>
                        <div className={cl.radioWrapper}>
                            <input type="radio" className={cl.radioInput} id="raw" name="typeData" value="raw" defaultChecked={true} onChange={changeTypeData} />
                            <label className={cl.radioLabel} htmlFor="raw">Сырые</label>
                        </div>
                        <div className={cl.radioWrapperLast}>
                            <input type="radio" className={cl.radioInput} id="processed" name="typeData" value="processed" onChange={changeTypeData} />
                            <label className={cl.radioLabel} htmlFor="processed">Обраб</label>
                        </div>
                    </div> */}
                </div>
                <div className={cl.leftSideExport}>
                    <div className={cl.fileExportBtn} onClick={(e) => e.preventDefault}>
                        <a className={cl.fileBtn} download={fileName} href="" onClick={saveToFile}>Сохранить файл</a>
                        {/* <input className={cl.fileInput} type="file" id="save-file" name="save-file" accept=".txt,.dat,.mac" value={file}
                            onChange={(e) => {
                                handleFileChange(e)
                            }}
                        />
                        <label className={cl.fileBtn} htmlFor="save-file" ><span>Сохранить файл</span></label> */}
                    </div>
                </div>





            </div>

            <div className={cl.rightSide}>
                <div className={cl.tableContainer}>
                    <Table dataPoints={dataPoints} setDataPoints={setDataPoints} />
                </div>
                <div className={cl.graphContainer}>
                    <div className={cl.rootsContainer}>
                        <ListboxLM array={roots} regression={regression} setDataLines={setDataLines} />
                        {/* <span htmlFor="rootss" className={cl.rootsLabel}>Точки пересечения:</span>
                        <select size="1" className={cl.rootsCombobox} ref={selectRoot}
                            onChange={(e) => {
                                solveCoordLM(regression, e.target.value, setDataLines)
                            }}>
                            {roots.map((item) => {
                                if (typeof (item) == "string") {
                                    return <option key={item} value={item}>{item}</option>
                                } else {
                                    return <option key={item} >{Math.floor(item)}</option>
                                }
                            }
                            )}
                        </select> */}
                    </div>
                    <EChartLM dataPoints={dataPoints} dataLines={dataLines} regression={regression}/>
                    <div className={cl.skoContainer}>
                        <div className={cl.skoStraight}>
                            <span className={cl.skoTittle}>Прямая &ndash;</span>
                            <div className={cl.skoWrapper}>
                                <label className={cl.skoLabel} htmlFor="rStraight">R&#178;:</label>
                                <input type="text" className={cl.sko} id="rStraight" value={determinationStraight} size="3" onChange={(e) => e.preventDefault} />
                            </div>
                            <div className={cl.skoWrapper}>
                                <label className={cl.skoLabel} htmlFor="skoStraight">СКО:</label>
                                <input type="text" className={cl.sko} id="skoStraight" value={skoStraight} size="1" onChange={(e) => e.preventDefault} />
                            </div>
                        </div>
                        <div className={cl.skoStraight}>
                            <span className={cl.skoTittle}>Кривая &ndash;</span>
                            <div className={cl.skoWrapper}>
                                <label className={cl.skoLabel} htmlFor="rCurve">R&#178;:</label>
                                <input type="text" className={cl.sko} id="rCurve" value={determinationCurve} size="3" onChange={(e) => e.preventDefault} />
                            </div>
                            <div className={cl.skoWrapper}>
                                <label className={cl.skoLabel} htmlFor="skoCurve">СКО:</label>
                                <input type="text" className={cl.sko} id="skoCurve" value={skoCurve} size="1" onChange={(e) => e.preventDefault} />
                            </div>
                        </div>
                    </div>
                    <div className={cl.solverSettingsContainer}>
                        <div className={cl.solverSettingsTittle}>
                            Настройки решателя
                        </div>
                        <div className={cl.solverSettingsBody}>
                            <div className={cl.constantLMContainer} style={{ display: "flex", flexDirection: "column" }}>
                                <div className={cl.radioSolverTittle}>
                                    Константа С:
                                </div>
                                <div className={cl.radioConstantLMContainer}>
                                    <div className={cl.radioWrapper}>
                                        <input type="radio" className={cl.radioInput} id="auto" name="constantLMSettings" value="auto" onChange={changeConstantLMSettings} />
                                        <label className={cl.radioLabel} htmlFor="auto">Авто</label>
                                    </div>
                                    <div className={cl.radioWrapperLast}>
                                        <input type="radio" className={cl.radioInput} id="user" name="constantLMSettings" value="user" defaultChecked={true} onChange={changeConstantLMSettings} />
                                        <label className={cl.radioLabel} htmlFor="user">Вручную</label>
                                    </div>
                                </div>
                                <div className={cl.constantLMInputContainer}>
                                    <input className={cl.constantLM} type="text" id="user" placeholder="Параметр С" onChange={changeConstantLM} value={constantLM} />
                                </div>
                            </div>
                            <div className={cl.radioDegreeContainer}>
                                <div className={cl.radioSolverTittle}>
                                    Степень уравнения:
                                </div>
                                <div className={cl.radioWrapper}>
                                    <input type="radio" className={cl.radioInput} id="two" name="degreeOfThePolynomial" value="2" defaultChecked={true} onChange={changeDegreeOfThePolynomial} />
                                    <label className={cl.radioLabel} htmlFor="two">2</label>
                                </div>
                                <div className={cl.radioWrapper}>
                                    <input type="radio" className={cl.radioInput} id="three" name="degreeOfThePolynomial" value="3" onChange={changeDegreeOfThePolynomial} />
                                    <label className={cl.radioLabel} htmlFor="three">3</label>
                                </div>
                                <div className={cl.radioWrapperLast}>
                                    <input type="radio" className={cl.radioInput} id="four" name="degreeOfThePolynomial" value="4" onChange={changeDegreeOfThePolynomial} />
                                    <label className={cl.radioLabel} htmlFor="four">4</label>
                                </div>
                            </div>
                            <div className={cl.calculateContainer}>
                                <div className={cl.calculateWrapper}>
                                    <button className={cl.calculate}
                                        onClick={(e) => {
                                            // e.preventDefault
                                            let regression = solveLM(dataPoints, setDataPoints, [notationTemperature, notationStrength, constantLM, degreeOfThePolynomial])
                                            // const currentSelectedRootIndex = selectRoot.current.selectedIndex
                                            setRoots(regression.arrRoot)
                                            setRegression(regression)
                                            // console.log(Math.floor(regression.arrResultsLinearRegression.slice(-1)[0][0]*100)/100)
                                            // console.log(regression.arrResultsLinearRegression.slice(-1)[0])
                                            setSKO(regression)
                                            solveCoordLM(regression, regression.arrRoot[0], setDataLines)
                                            // selectRoot.current.options[0].selected = true
                                            // console.log(0)
                                            // if (currentSelectedRootIndex == 0) {
                                            // } else if (currentSelectedRootIndex <= regression.arrRoot.length-1) {
                                            //     solveCoordLM(regression, Math.floor(regression.arrRoot[currentSelectedRootIndex]), setDataLines)
                                            //     selectRoot.current.options[currentSelectedRootIndex].selected = true
                                            //     console.log(Math.floor(regression.arrRoot[currentSelectedRootIndex]))
                                            // }
                                            // else {
                                            //     solveCoordLM(regression, Math.floor(regression.arrRoot[0]), setDataLines)
                                            //     console.log(0)
                                            // }
                                        }}>Рассчитать</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default MainLM;