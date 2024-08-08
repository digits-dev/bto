import React, { useState } from "react";
import FormatLabelName from "../../Utilities/FormatLabelName";

const InputComponent = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    displayName,
    checked,
    is_disabled,
    extendClass,
    extendClass1,
    isrequired = true,
}) => {
    return (
        <div className={extendClass}>
            <label
                htmlFor={name}
                className="block text-sm font-bold text-gray-700 font-nunito-sans"
            >
                {displayName || FormatLabelName(name)}
            </label>
            <input
                id={name}
                required={isrequired}
                type={type}
                value={value}
                name={name}
                disabled={is_disabled}
                onChange={onChange}
                placeholder={placeholder}
                className={`mt-1 block w-full px-3 py-2 placeholder:text-gray-300  border placeholder:text-sm placeholder:text-gray-300 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm ${extendClass1}`}
                checked={checked}
            />
        </div>
    );
};

export default InputComponent;
