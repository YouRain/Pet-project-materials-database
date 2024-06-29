import React, { useEffect, useRef, useState } from "react";
import NavBtn from "./NavBtn";

function Header() {

    //Кнопки навигации
    const nameNavBtn = [
        { name: "Database", dataSet: "link__database" },
        { name: "Stress-Strain Curve", dataSet: "link__createssc" },
        { name: "Larson-Miller", dataSet: "link__lm" },
    ]

    return (
        <header className="header">
            <div className="header__inner" >

                <div className="header__logo">
                    <i className="fa-solid fa-database"></i>
                    <nav className="nav">

                        {nameNavBtn.map((prop) =>
                            <NavBtn key={prop.name} dataSet={prop.dataSet}>{prop.name}</NavBtn>
                        )}

                    </nav>
                </div>


                <div className="header__settings">
                    <i className="fa-solid fa-gear">&nbsp; &#9660;</i>
                </div>

            </div>
        </header>
    )
}

export default Header;