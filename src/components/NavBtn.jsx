import React from "react";

function NavBtn({ children, dataSet }) {

    function navigation() {
        
    }

    return (
        <div className="nav__item" data-link={dataSet} onClick={navigation}>
            <a href="#" className="nav__link">{children}</a>
        </div>
    )
}

export default NavBtn;