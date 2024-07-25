import { Head, Link } from '@inertiajs/react'
import React, { useContext, useEffect } from 'react'
import ContentPanel from '../../Components/Table/ContentPanel'
import InputComponent from '../../Components/Forms/Input'
import moment from 'moment'
import { NavbarContext } from "../../Context/NavbarContext";

const OrderListView = ({order_details}) => {
    const { setTitle } = useContext(NavbarContext);

    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Order List - Details");
        }, 5);
    }, []);
  return (
    <>
        <Head title='BTO Order List - Details'/>
        <ContentPanel>
            <div className="flex flex-col sm:flex-col lg:flex-row gap-4">
                <div className="lg:w-[60%] lg:flex gap-3">
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
                            value={order_details.stores_id}
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
                    </div>
                    <div className="flex flex-col flex-1 gap-y-3">
                        <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="uom"
                            displayName='UOM'
                            value={order_details.uom}
                        />
                        <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="brand"
                            value={order_details.brand}
                        />
                        {order_details.part_number &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="part_number"
                            displayName="Part #"
                            value={order_details.part_number}
                            />
                        }
                        {order_details.store_cost &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="store_cost"
                            value={order_details.store_cost}
                            />
                        }
                       
                        {order_details.srp && 
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="srp"
                                displayName='SRP'
                                value={order_details.srp}
                            />
                        }
                        <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="order_date"
                            value={moment(order_details.order_date).format("YYYY-MM-DD")}
                        />
                     
                    </div>
                </div>
                <div className="sm:w-full lg:w-[40%] flex flex-col self-center m-4">
                    <label
                        htmlFor="input-file"
                        className="relative w-full"
                    >
                        <div
                            id="image-view"
                            className="flex flex-col justify-center items-center w-full h-[380px] rounded-2xl border-2 border-gray-400 p-7 bg-blue-50 text-center overflow-hidden"
                        >
                            <a
                                href={`/images/uploaded-images/${order_details.uploaded_file}`}
                                target="_blank"
                            >
                                <img
                                    className='w-64'
                                    src={`/images/uploaded-images/${order_details.uploaded_file}`}
                                    alt="Uploaded File"
                                />
                            </a>
                        </div>
                    </label>
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
    </>
  )
}

export default OrderListView