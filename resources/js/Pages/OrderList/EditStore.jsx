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
import Modal from "../../Components/Modal/Modal";

const EditStore = ({ order_list, status, store_name }) => {
    const { setTitle } = useContext(NavbarContext);
    const { handleToast } = useToast();
    const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Quotation Form");
        }, 5);
    }, []);

    const { data, setData, post, processing } = useForm({
        action: "",
        uploaded_receipt1: "",
        order_list_id: order_list.id,
    });

    const [handleImageView, setHandleImageView] = useState(false);
    const [clickedImage, setClickedImage] = useState("");

    const handleCloseImageView = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageClick = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
            setData("uploaded_receipt1", event.target.files[0]);
        }
    };

    const formatNumberWithCommas = (value) => {
        if (value === null || value === undefined) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleButtonClick = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans">Are you sure that you want to <span style="color: ${
                data.action === "DP Paid" ? "#449964" : "#d4081a"
            };">${
                data.action === "Void" ? "VOID" : "DP PAID "
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
                if (data.action === "DP Paid" && !data.uploaded_receipt1) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Please upload a receipt!",
                    });
                    return;
                }
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
            <form onSubmit={handleButtonClick}>
                <ContentPanel>
                    <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                        <div className="lg:w-[50%] lg:flex gap-3">
                            <div className="flex flex-col flex-1 gap-y-3">
                                <InputComponent
                                    extendClass="w-full"
                                    extendClass1="border-2 border-blue-500 bg-blue-100"
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
                                <InputComponent
                                    extendClass="w-full"
                                    displayName="Cash Price"
                                    value={formatNumberWithCommas(
                                        order_list.cash_price
                                    )}
                                    is_disabled={true}
                                />
                                <InputComponent
                                    extendClass="w-full"
                                    displayName={"Estimated SRP"}
                                    is_disabled={true}
                                    value={formatNumberWithCommas(
                                        order_list.estimated_srp
                                    )}
                                />
                                {order_list.final_srp && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        displayName="Final SRP"
                                        value={formatNumberWithCommas(
                                            order_list.final_srp
                                        )}
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
                        <div className="sm:w-full lg:w-[50%] my-2 mx-auto flex flex-col gap-5">
                            <div className="md:flex-row flex flex-col gap-3 justify-evenly">
                                <ImageView
                                    imageTitle="Original Image"
                                    path={order_list.original_uploaded_file}
                                    handleImageClick={() => {
                                        handleImageClick();
                                        setClickedImage(
                                            order_list.original_uploaded_file
                                        );
                                    }}
                                />
                                <ImageView
                                    imageTitle="Final Image"
                                    path={order_list.final_uploaded_file}
                                    handleImageClick={() => {
                                        handleImageClick();
                                        setClickedImage(
                                            order_list.final_uploaded_file
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="font-nunito-sans font-bold text-red-400 ">
                                    Upload Down Payment Receipt
                                </p>
                                <div className="w-[80%] flex flex-col self-center m-2">
                                    <label
                                        htmlFor="input-file"
                                        className="relative w-full"
                                    >
                                        <input
                                            id="input-file"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            className="z-0 absolute w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                        <div
                                            id="image-view"
                                            className="flex flex-col justify-center items-center w-full h-[270px] rounded-2xl border-2 border-dashed border-gray-400 p-7 cursor-pointer bg-[#f5fbff] text-center"
                                        >
                                            {selectedImage ? (
                                                <img
                                                    className="w-60"
                                                    id="image"
                                                    src={selectedImage}
                                                    alt="Selected"
                                                />
                                            ) : (
                                                <>
                                                    <img
                                                        className="w-32"
                                                        id="image"
                                                        src="/images/others/upload.png"
                                                        alt="Upload"
                                                    />
                                                    <p className="text-sm font-nunito-sans font-black text-upload-text-color">
                                                        Upload Image
                                                    </p>
                                                    <p className="text-[12px] text-slate-500">
                                                        File Supported: JPEG,
                                                        PNG
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>
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
                            disabled={processing}
                            onClick={() => setData("action", "Void")}
                            bg="bg-red-700"
                            border="border-red-700"
                        >
                            Void
                        </TableButton>
                        <TableButton
                            disabled={processing}
                            extendClass="mt-4"
                            type="submit"
                            onClick={() => setData("action", "DP Paid")}
                            bg="bg-green-700"
                            border="border-green-700"
                        >
                            DP Paid
                        </TableButton>
                    </div>
                </ContentPanel>
                <Modal modalLoading show={processing} />
            </form>
            <ImageViewer
                show={handleImageView}
                onClose={handleCloseImageView}
                selectedImage={clickedImage}
            />
        </>
    );
};

export default EditStore;
