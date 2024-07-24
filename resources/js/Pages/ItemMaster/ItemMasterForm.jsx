import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';

const ItemMasterForm = ({action, handleShow, updateFormValues}) => {
    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: updateFormValues?.id || '',
        digits_code: updateFormValues?.digits_code || '',
        part_number: updateFormValues?.part_number || '',
        item_description: updateFormValues?.item_description || '', 
        srp: updateFormValues?.srp || '',
        store_cost: updateFormValues?.store_cost || '',
    });

    
    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/item_master/${updateFormValues?.id}`, {onSuccess: ()=>{handleShow(); reset()}});
        } else {
            post('/item_master', {onSuccess: ()=>{handleShow(); reset()}});
        }
    }


  return (
    <>
        <form className='flex flex-col' onSubmit={handleSubmit}>
            <div className='space-y-4'>
                <InputComponent name="digits_code" value={data.digits_code} onChange={e => setData('digits_code', e.target.value)} placeholder="Enter Digits Code"/>
                {errors.digits_code && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.digits_code}</em></span>}

                <InputComponent name="part_number" value={data.part_number} onChange={e => setData('part_number', e.target.value)} placeholder="Enter Part Number"/>
                {errors.part_number && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.part_number}</em></span>}

                <InputComponent name="item_description" value={data.item_description} onChange={e => setData('item_description', e.target.value)} placeholder="Enter Item Description"/>
                {errors.item_description && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.item_description}</em></span>}

                <InputComponent name="srp" value={data.srp} type="number" onChange={e => setData('srp', e.target.value)} placeholder="Enter Current SRP"/>
                {errors.srp && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.srp}</em></span>}

                <InputComponent name="store_cost" type="number" value={data.store_cost} onChange={e => setData('store_cost', e.target.value)} placeholder="Enter Store Cost"/>
                {errors.store_cost && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.store_cost}</em></span>}
            </div>

            <button
                type="submit"
                className="bg-primary w-full text-white font-nunito-sans mt-10  py-3 text-sm font-bold rounded-md hover:opacity-70"
                disabled={processing}
            >
                {action == 'edit' ? processing ? "Updating..." : "Update" : processing ? "Submitting..." : "Submit"}
            </button>
        </form>
    </>
  )
}

export default ItemMasterForm