<?php

namespace App\Imports;

use App\Models\StoreLocation;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class StoreLocationImport implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
    public function model(array $row)
    {

        $exists = DB::table('store_locations')->where('location_name', $row['location_name'])->first();

        if($exists) {
            return null;
        }

        return new StoreLocation([
            'location_name' => $row['location_name'],
        ]);

    }


    public function rules(): array
    {
        return [ 
            '*.location_name' => 'required',
        ];
    }
}
