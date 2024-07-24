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
        'stores_id', 
        'phone_number', 
        'status', 
        'part_number',
        'srp',
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
                        $query->orWhereHas('btoStore', function ($query) use ($search) {
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