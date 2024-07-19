<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    public function getIndex(): Response
    {
        $sidebarMenus = CommonHelpers::sidebarMenu();

        
        return Inertia::render('Dashboard/Dashboard', [
            'menus' => $sidebarMenus,
        ]);
    }
}

?>