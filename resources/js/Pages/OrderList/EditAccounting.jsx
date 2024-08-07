import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import AppContent from "../../Layouts/layout/AppContent";
import ContentPanel from "../../Components/Table/ContentPanel";

import { Head, useForm, Link } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import { useToast } from "../../Context/ToastContext";
import TableButton from "../../Components/Table/Buttons/TableButton";
import ImageViewer from "../../Components/ImageView/ImageViewer";

const EditFormAccounting = ({ order_list, status, store_name }) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();

    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Quotation Form");
        }, 5);
    }, []);

    const [handleImageView, setHandleImageView] = useState(false);
    const [clickedImage, setClickedImage] = useState("");

    const handleCloseImageView = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageClick = () => {
        setHandleImageView(!handleImageView);
    };

    const handleChange = (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;
        setData(name, value);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        estimated_store_cost: "",
        estimated_landed_cost: "",
        estimated_srp: "",
        order_list_id: order_list.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans" >Are you sure that you want to edit this?</p>`,
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
                    {
                        console.log(error);
                    }
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
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="item_description"
                                    value={order_list.item_description}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    value={order_list.part_number}
                                    displayName="Part Number"
                                    name="part_number"
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
                                {order_list.digits_code && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        displayName="Digits Code"
                                        value={order_list.digits_code}
                                    />
                                )}
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
                                {order_list.supplier_cost && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="supplier_cost"
                                        value={order_list.supplier_cost}
                                    />
                                )}
                                {order_list.cash_price && (
                                    <InputComponent
                                        extendClass="w-full"
                                        displayName="Cash Price"
                                        value={order_list.cash_price}
                                        is_disabled={true}
                                    />
                                )}
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    value="USD"
                                    displayName={"Currency"}
                                />

                                <InputComponent
                                    extendClass="w-full"
                                    placeholder="Estimated Store Cost"
                                    name="estimated_store_cost"
                                    onChange={handleChange}
                                />
                                {errors.estimated_store_cost && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estimated_store_cost}
                                    </span>
                                )}

                                <InputComponent
                                    extendClass="w-full"
                                    placeholder="Estimated Landed Cost"
                                    name="estimated_landed_cost"
                                    onChange={handleChange}
                                />
                                {errors.estimated_landed_cost && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estimated_landed_cost}
                                    </span>
                                )}
                                <InputComponent
                                    extendClass="w-full"
                                    placeholder="Estimated SRP"
                                    name="estimated_srp"
                                    displayName={"Estimated SRP"}
                                    onChange={handleChange}
                                />
                                {errors.estimated_srp && (
                                    <span className="text-red-500 text-sm">
                                        {errors.estimated_srp}
                                    </span>
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
                                    className="flex flex-col justify-center items-center w-full h-[380px] rounded-2xl border-2 border-gray-400 p-7  bg-white text-center cursor-pointer"
                                    onClick={() => {
                                        handleImageClick();
                                        setClickedImage(
                                            order_list.original_uploaded_file
                                        );
                                    }}
                                >
                                    <img
                                        className="w-80"
                                        src={`/images/uploaded-images/${order_list.original_uploaded_file}`}
                                        alt="Uploaded File"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                    <Link
                        className={`bg-secondary text-white overflow-hidden  rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                        href="/bto_order_list"
                    >
                        Back
                    </Link>
                    <TableButton
                        extendClass="mt-4"
                        type="submit"
                        disabled={processing}
                    >
                        Update
                    </TableButton>
                </form>
            </ContentPanel>
            <ImageViewer
                show={handleImageView}
                onClose={handleCloseImageView}
                selectedImage={clickedImage}
            />
        </>
    );
};

export default EditFormAccounting;
