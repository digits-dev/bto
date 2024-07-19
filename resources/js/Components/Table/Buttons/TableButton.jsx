import React from "react";

const TableButton = ({
    children,
    onClick,
    disabled,
    type,
    extendClass,
    ...props
}) => {
    return (
        <button
            {...props}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`bg-secondary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 ${extendClass}`}
        >
            {children}
        </button>
    );
};

export default TableButton;
