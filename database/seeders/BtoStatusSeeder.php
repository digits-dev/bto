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
                'status_name' => 'Closed',
                'color' => '#1C6D1F',
                'status' => '1',
            ]
          
        ];

        foreach ($data as $status) {
            DB::table('bto_statuses')->updateOrInsert(['status_name' => $status['status_name']], $status);
        }
    }
}
