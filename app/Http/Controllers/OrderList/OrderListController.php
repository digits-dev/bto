<?php

namespace App\Http\Controllers\OrderList;

use App\Http\Controllers\Controller;
use App\Models\OrderList;
use Inertia\Inertia;
use Inertia\Response;

class OrderListController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData()
    {
        $query = OrderList::query();

        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }

    public function getIndex(): Response
    {
        $data = [];
        $data['orders'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('OrderList/OrderList', $data);
    }
}

?>