<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemMaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'digits_code',
        'part_number',
        'item_description',
        'srp',
        'store_cost',
    ];
}
