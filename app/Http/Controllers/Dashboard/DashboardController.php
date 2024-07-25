<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\OrderList;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    public function getIndex(): Response
    {
        // $sidebarMenus = CommonHelpers::sidebarMenu();

        $data = [];
        $data['total_orders'] = OrderList::count();
        $data['part_input'] = OrderList::where('status', 1)->count();
        $data['costing'] = OrderList::where('status', 2)->count();
        $data['srp'] = OrderList::where('status', 3)->count();
        $data['closed'] = OrderList::where('status', 4)->count();
        $data['orders_count_wdate'] = OrderList::select(DB::raw('DATE(order_date) as date'), DB::raw('count(*) as count'))
        ->groupBy('date')
        ->orderBy('date', 'desc')
        ->get();
        

        return Inertia::render('Dashboard/Dashboard', $data);
    }
}

?>