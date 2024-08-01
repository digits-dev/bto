import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head, useForm, Link } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import { useToast } from "../../Context/ToastContext";
import TableButton from "../../Components/Table/Buttons/TableButton";

const EditFormMerchandising = ({
    order_list,
    my_privilege_id,
    status,
    store_name,
}) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();

    const [digitsCode, setDigitsCode] = useState("");
    const [partNumberMessage, setPartNumberMessage] = useState("");
    const [srp, setSrp] = useState(order_list.srp);
    const [isChecking, setIsChecking] = useState(true);
    const [itemDescription, setItemDescription] = useState(
        order_list.item_description
    );

    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Order Form");
        }, 5);
    }, []);

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Fetch digits code based on part number
    const debouncedFetchDigitsCode = useCallback(
        debounce(async (partNumber) => {
            if (!partNumber.trim()) {
                setPartNumberMessage("Not Exists");
                setItemDescription(order_list.item_description);
                return;
            }
            try {
                const response = await axios.post("/get-digits-code", {
                    part_number: partNumber,
                });
                setDigitsCode(response.data.digits_code);
                setItemDescription(response.data.item_description);
                setPartNumberMessage("Exists");
            } catch (error) {
                console.error(error);
                setItemDescription(order_list.item_description);
                setDigitsCode("");
                setPartNumberMessage("Not Exists");
            } finally {
                setIsChecking(false);
            }
        }, 1000),
        []
    );

    const handleChange = async (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setData(name, value);
        console.log(data);

        if (name === "part_number") {
            setIsChecking(true);
            debouncedFetchDigitsCode(value);
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        part_number: "",
        srp: "",
        order_list_id: order_list.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans">Are you sure that you want to  <span style="color: ${
                order_list.status == 3 ? "#309fb5" : "#10B981"
            };" >${
                order_list.status == 3 ? "CLOSE" : "UPDATE"
            }</span> this?</p>`,

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
                    post("/bto_order_list/edit_save", {
                        onSuccess: (response) => {
                            console.log(response);
                            handleToast(
                                "Order Updated successfully",
                                "success"
                            );
                        },
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    return (
        <>
            <Head title="Edit Form" />
            <ContentPanel>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                        <div className="lg:w-[60%] lg:flex gap-3">
                            <div className="flex flex-col flex-1 gap-y-3">
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="status"
                                    value={status}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="customer_name"
                                    value={order_list.customer_name}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="order_qty"
                                    value={order_list.order_qty}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="phone_number"
                                    value={order_list.phone_number}
                                />
                                <InputComponent
                                    displayName="Store Name"
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="stores_id"
                                    value={store_name}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName="UOM"
                                    value="PCS"
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName="Brand"
                                    value="Apple"
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="item_description"
                                    value={order_list.item_description}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    placeholder={"Part Number"}
                                    is_disabled={
                                        my_privilege_id == 6 &&
                                        order_list.status == 1
                                            ? false
                                            : true
                                    }
                                    value={
                                        my_privilege_id == 6 &&
                                        order_list.status == 1
                                            ? data.part_number
                                            : order_list.part_number
                                    }
                                    displayName="Part Number"
                                    name="part_number"
                                    onChange={handleChange}
                                />
                                {partNumberMessage === "Exists" && (
                                    <div className="relative flex items-center">
                                        <span className="bg-slate-500  px-[10px] rounded-full mr-2 text-white relative group">
                                            !
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-md w-[200px] text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                Part Number already exists"
                                            </span>
                                        </span>
                                        <span className="text-sm text-red-500">
                                            "Part Number already exists"
                                        </span>
                                    </div>
                                )}
                                {partNumberMessage === "Exists" && (
                                    <>
                                        <InputComponent
                                            extendClass="w-full"
                                            is_disabled={true}
                                            name="digits_item_description"
                                            value={itemDescription}
                                        />
                                        <InputComponent
                                            extendClass="w-full"
                                            is_disabled={true}
                                            displayName="Digits Code"
                                            value={digitsCode || ""}
                                        />
                                    </>
                                )}
                                {order_list.status == 3 && (
                                    <>
                                        {order_list.digits_item_description && (
                                            <InputComponent
                                                extendClass="w-full"
                                                is_disabled={true}
                                                name="digits_item_description"
                                                value={
                                                    order_list.digits_item_description
                                                }
                                            />
                                        )}
                                        {order_list.digits_code && (
                                            <InputComponent
                                                extendClass="w-full"
                                                is_disabled={true}
                                                displayName="Digits Code"
                                                value={order_list.digits_code}
                                            />
                                        )}
                                        <InputComponent
                                            extendClass="w-full"
                                            is_disabled={true}
                                            value={order_list.store_cost}
                                            name="store_cost"
                                            onChange={handleChange}
                                        />

                                        <InputComponent
                                            extendClass="w-full"
                                            placeholder={"SRP"}
                                            is_disabled={order_list.status != 3}
                                            name="srp"
                                            value={order_list.srp}
                                            displayName="SRP"
                                            onChange={handleChange}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="sm:w-full lg:w-[40%] flex flex-col self-center m-4">
                            <label
                                htmlFor="input-file"
                                className="relative w-full"
                            >
                                <div
                                    id="image-view"
                                    className="flex flex-col justify-center items-center w-full md:w-auto h-[380px] md:h-auto rounded-2xl border-2 border-gray-400 p-7 bg-white text-center"
                                >
                                    <a
                                        href={`/images/uploaded-images/${order_list.uploaded_file}`}
                                        target="_blank"
                                    >
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`/images/uploaded-images/${order_list.uploaded_file}`}
                                            alt="Uploaded File"
                                        />
                                    </a>
                                </div>
                            </label>
                        </div>
                    </div>
                    <Link
                        className={`bg-secondary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                        href="/bto_order_list"
                    >
                        Back
                    </Link>
                    <TableButton
                        disabled={order_list.status != 3 && isChecking}
                        extendClass="mt-4"
                        type="submit"
                    >
                        {order_list.status == 3 ? "Close" : "Update"}
                    </TableButton>
                </form>
            </ContentPanel>
        </>
    );
};

export default EditFormMerchandising;
