<?php

namespace App\Http\Controllers\Status;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class StatusController extends Controller
{

    public function getIndex(): Response
    {
        return Inertia::render('Status/Status');
    }
}

?>