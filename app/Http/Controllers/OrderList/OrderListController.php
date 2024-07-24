<?php

namespace App\Http\Controllers\OrderList;

use App\Http\Controllers\Controller;
use App\Models\OrderList;
use App\Models\StoreLocation;
use App\Models\BtoStatus;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Helpers\CommonHelpers;

class OrderListController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    private const forSRP = 2;
    private const closed = 3;
    private const ForCosting = 4;
    

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData()
    {
        $query = OrderList::query()->with(['btoStatus:id,status_name,color', 'storeLocation:id,location_name']);

        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }

    public function getIndex(): Response
    {
        $data = [];
        $data['orders'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['my_privilege_id'] = CommonHelpers::myPrivilegeId();
        $data['queryParams'] = request()->query();

        return Inertia::render('OrderList/OrderList', $data);

    }

    public function add() {
        $data = [];
        $data['store_name'] = StoreLocation::get();

        return Inertia::render('OrderList/add', $data);
    }
    
    public function addSave(Request $request) {

        $validatedData = $request->validate([
            'customer_name' => 'required|string|max:255',
            'order_qty' => 'required|integer|min:1',
            'item_description' => 'required|string|max:500',
            'phone_number' => 'required|string|regex:/^\+?[0-9\s\-]{10,11}$/',
            'uploaded_file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stores_id' => 'required|integer|min:1',
        ]);

        
        $data = [
            'reference_number' => OrderList::generateReferenceNumber(),
            'customer_name' => $request->customer_name,
            'order_qty' => $request->order_qty,
            'item_description' => $request->item_description,
            'phone_number' => $request->phone_number,
            'stores_id' => $request->stores_id,
            'uploaded_file' => time() . '_' . $request->uploaded_file->getClientOriginalName(),
            'created_by' => CommonHelpers::myId(),
            'order_date' => date('Y-m-d H:i:s'),
        ];
        if ($request->hasFile('uploaded_file')) {
            $file = $request->file('uploaded_file');  
            $filename = time() . '_' . $file->getClientOriginalName();  
            $file->move(public_path('images/uploaded-images'), $filename);  
        }
        
            OrderList::create($data);
        
        return redirect ('/bto_order_list');
    }

    public function edit($id) {
        $data = [];
        $data['order_list'] = OrderList::find($id);
        $data['status'] = BtoStatus::where('id', $data['order_list']->status)->first()->status_name;
        $data['my_privilege_id'] = CommonHelpers::myPrivilegeId();
        return Inertia::render('OrderList/edit', $data);
    }

    public function editSave(Request $request) {

        OrderList::where('id', $request->order_list_id)
        ->update([
            'status' => self::ForCosting,
            'part_number' => $request->part_number,
            'updated_by_mcb' => CommonHelpers::myId(),
            'updated_by_mcb_date' => date('Y-m-d H:i:s'),
             ]);
    
        return redirect ('/bto_order_list');
    }
}

?>