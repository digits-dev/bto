<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmMenus extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        self::submasterMenu();
        self::mainMenu();
    }

    public function submasterMenu() {
     
    }

    public function mainMenu() {
        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Dashboard',
            ],
            [
                'name'              => 'Dashboard',
                'type'              => 'Route',
                'path'              => 'Dashboard\DashboardControllerGetIndex',
                'slug'              => 'dashboard',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 1,
                'id_adm_privileges'  => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'BTO Order List',
            ],
            [
                'name'              => 'BTO Order List',
                'type'              => 'Route',
                'path'              => 'OrderList\OrderListControllerGetIndex',
                'slug'              => 'bto_order_list',
                'color'             => NULL,
                'icon'              => 'fa-solid fa-list-ul',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges'  => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'BTO IMFS',
            ],
            [
                'name'              => 'BTO IMFS',
                'type'              => 'Route',
                'path'              => 'BtoImfs\BtoImfsControllerGetIndex',
                'slug'              => 'bto_imfs',
                'color'             => NULL,
                'icon'              => 'fa-solid fa-table-list',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges'  => 1,
                'sorting'           => 2
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Submaster',
            ],
            [
                'name'              => 'Submaster',
                'type'              => 'URL',
                'path'              => '#',
                'slug'              => NULL,
                'color'             => NULL,
                'icon'              => 'fa-solid fa-bars',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges'  => 1,
                'sorting'           => 3
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Item Master',
            ],
            [
                'name'              => 'Item Master',
                'type'              => 'Route',
                'path'              => 'ItemMaster\ItemMasterControllerGetIndex',
                'slug'              => 'item_master',
                'color'             => NULL,
                'icon'              => 'fa-solid fa-box-open',
                'parent_id'         => 4,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges'  => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'BTO Status',
            ],
            [
                'name'              => 'BTO Status',
                'type'              => 'Route',
                'path'              => 'Status\StatusControllerGetIndex',
                'slug'              => 'status',
                'color'             => NULL,
                'icon'              => 'fa-solid fa-check',
                'parent_id'         => 4,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges'  => 1,
                'sorting'           => 2
            ]
        );
        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'BTO Store Location',
            ],
            [
                'name'              => 'BTO Store Location',
                'type'              => 'Route',
                'path'              => 'StoreLocation\StoreLocationControllerGetIndex',
                'slug'              => 'store_location',
                'color'             => NULL,
                'icon'              => 'fa-solid fa-location-dot',
                'parent_id'         => 4,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges'  => 1,
                'sorting'           => 3
            ]
        );

       


    }

}