<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderList extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $filterable = [
        'status',
        'reference_number',
        'customer_name',
        'order_qty',
        'stores_id',
        'phone_number',
        'order_date',
        'item_master_id',
    ];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if($field === 'item_master_id') {
                        $query->orWhereHas('itemMaster', function ($query) use ($search) {
                            $query->where('digits_code', 'LIKE', "%$search%")
                            ->orWhere('part_number', 'LIKE', "%$search%")
                            ->orWhere('item_description', 'LIKE', "%$search%")
                            ->orWhere('uom', 'LIKE', "%$search%")
                            ->orWhere('brand', 'LIKE', "%$search%")
                            ->orWhere('srp', 'LIKE', "%$search%")
                            ->orWhere('store_cost', 'LIKE', "%$search%");
                        });
                    }
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

    public function itemMaster()
    {
        return $this->belongsTo(ItemMaster::class, 'item_master_id', 'id');
    }

    public static function generateReferenceNumber()
    {
        $maxId = self::max('id'); 
        $nextId = $maxId + 1; 
        return 'BTO' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
    
}