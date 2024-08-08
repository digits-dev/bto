import React from "react";

const TableButton = ({
    children,
    onClick,
    disabled,
    type,
    extendClass,
    bg = 'bg-secondary',
    border = 'border-secondary',
    ...props
}) => {
    return (
        <button
            {...props}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${bg} text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border ${border} px-5 py-2 hover:opacity-80 ${extendClass}`}
        >
            {children}
        </button>
    );
};

export default TableButton;
