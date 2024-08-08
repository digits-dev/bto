import { Head, Link } from "@inertiajs/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import InputComponent from "../../Components/Forms/Input";
import moment from "moment";
import { NavbarContext } from "../../Context/NavbarContext";
import ImageView from "../../Components/ImageView/ImageView";
import ImageViewer from "../../Components/ImageView/ImageViewer";

const OrderListView = ({ order_details, my_privilege_id }) => {
    const { setTitle } = useContext(NavbarContext);
    const [isReceipt, setIsReceipt] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Quotation - Details");
        }, 5);
    }, []);

    const [childCount, setChildCount] = useState(0);
    const parentRef1 = useRef(null);
    const parentRef2 = useRef(null);

    useEffect(() => {
        if (parentRef1.current || parentRef2.current) {
            const parentCount =
                parentRef1.current.children.length +
                parentRef2.current.children.length;
            setChildCount(parentCount);
        }
    }, []);

    const [handleImageView, setHandleImageView] = useState(false);
    const [clickedImage, setClickedImage] = useState("");

    const handleCloseImageView = () => {
        setHandleImageView(!handleImageView);
    };

    const handleImageClick = () => {
        setHandleImageView(!handleImageView);
    };

    const formatNumberWithCommas = (value) => {
        if (value === null || value === undefined) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const flexClass = {
        1: "flex-col",
        2: "flex-col",
        3: "flex-col items-center",
        4: "flex-col items-center",
    }[childCount];

    const flexClass2 = {
        1: "flex-col",
        2: "flex-col",
        3: "flex-row",
        4: "flex-row",
    }[childCount];

    return (
        <>
            <Head title="BTO Quotation - Details" />
            <ContentPanel>
                <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                    <div className="lg:w-[50%] lg:flex gap-3">
                        <div className="flex flex-col flex-1 gap-y-3">
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="status"
                                value={order_details.bto_status.status_name}
                            />
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="reference_number"
                                displayName="Reference #"
                                value={order_details.reference_number}
                            />
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="customer_name"
                                value={order_details.customer_name}
                            />
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="order_qty"
                                value={order_details.order_qty}
                            />

                            <InputComponent
                                displayName="Store Name"
                                extendClass="w-full"
                                is_disabled={true}
                                name="stores_id"
                                value={
                                    order_details.store_location.location_name
                                }
                            />
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="phone_number"
                                value={order_details.phone_number}
                            />
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="item_description"
                                value={order_details.item_description}
                            />
                            {order_details.digits_item_description && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="digits_item_description"
                                    value={
                                        order_details.digits_item_description
                                    }
                                />
                            )}
                            {order_details.uom && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="uom"
                                    displayName="UOM"
                                    value={order_details.uom}
                                />
                            )}
                            {order_details.brand && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="brand"
                                    value={order_details.brand}
                                />
                            )}
                            {order_details.part_number && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="part_number"
                                    displayName="Part #"
                                    value={order_details.part_number}
                                />
                            )}
                        </div>
                        <div className="flex flex-col flex-1 gap-y-3">
                            {[1, 6, 7].includes(my_privilege_id) &&
                                order_details.supplier_cost && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="supplier_cost"
                                        value={formatNumberWithCommas(
                                            order_details.supplier_cost
                                        )}
                                    />
                                )}
                            {order_details.cash_price && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="cash_price"
                                    value={formatNumberWithCommas(
                                        order_details.cash_price
                                    )}
                                />
                            )}
                            {order_details.digits_code && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="digits_code"
                                    value={order_details.digits_code}
                                />
                            )}
                            {[1, 6, 7].includes(my_privilege_id) &&
                                order_details.estimated_store_cost && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="estimated_store_cost"
                                        value={formatNumberWithCommas(
                                            order_details.estimated_store_cost
                                        )}
                                    />
                                )}
                            {[1, 6, 7].includes(my_privilege_id) &&
                                order_details.estimated_landed_cost && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="estimated_landed_cost"
                                        value={formatNumberWithCommas(
                                            order_details.estimated_landed_cost
                                        )}
                                    />
                                )}
                            {[1, 6, 7].includes(my_privilege_id) &&
                                order_details.estimated_srp && (
                                    <InputComponent
                                        extendClass="w-full"
                                        is_disabled={true}
                                        name="srp"
                                        displayName="Estimated SRP"
                                        value={formatNumberWithCommas(
                                            order_details.estimated_srp
                                        )}
                                    />
                                )}
                            {order_details.final_srp && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="srp"
                                    displayName="Final SRP"
                                    value={formatNumberWithCommas(
                                        order_details.final_srp
                                    )}
                                />
                            )}
                            {order_details.po_number && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="po_number"
                                    displayName="PO Number"
                                    value={order_details.po_number}
                                />
                            )}
                            {order_details.dr_number && (
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    name="dr_number"
                                    displayName="DR Number"
                                    value={order_details.dr_number}
                                />
                            )}
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="order_date"
                                value={moment(order_details.order_date).format(
                                    "YYYY-MM-DD"
                                )}
                            />
                        </div>
                    </div>
                    <div
                        className={`sm:w-full lg:w-1/2 flex ${flexClass} gap-2`}
                    >
                        <div
                            className={`flex ${flexClass2} gap-2`}
                            ref={parentRef1}
                        >
                            <ImageView
                                imageTitle="Original Image"
                                path={order_details.original_uploaded_file}
                                handleImageClick={() => {
                                    handleImageClick();
                                    setClickedImage(
                                        order_details.original_uploaded_file
                                    );
                                    setIsReceipt(false);
                                }}
                                isReceipt={false}
                            />
                            <ImageView
                                imageTitle="Final Image"
                                path={order_details.final_uploaded_file}
                                handleImageClick={() => {
                                    handleImageClick();
                                    setClickedImage(
                                        order_details.final_uploaded_file
                                    );
                                    setIsReceipt(false);
                                }}
                                isReceipt={false}
                            />
                        </div>
                        <div
                            className={`flex ${flexClass2} gap-2`}
                            ref={parentRef2}
                        >
                            <ImageView
                                imageTitle="Down Payment Receipt"
                                path={order_details.uploaded_receipt1}
                                handleImageClick={() => {
                                    handleImageClick();
                                    setClickedImage(
                                        order_details.uploaded_receipt1
                                    );
                                    setIsReceipt(true);
                                }}
                                isReceipt={true}
                            />
                            <ImageView
                                imageTitle="Invoice Receipt"
                                path={order_details.uploaded_receipt2}
                                handleImageClick={() => {
                                    handleImageClick();
                                    setClickedImage(
                                        order_details.uploaded_receipt2
                                    );
                                    setIsReceipt(true);
                                }}
                                isReceipt={true}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Link
                        className={`bg-secondary text-white rounded-lg font-nunito-sans inline-block mt-5 text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                        href="/bto_order_list"
                    >
                        Back
                    </Link>
                </div>
            </ContentPanel>
            <ImageViewer
                show={handleImageView}
                onClose={handleCloseImageView}
                selectedImage={clickedImage}
                isReceipt={isReceipt}
            />
        </>
    );
};

export default OrderListView;
