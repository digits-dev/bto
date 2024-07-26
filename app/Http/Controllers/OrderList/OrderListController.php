<?php

namespace App\Http\Controllers\OrderList;

use App\Exports\OrderListExport;
use App\Http\Controllers\Controller;
use App\Models\OrderList;
use App\Models\BtoImfs;
use App\Models\StoreLocation;
use App\Models\BtoStatus;
use App\Models\ItemMaster;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Helpers\CommonHelpers;
use Maatwebsite\Excel\Facades\Excel;

class OrderListController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    private const forPartNumber = 1;
    private const forCosting = 2;
    private const forSRP = 3;
    private const closed = 4;
    private const existing = 5;
    

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
        $data['store'] = StoreLocation::get();
        $data['status'] = BtoStatus::get();

        return Inertia::render('OrderList/OrderList', $data);

    }

    public function OrderListIndex($id){

        $data = [];
        $data['order_details'] =  OrderList::with('btoStatus:id,status_name')->findOrFail($id);

        return Inertia::render('OrderList/OrderListView', $data);

    }

    public function add() {
        $data = [];
        // $data['store_name'] = StoreLocation::get();

        return Inertia::render('OrderList/AddForm', $data);
    }
    
    public function addSave(Request $request) {
        
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'order_qty' => 'required|integer|min:1',
            'item_description' => 'required|string|max:500',
            'phone_number' => 'required|string|regex:/^\+?[0-9\s\-]{10,11}$/',
        ]);
    
        $data = [
            'reference_number' => OrderList::generateReferenceNumber(),
            'customer_name' => $request->customer_name,
            'order_qty' => $request->order_qty,
            'item_description' => $request->item_description,
            'phone_number' => $request->phone_number,
            'stores_id' => CommonHelpers::myLocationId(),
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
        $data['store_name'] = StoreLocation::where('id', $data['order_list']->stores_id)->first()->location_name;
        $data['my_privilege_id'] = CommonHelpers::myPrivilegeId();
        if (CommonHelpers::myPrivilegeId() == 6) {
            return Inertia::render('OrderList/EditMerchandising', $data);
        }else {
            return Inertia::render('OrderList/EditAccounting', $data);
        }
    }

    public function editSave(Request $request) {
        $orderList = OrderList::find($request->order_list_id);
        $isPartNumberExisting = ItemMaster::where('part_number', $request->part_number)->first();
        if ($orderList->status == self::forPartNumber) {
            if($isPartNumberExisting) {
                $orderList->update([
                    'status' => self::existing,
                    'updated_by_mcb' => CommonHelpers::myId(),
                    'updated_by_mcb_date' => date('Y-m-d H:i:s'),
                    ]);
            }else {
                $orderList->update([
                    'status' => self::forCosting,
                    'part_number' => $request->part_number,
                    'updated_by_mcb' => CommonHelpers::myId(),
                    'updated_by_mcb_date' => date('Y-m-d H:i:s'),
                ]);
            }
        }else if ($orderList->status == self::forCosting) {
            $orderList->update([
                'status' => self::forSRP,
                'store_cost' => $request->store_cost,
                'updated_by_acctg' => CommonHelpers::myId(),
                'updated_by_acctg_date' => date('Y-m-d H:i:s'),
                 ]);
        }else if ($orderList->status == self::forSRP) {
            $orderList->update([
                'status' => self::closed,
                'srp' => $request->srp,
                'updated_by_mcb2' => CommonHelpers::myId(),
                'updated_by_mcb_date2' => date('Y-m-d H:i:s'),
                 ]);

            $data = [
                'item_description' => $orderList->item_description,
                'part_number' => $orderList->part_number,
                'store_cost' => $orderList->store_cost,
                'srp' => $orderList->srp,
            ];

            ItemMaster::create($data);
        }
        
    
        return redirect ('/bto_order_list');
    }

    public function export(Request $request)
    {

        $filename = "BTO Order List - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new OrderListExport($data), $filename . '.xlsx');
    }

}

?>