<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmMenuPrivileges extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            // SUPER ADMIN
            [
                'id_adm_menus' => 1,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 3,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 4,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 5,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 6,
                'id_adm_privileges' => 1
            ],
            // MERCHANDISING
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 6
            ],
            [
                'id_adm_menus' => 3,
                'id_adm_privileges' => 6
            ],
            // ACCOUNTING
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 7
            ],
            [
                'id_adm_menus' => 3,
                'id_adm_privileges' => 7
            ],
            // STORES
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 3
            ],
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 4
            ],
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 5
            ],
           
        ];

        if (DB::table('adm_menus_privileges')->count() == 0) {
            DB::table('adm_menus_privileges')->insert($data);
        }
    }
}