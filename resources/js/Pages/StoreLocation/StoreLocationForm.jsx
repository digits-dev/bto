import { useForm } from '@inertiajs/react';
import React from 'react'
import InputComponent from '../../Components/Forms/Input';
import Select from '../../Components/Forms/Select';


const StoreLocationForm = ({action, handleShow, updateFormValues}) => {
    const { data, setData, processing, reset, post, put, errors } = useForm({
        location_name: updateFormValues?.location_name || '',
        status: updateFormValues?.status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if(action == 'edit'){
            put(`/store_location/${updateFormValues?.currentId}`, {onSuccess: ()=>{handleShow(); reset()}});
        } else {
            post('/store_location', {onSuccess: ()=>{handleShow(); reset()}});
        }
    }

  return (
    <>
        <form className='space-y-4' onSubmit={handleSubmit}>
            <InputComponent name="location_name" value={data.location_name} onChange={e => setData('location_name', e.target.value)}/>
            {errors.location_name && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.location_name}</em></span>}

            {action == 'edit' &&  
                <Select name="status" 
                    value={data.status} 
                    onChange={e => setData('status', e.target.value)} 
                    options={[{id:1, name:'Active'}, {id:0, name:'Inactive'}]} 
                    selectedId={data.status}
                />
            }
            {errors.status && <span className='mt-1 inline-block text-red-400 font-base'><em>{errors.status}</em></span>}
           
            <button
                type="submit"
                className="bg-primary w-full text-white font-nunito-sans  py-2 text-sm font-bold rounded-md mt-5 hover:opacity-70"
                disabled={processing}
            >
                {action == 'edit' ? processing ? "Updating..." : "Update" : processing ? "Submitting..." : "Submit"}
            </button>
        </form>
    </>
  )
}

export default StoreLocationForm