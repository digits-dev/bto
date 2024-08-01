import React, { useContext, useEffect } from 'react'
import { NavbarContext } from "../../Context/NavbarContext";
import { Head, Link } from '@inertiajs/react';
import ContentPanel from '../../Components/Table/ContentPanel';
import ImageView from '../../Components/ImageView/ImageView';
import InputComponent from '../../Components/Forms/Input';
import moment from 'moment'
import TableButton from '../../Components/Table/Buttons/TableButton';

const EditStore = ({order_list, status, store_name}) => {
    const { setTitle } = useContext(NavbarContext);
    useEffect(() => {
        setTimeout(() => {
            setTitle("BTO Edit Quotation Form");
        }, 5);
    }, []);
  return (
    <>
      <Head title='Edit Form'/>
      <ContentPanel>
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
                 {order_list.digits_item_description &&
                    <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="digits_item_description"
                    value={order_list.digits_item_description}
                    />
                }
              </div>
              <div className="flex flex-col flex-1 gap-y-3">
                {order_list.uom &&
                    <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="uom"
                    displayName='UOM'
                    value={order_list.uom}
                    />
                }
                {order_list.brand &&
                    <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="brand"
                    value={order_list.brand}
                    />
                } 
                {order_list.part_number &&
                    <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="part_number"
                    displayName="Part #"
                    value={order_list.part_number}
                    />
                }
                {order_list.digits_code &&
                    <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="digits_code"
                    value={order_list.digits_code}
                    />
                }
                {order_list.srp && 
                    <InputComponent
                        extendClass="w-full"
                        is_disabled={true}
                        name="srp"
                        displayName='SRP'
                        value={order_list.srp}
                    />
                }
                <InputComponent
                    extendClass="w-full"
                    is_disabled={true}
                    name="order_date"
                    value={moment(order_list.order_date).format("YYYY-MM-DD")}
                />
              </div>
            </div>
          <div className="sm:w-full lg:w-[40%] flex flex-col m-4 space-y-3">
              <ImageView imageTitle="Original Image" path={order_list.original_uploaded_file}/>
              <ImageView imageTitle="Final Image" path={order_list.final_uploaded_file}/>
          </div>
        </div>
        <div className='space-x-2'>
            <Link
                className={`bg-secondary text-white rounded-lg font-nunito-sans inline-block mt-5 text-sm border border-secondary px-5 py-2 hover:opacity-80`}
                href="/bto_order_list"
            >
                Back
            </Link>
            <TableButton
            extendClass="mt-4"
            type="submit"
            >
                Cancel
            </TableButton>
            <TableButton
            extendClass="mt-4"
            type="submit"
            >
                Close
            </TableButton>
        </div>
      </ContentPanel>
    </>
  )
}

export default EditStore