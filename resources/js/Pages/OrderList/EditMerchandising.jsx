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
    const [customerName, setCustomerName] = useState(order_list.customer_name);
    const [orderQty, setOrderQty] = useState(order_list.order_qty);
    const [phoneNumber, setPhoneNumber] = useState(order_list.phone_number);
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
            try {
                const response = await axios.post("/get-digits-code", {
                    part_number: partNumber,
                });
                setDigitsCode(response.data.digits_code);
                setOrderQty("");
                setCustomerName("");
                setItemDescription(response.data.item_description);
                setPhoneNumber("");
                setPartNumberMessage("Exists");
            } catch (error) {
                console.error(error);
                setItemDescription(order_list.item_description);
                setOrderQty(order_list.order_qty);
                setCustomerName(order_list.customer_name);
                setPhoneNumber(order_list.phone_number);
                setDigitsCode("");
                setPartNumberMessage("Not");
            } finally {
            }
        }, 1000),
        []
    );

    const handleChange = async (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setData(name, value);

        if (name === "part_number") {
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
            title: `<p class="font-nunito-sans">Are you sure that you want to edit this?</p>`,
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
                                    value={customerName}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="order_qty"
                                    value={orderQty}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="phone_number"
                                    value={phoneNumber}
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
                                    name="item_description"
                                    value={itemDescription}
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
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
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    displayName="digits_code"
                                    value={digitsCode}
                                />
                                {data.part_number && partNumberMessage && (
                                    <div className="relative flex items-center">
                                        <span className="bg-slate-500  px-[10px] rounded-full mr-2 text-white relative group">
                                            !
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-md w-[200px] text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                {partNumberMessage === "Exists"
                                                    ? "Part Number already exists"
                                                    : "Part Number does not exist"}
                                            </span>
                                        </span>
                                        <span
                                            className={`text-sm ${
                                                partNumberMessage === "Exists"
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {partNumberMessage === "Exists"
                                                ? "Part Number already exists"
                                                : "Part Number does not exist"}
                                        </span>
                                    </div>
                                )}

                                <InputComponent
                                    extendClass="w-full"
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
                                {order_list.status != 1 && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        value={order_list.store_cost}
                                        name="store_cost"
                                        onChange={handleChange}
                                    />
                                )}
                                {order_list.status == 3 && (
                                    <InputComponent
                                        extendClass="w-full"
                                        name="srp"
                                        displayName="SRP"
                                        onChange={handleChange}
                                    />
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
                    <TableButton extendClass="mt-4" type="submit">
                        {order_list.status == 3 ||
                        partNumberMessage === "Exists"
                            ? "Close"
                            : "Update"}
                    </TableButton>
                </form>
            </ContentPanel>
        </>
    );
};

export default EditFormMerchandising;
