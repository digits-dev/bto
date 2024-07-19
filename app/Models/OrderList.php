<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderList extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $filterable = [
        'customer_name', 
        'order_qty', 
        'store_name', 
        'phone_number', 
        'status', 
        'part_no',
        'srp',
        'order_date',
    ];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    // if($field === 'enrollment_status') {
                    //     $query->orWhereHas('status', function ($query) use ($search) {
                    //         $query->where('enrollment_status', 'LIKE', "%$search%");
                    //     });
                    // }
                    $query->orWhere($field, 'LIKE', "%$search%");
                }
            });
        }

        foreach ($this->filterable as $field) {
            if ($request->filled($field)) {
                $value = $request->input($field);
                $query->where($field, 'LIKE', "%$value%");
            }
        }
    
        return $query;
    }
}
