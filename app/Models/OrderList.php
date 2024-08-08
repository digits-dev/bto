<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderList extends Model
{
    use HasFactory;

    const forPartNumber = 1;
    const forCosting = 2;
    const forSRP = 3;
    const forPayment = 4;
    const closed = 5;
    const voided = 6;
    const forPO = 7;
    const forDR = 8;
    const forClaim = 9;

    protected $guarded = [];

    protected $filterable = [
        'status',
        'reference_number',
        'customer_name',
        'order_qty',
        'stores_id',
        'phone_number',
        'item_description',
        'digits_item_description',
        'uom',
        'brand',
        'supplier_cost',
        'part_number',
        'digits_code',
        'estimated_store_cost',
        'estimated_landed_cost',
        'final_srp',
        'order_date',
    ];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if($field === 'status') {
                        $query->orWhereHas('btoStatus', function ($query) use ($search) {
                            $query->where('status_name', 'LIKE', "%$search%");
                        });
                    }
                    if($field === 'stores_id') {
                        $query->orWhereHas('storeLocation', function ($query) use ($search) {
                            $query->where('location_name', 'LIKE', "%$search%");
                        });
                    }
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

    public function btoStatus(){
        return $this->belongsTo(BtoStatus::class, 'status', 'id');
    }
    
    public function storeLocation()
    {
        return $this->belongsTo(StoreLocation::class, 'stores_id', 'id');
    }

    public static function generateReferenceNumber()
    {
        $maxId = self::max('id'); 
        $nextId = $maxId + 1; 
        return 'BTO' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
    
}