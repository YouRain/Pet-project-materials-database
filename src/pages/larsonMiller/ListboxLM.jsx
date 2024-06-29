import React, { useState, useEffect } from "react";
import cl from "./MainLM.module.css";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import solveCoordLM from "../../mathFunction/solveCoordLM";

function ListboxLM({ array, regression, setDataLines }) {

    const [selectedRoot, setSelectedRoot] = useState(array[0]);
    const [isHiddenListbox, setIsHiddenListbox] = useState(true)

    useEffect(() => {
        setSelectedRoot(array[0])
        document.addEventListener("click", toggleListbox)
        return () => {
            document.removeEventListener("click", toggleListbox)
        }
    }, [array])

    function toggleListbox(event) {
        if (!event.target.hasAttribute("data-listboxbtn")) {
            setIsHiddenListbox(true);
        }
        if (event.target.hasAttribute("data-listboxbtn")) {
            setIsHiddenListbox((isHiddenListbox) => !isHiddenListbox);
        }
    }

    function selectRoot(event) {
        if (event.target.hasAttribute("data-option")) {
            setSelectedRoot(event.target.textContent)
            solveCoordLM(regression, event.target.textContent, setDataLines)
        }
    }

    return (
        <div>
            <div className={cl.listboxBtnWrapper}>
                <div className={cl.listboxBtn} data-listboxbtn={true}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        data-listboxbtn={true}
                    >
                        {selectedRoot}
                    </span>
                    <span className={cl.chevronUpDownWrapper}>
                        <ChevronUpDownIcon
                            style={{ height: "20px", width: "20px", color: "grey" }}
                            data-listboxbtn={true}
                            aria-hidden="true"
                        />
                    </span>
                </div>
            </div>
            <div
                className={!isHiddenListbox ? cl.listboxOptions : [cl.listboxOptions, cl.hidden].join(" ")}
                onClick={event => {
                    selectRoot(event)
                }}
            >
                {array.map((item) => {
                    // console.log(selectedRoot)
                    if (typeof (item) == "string") {
                        return <div
                            key={item}
                            className={cl.listboxOption}
                            data-listboxoption={true}
                        >
                            <span
                                className={selectedRoot == item ? [cl.listboxItem, cl.active].join(" ") : cl.listboxItem}
                                data-option={true}
                            >
                                {item}
                            </span>
                            {selectedRoot == item ? (
                                <span className={cl.selectedCheckIconWrapper}>
                                    <CheckIcon
                                        style={{ height: "20px", width: "20px" }}
                                        aria-hidden="true"
                                    />
                                </span>
                            ) : null}
                        </div>
                    } else {
                        return <div
                            key={item}
                            className={cl.listboxOption}
                            data-listboxoption={true}
                        >
                            <span
                                className={selectedRoot == Math.floor(item) ? [cl.listboxItem, cl.active].join(" ") : cl.listboxItem}
                                data-option={true}
                            >
                                {Math.floor(item)}
                            </span>
                            {selectedRoot == Math.floor(item) ? (
                                <span className={cl.selectedCheckIconWrapper}>
                                    <CheckIcon
                                        style={{ height: "20px", width: "20px" }}
                                        aria-hidden="true"
                                    />
                                </span>
                            ) : null}
                        </div>
                    }
                })}
            </div>
        </div>
    )
}

export default ListboxLM;