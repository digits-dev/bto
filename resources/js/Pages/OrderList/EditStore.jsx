import React, { useContext, useEffect, useState } from "react";
import { NavbarContext } from "../../Context/NavbarContext";
import axios from "axios";
import { Head, Link, useForm } from "@inertiajs/react";
import ContentPanel from "../../Components/Table/ContentPanel";
import ImageView from "../../Components/ImageView/ImageView";
import InputComponent from "../../Components/Forms/Input";
import moment from "moment";
import TableButton from "../../Components/Table/Buttons/TableButton";
import { useToast } from "../../Context/ToastContext";
import ImageViewer from "../../Components/ImageView/ImageViewer";

const EditStore = ({ order_list, status, store_name }) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();
    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Quotation Form");
        }, 5);
    }, []);

    const { data, setData, post } = useForm({
        action: "",
        order_list_id: order_list.id,
    });

    
    const [handleImageView, setHandleImageView] = useState(false);
    const [clickedImage, setClickedImage] = useState('');

    const handleCloseImageView = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageClick = () => {

        setHandleImageView(!handleImageView);
    };


    const handleButtonClick = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans">Are you sure that you want to <span style="color: ${
                data.action === "Close" ? "#309fb5" : "#d4081a"
            };">${
                data.action === "Void" ? "VOID" : "CLOSE"
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
                                data.action === "Void"
                                    ? "Order Voided successfully"
                                    : "Order Cancelled successfully",
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
                <form onSubmit={handleButtonClick}>
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
                                    name="reference_number"
                                    displayName="Reference #"
                                    value={order_list.reference_number}
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
                                    displayName="Store Name"
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="stores_id"
                                    value={store_name}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="phone_number"
                                    value={order_list.phone_number}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="item_description"
                                    value={order_list.item_description}
                                />
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
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
                                {order_list.uom && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="uom"
                                        displayName="UOM"
                                        value={order_list.uom}
                                    />
                                )}
                                {order_list.brand && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="brand"
                                        value={order_list.brand}
                                    />
                                )}
                                {order_list.part_number && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="part_number"
                                        displayName="Part #"
                                        value={order_list.part_number}
                                    />
                                )}
                                {order_list.digits_code && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="digits_code"
                                        value={order_list.digits_code}
                                    />
                                )}
                                {order_list.srp && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="srp"
                                        displayName="SRP"
                                        value={order_list.srp}
                                    />
                                )}
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="order_date"
                                    value={moment(order_list.order_date).format(
                                        "YYYY-MM-DD"
                                    )}
                                />
                            </div>
                        </div>
                        <div className="sm:w-full lg:w-[40%] flex flex-col m-4 space-y-3">
                            <ImageView
                                imageTitle="Original Image"
                                path={order_list.original_uploaded_file}
                                handleImageClick={()=>{handleImageClick(); setClickedImage(order_list.original_uploaded_file)}}
                            />
                            <ImageView
                                imageTitle="Final Image"
                                path={order_list.final_uploaded_file}
                                handleImageClick={()=>{handleImageClick(); setClickedImage(order_list.final_uploaded_file)}}
                            />
                        </div>
                    </div>
                    <div className="space-x-2">
                        <Link
                            className={`bg-secondary text-white rounded-lg font-nunito-sans inline-block mt-5 text-sm border border-secondary px-5 py-2 hover:opacity-80`}
                            href="/bto_order_list"
                        >
                            Back
                        </Link>
                        <TableButton
                            extendClass="mt-4"
                            type="submit"
                            onClick={() => setData("action", "Void")}
                        >
                            Void
                        </TableButton>
                        <TableButton
                            extendClass="mt-4"
                            type="submit"
                            onClick={() => setData("action", "Close")}
                        >
                            DP Paid
                        </TableButton>
                    </div>
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

export default EditStore;
