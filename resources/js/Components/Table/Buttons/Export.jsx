import React from "react";
import TableButton from "./TableButton";

const Export = ({ path, handleToast }) => {
    const handleExport = () => {
        Swal.fire({
            title: `<p class="font-nunito-sans" >Are you sure that you want to export this table?</p>`,
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#201E43",
            cancelButtonColor: "#134B70",
            icon: "question",
            iconColor: "#134B70",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // throw new Error('test');
                    window.location.href = path;
                } catch (error) {
                    {
                        handleToast &&
                            handleToast(
                                "Something went wrong, please try again later.",
                                "Error"
                            );
                    }
                }
            }
        });
    };

    return <TableButton onClick={handleExport}>Export</TableButton>;
};

export default Export;
