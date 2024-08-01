import { Head, Link } from '@inertiajs/react'
import React, { useContext, useEffect } from 'react'
import ContentPanel from '../../Components/Table/ContentPanel'
import InputComponent from '../../Components/Forms/Input'
import moment from 'moment'
import { NavbarContext } from "../../Context/NavbarContext";
import ImageView from '../../Components/ImageView/ImageView'

const OrderListView = ({order_details, my_privilege_id}) => {
    const { setTitle } = useContext(NavbarContext);
    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Quotation - Details");
        }, 5);
    }, []);

  return (
    <>
        <Head title='BTO Quotation - Details'/>
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
                            value={order_details.store_location.location_name}
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
                        {order_details.digits_item_description &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="digits_item_description"
                            value={order_details.digits_item_description}
                            />
                        }
                        {order_details.uom &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="uom"
                            displayName='UOM'
                            value={order_details.uom}
                            />
                        }
                        
                        
                    </div>
                    <div className="flex flex-col flex-1 gap-y-3">
                        {order_details.brand &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="brand"
                            value={order_details.brand}
                            />
                        } 
                        {order_details.part_number &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="part_number"
                            displayName="Part #"
                            value={order_details.part_number}
                            />
                        }
                        {order_details.supplier_cost &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="supplier_cost"
                            value={order_details.supplier_cost}
                            />
                        }
                        {order_details.digits_code &&
                            <InputComponent
                            extendClass="w-full"
                            is_disabled={true}
                            name="digits_code"
                            value={order_details.digits_code}
                            />
                        }
                        {[1, 6, 7].includes(my_privilege_id) && order_details.estimated_store_cost && (
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="estimated_store_cost"
                                value={order_details.estimated_store_cost}
                            />
                        )}
                        {[1, 6, 7].includes(my_privilege_id) && order_details.estimated_landed_cost && (
                            <InputComponent
                                extendClass="w-full"
                                is_disabled={true}
                                name="estimated_landed_cost"
                                value={order_details.estimated_landed_cost}
                            />
                        )}
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
                <div className="sm:w-full lg:w-[40%] flex flex-col m-4 space-y-3">
                    <ImageView imageTitle="Original Image" path={order_details.original_uploaded_file}/>
                    <ImageView imageTitle="Final Image" path={order_details.final_uploaded_file}/>
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