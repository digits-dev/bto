<?php

namespace App\Imports;

use App\Models\BtoStatus;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class BtoStatusImport implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
    public function model(array $row)
    {

        $exists = DB::table('bto_statuses')->where('status_name', $row['status_name'])->first();

        if($exists) {
            return null;
        }

        return new BtoStatus([
            'status_name' => $row['status_name'],
            'color' => $row['color'],
        ]);

    }


    public function rules(): array
    {
        return [ 
            '*.status_name' => 'required',
            '*.color' => 'required',
        ];
    }
}
