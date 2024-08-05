<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BtoStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'status_name' => 'For Part # Input',
                'color' => '#BB5318',
                'status' => '1',
            ],
            [
                'status_name' => 'For Costing',
                'color' => '#244665',
                'status' => '1',
            ],
            [
                'status_name' => 'For SRP',
                'color' => '#96260E',
                'status' => '1',
            ],
            [
                'status_name' => 'For Payment',
                'color' => '#fb6341',
                'status' => '1',
            ],
            [
                'status_name' => 'Closed',
                'color' => '#1C6D1F',
                'status' => '1',
            ],
            [
                'status_name' => 'Voided',
                'color' => '#682f22',
                'status' => '1',
            ],
            [
                'status_name' => 'For PO',
                'color' => '#39afb1',
                'status' => '1',
            ],
            [
                'status_name' => 'For DR',
                'color' => '#4a41c8',
                'status' => '1',
            ],
            [
                'status_name' => 'For Claim',
                'color' => '#317d40',
                'status' => '1',
            ],
          
        ];

        foreach ($data as $status) {
            DB::table('bto_statuses')->updateOrInsert(['status_name' => $status['status_name']], $status);
        }
    }
}
