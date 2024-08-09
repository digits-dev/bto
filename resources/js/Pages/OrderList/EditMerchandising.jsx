import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from "react";
import axios from "axios";
import { NavbarContext } from "../../Context/NavbarContext";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head, useForm, Link } from "@inertiajs/react";
import InputComponent from "../../Components/Forms/Input";
import { useToast } from "../../Context/ToastContext";
import TableButton from "../../Components/Table/Buttons/TableButton";
import ImageView from "../../Components/ImageView/ImageView";
import ImageViewer from "../../Components/ImageView/ImageViewer";
import Modal from "../../Components/Modal/Modal";

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
    const [isChecking, setIsChecking] = useState(true);
    const [isFinalSrpAbove, setIsFinalSrpAbove] = useState(false);
    const [itemDescription, setItemDescription] = useState(
        order_list.item_description
    );
    const [selectedImage, setSelectedImage] = useState(null);
    const finalSrpRef = useRef("");

    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Order Form");
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

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
            setData("final_uploaded_file", event.target.files[0]);
        }
    };
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

    const formatNumberWithCommas = (value) => {
        if (value === null || value === undefined) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const handleChange = async (e) => {
        const name = e.name ? e.name : e.target.name;
        const value = e.value ? e.value : e.target.value;

        const rawValue = value.replace(/,/g, "");

        setData((prevData) => ({
            ...prevData,
            [name]: rawValue,
        }));

        // setData(name, value);
        if (name === "part_number") {
            setIsChecking(true);
            debouncedFetchDigitsCode(value);
        } else if (name === "final_srp") {
            finalSrpRef.current = rawValue;
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        part_number: "",
        supplier_cost: order_list.supplier_cost || "",
        cash_price: order_list.cash_price || "",
        final_uploaded_file: "",
        final_srp: "",
        order_list_id: order_list.id,
    });

    useEffect(() => {
        if (finalSrpRef.current !== "") {
            const finalSrpValue = parseFloat(finalSrpRef.current);
            if (
                finalSrpValue >= parseFloat(order_list.estimated_store_cost) ||
                finalSrpValue >= parseFloat(order_list.estimated_landed_cost)
            ) {
                setIsFinalSrpAbove(true);
            } else {
                setIsFinalSrpAbove(false);
            }
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `<p class="font-nunito-sans">Are you sure that you want to  <span style="color: #10B981
            };" >UPDATE</span> this?</p>`,

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
            <form onSubmit={handleSubmit}>
                <ContentPanel>
                    <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                        <div className="lg:w-[60%] lg:flex gap-3">
                            <div className="flex flex-col flex-1 gap-y-3">
                                <InputComponent
                                    extendClass="w-full"
                                    extendClass1="border-2 bg-blue-100"
                                    is_disabled={true}
                                    name="status"
                                    value={status}
                                    isHighlight={true}
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
                                {order_list.status == 3 && (
                                    <InputComponent
                                        extendClass="w-full"
                                        placeholder="Part Number"
                                        is_disabled={
                                            !(
                                                my_privilege_id === 6 &&
                                                order_list.status == 1
                                            )
                                        }
                                        value={
                                            my_privilege_id === 6 &&
                                            order_list.status == 1
                                                ? data.part_number
                                                : order_list.part_number
                                        }
                                        displayName="Part Number"
                                        name="part_number"
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col flex-1 gap-y-3">
                                {order_list.status == 1 && (
                                    <>
                                        <InputComponent
                                            extendClass="w-full"
                                            placeholder="Part Number"
                                            is_disabled={
                                                !(
                                                    my_privilege_id === 6 &&
                                                    order_list.status == 1
                                                )
                                            }
                                            value={
                                                my_privilege_id === 6 &&
                                                order_list.status == 1
                                                    ? data.part_number
                                                    : order_list.part_number
                                            }
                                            displayName="Part Number"
                                            name="part_number"
                                            onChange={handleChange}
                                        />
                                        {partNumberMessage == "Exists" && (
                                            <div className="relative flex items-center">
                                                <span className="bg-slate-500 px-[10px] rounded-full mr-2 text-white relative group">
                                                    !
                                                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-md w-[200px] text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Part Number already
                                                        exists
                                                    </span>
                                                </span>
                                                <span className="text-sm text-red-500">
                                                    Part Number already exists
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
                                    </>
                                )}

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

                                <InputComponent
                                    extendClass="w-full"
                                    placeholder={"Supplier Cost"}
                                    is_disabled={
                                        order_list.status == 3 ? true : false
                                    }
                                    value={formatNumberWithCommas(
                                        data.supplier_cost
                                    )}
                                    name="supplier_cost"
                                    onChange={handleChange}
                                />
                                {errors.supplier_cost && (
                                    <span className="text-red-500 text-sm">
                                        {errors.supplier_cost}
                                    </span>
                                )}

                                <InputComponent
                                    extendClass="w-full"
                                    name="cash_price"
                                    placeholder={"Cash Price"}
                                    is_disabled={
                                        order_list.status == 3 ? true : false
                                    }
                                    value={formatNumberWithCommas(
                                        data.cash_price
                                    )}
                                    onChange={handleChange}
                                />
                                {errors.cash_price && (
                                    <span className="text-red-500 text-sm">
                                        {errors.cash_price}
                                    </span>
                                )}
                                <InputComponent
                                    extendClass="w-full"
                                    is_disabled={true}
                                    value="USD"
                                    displayName={"Currency"}
                                />

                                {order_list.estimated_store_cost && (
                                    <InputComponent
                                        extendClass="w-full"
                                        extendClass1={`${
                                            data.final_srp && !isFinalSrpAbove
                                                ? "!border-red-500"
                                                : ""
                                        }`}
                                        is_disabled={true}
                                        value={formatNumberWithCommas(
                                            order_list.estimated_store_cost
                                        )}
                                        displayName="Estimated Store Cost"
                                    />
                                )}

                                {order_list.estimated_landed_cost && (
                                    <InputComponent
                                        extendClass="w-full"
                                        extendClass1={`${
                                            data.final_srp && !isFinalSrpAbove
                                                ? "!border-red-500"
                                                : ""
                                        }`}
                                        is_disabled={true}
                                        value={formatNumberWithCommas(
                                            order_list.estimated_landed_cost
                                        )}
                                        displayName={"Estimated Landed Cost"}
                                    />
                                )}
                                {order_list.status == 3 && (
                                    <InputComponent
                                        extendClass="w-full"
                                        placeholder={"Estimated SRP"}
                                        name="estimated_srp"
                                        value={formatNumberWithCommas(
                                            order_list.estimated_srp
                                        )}
                                        is_disabled={true}
                                        displayName={"Estimated SRP"}
                                    />
                                )}
                                {order_list.status == 3 && (
                                    <InputComponent
                                        extendClass="w-full"
                                        extendClass1={`${
                                            data.final_srp && !isFinalSrpAbove
                                                ? "!border-red-500 focus:border-red-500"
                                                : ""
                                        }`}
                                        placeholder={"Final SRP"}
                                        name="final_srp"
                                        displayName="Final SRP"
                                        onChange={handleChange}
                                        value={formatNumberWithCommas(
                                            data.final_srp
                                        )}
                                        ref={finalSrpRef}
                                    />
                                )}
                                {errors.final_srp && (
                                    <span className="text-red-500 text-sm">
                                        {errors.final_srp}
                                    </span>
                                )}
                            </div>
                        </div>
                        {order_list.status == 1 && (
                            <div className="sm:w-full lg:w-[40%] flex flex-col self-center m-4">
                                <label
                                    htmlFor="input-file"
                                    className="relative w-full"
                                >
                                    <div
                                        onClick={() => {
                                            handleImageClick();
                                            setClickedImage(
                                                order_list.original_uploaded_file
                                            );
                                        }}
                                        id="image-view"
                                        className="flex flex-col justify-center items-center w-full h-[380px] rounded-2xl border-2 border-gray-400 p-7  bg-white text-center cursor-pointer"
                                    >
                                        <img
                                            className="w-80"
                                            src={`/images/uploaded-images/${order_list.original_uploaded_file}`}
                                            alt="Uploaded File"
                                        />
                                    </div>
                                </label>
                            </div>
                        )}
                        {order_list.status == 3 && (
                            <div className="sm:w-full lg:w-[40%] flex flex-col self-center m-4 gap-3">
                                <ImageView
                                    imageTitle="Uploaded File"
                                    path={order_list.original_uploaded_file}
                                    handleImageClick={() => {
                                        handleImageClick();
                                        setClickedImage(
                                            order_list.original_uploaded_file
                                        );
                                    }}
                                />
                                <div>
                                    <p className="font-nunito-sans font-bold text-red-400 mb-1 ">
                                        Upload Screenshot
                                    </p>
                                    <label
                                        htmlFor="input-file"
                                        className="relative w-full"
                                    >
                                        <input
                                            required
                                            id="input-file"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            className="z-0 absolute w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                        <div
                                            id="image-view"
                                            className="flex flex-col justify-center items-center w-full h-[250px] rounded-2xl border-2 border-dashed border-gray-400 p-7 cursor-pointer bg-[#f5fbff] text-center"
                                        >
                                            {selectedImage ? (
                                                <img
                                                    className="w-56"
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
                                                    <p className="text-md font-nunito-sans font-black text-upload-text-color">
                                                        Upload Image
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        File Supported: JPEG,
                                                        PNG
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        {errors.final_uploaded_file && (
                                            <span className="text-red-500">
                                                {errors.final_uploaded_file}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <span
                                    className="
                            text-red-500 font-nunito-sans text-sm text-center"
                                >
                                    Note: Please upload a screenshot of BTO
                                    build with <strong>Peso Amount</strong>{" "}
                                    price from <strong>Apple Website</strong>.
                                </span>
                            </div>
                        )}
                    </div>
                    <div>
                        <Link
                            className={`bg-secondary text-white overflow-hidden rounded-lg font-nunito-sans text-sm border border-secondary px-5 py-2 hover:opacity-80 mr-2`}
                            href="/bto_order_list"
                        >
                            Back
                        </Link>
                        <TableButton
                            disabled={
                                (order_list.status != 3 && isChecking) ||
                                (order_list.status == 3 && !isFinalSrpAbove) ||
                                processing
                            }
                            extendClass="mt-4"
                            type="submit"
                        >
                            Update
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

export default EditFormMerchandising;
