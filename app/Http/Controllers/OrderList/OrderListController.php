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
    private const forPayment = 4;
    private const closed = 5;
    private const cancelled = 6;
    

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData()
    {
        $privilegeIds = CommonHelpers::myPrivilegeId();
    
        if (in_array($privilegeIds, [1, 6, 7])) {
            $query = OrderList::query()->with([
                'btoStatus:id,status_name,color',
                'storeLocation:id,location_name'
            ]);
        } else {
            $query = OrderList::query()->with([
                'btoStatus:id,status_name,color',
                'storeLocation:id,location_name',
            ])->where('stores_id', CommonHelpers::myLocationId());
        }


        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }

    public function getIndex(): Response
    {
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        
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
        $data['order_details'] =  OrderList::with([
            'btoStatus:id,status_name,color',
            'storeLocation:id,location_name',
        ])->findOrFail($id);
        $data['my_privilege_id'] = CommonHelpers::myPrivilegeId();

        return Inertia::render('OrderList/OrderListView', $data);

    }

    public function add() {
        $data = [];
        $data['store_name'] = StoreLocation::where('id', CommonHelpers::myLocationId())->first()->location_name;

        return Inertia::render('OrderList/AddForm', $data);
    }
    
    public function addSave(Request $request) {
        
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'order_qty' => 'required|integer|min:1',
            'item_description' => 'required|string|max:500',
            'phone_number' => 'required|string|regex:/^\+?[0-9\s\-]{10,11}$/',
            'original_uploaded_file' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);
    
        $data = [
            'reference_number' => OrderList::generateReferenceNumber(),
            'customer_name' => $request->customer_name,
            'order_qty' => $request->order_qty,
            'item_description' => $request->item_description,
            'phone_number' => $request->phone_number,
            'stores_id' => CommonHelpers::myLocationId(),
            'original_uploaded_file' => time() . '_' . $request->original_uploaded_file->getClientOriginalName(),
            'created_by' => CommonHelpers::myId(),
            'order_date' => date('Y-m-d H:i:s'),
        ];
        if ($request->hasFile('original_uploaded_file')) {
            $file = $request->file('original_uploaded_file');  
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
    
        if ($data['my_privilege_id'] == 6) {
            return Inertia::render('OrderList/EditMerchandising', $data);
        } 
        else if ($data['my_privilege_id'] == 7) {
            return Inertia::render('OrderList/EditAccounting', $data);
        }
        else {
            return Inertia::render('OrderList/EditStore', $data);
        }
    }
    

    public function editSave(Request $request) {
        $orderList = OrderList::find($request->order_list_id);
        $isPartNumberExisting = ItemMaster::where('part_number', $request->part_number)->first();
        $itemMasterPartNumberExisting = ItemMaster::where('part_number',  $orderList->part_number)->first();   
        if ($orderList->status == self::forPartNumber) {

            $updateData = [
                'status' => self::forCosting,
                'part_number' => $request->part_number,
                'supplier_cost' => $request->supplier_cost,
                'updated_by_mcb' => CommonHelpers::myId(),
                'updated_by_mcb_date' => date('Y-m-d H:i:s'),
            ];
            
            if ($isPartNumberExisting) {
                $updateData['digits_item_description'] = $isPartNumberExisting->item_description;
                $updateData['digits_code'] = $isPartNumberExisting->digits_code;
            }
            
            $orderList->update($updateData);

        }else if ($orderList->status == self::forCosting) {
         
            $orderList->update([
                'status' => self::forSRP,
                'estimated_store_cost' => $request->estimated_store_cost,
                'estimated_landed_cost' => $request->estimated_landed_cost,
                'updated_by_acctg' => CommonHelpers::myId(),
                'updated_by_acctg_date' => date('Y-m-d H:i:s'),
                 ]);
                
            // if ($itemMasterPartNumberExisting) {
            //     ItemMaster::where('part_number', $orderList->part_number)->update([
            //         'store_cost' => $request->store_cost,
            //     ]);
            // }
        
        }else if ($orderList->status == self::forSRP) {
            $orderList->update([
                'status' => self::forPayment,
                'srp' => $request->srp,
                'updated_by_mcb2' => CommonHelpers::myId(),
                'updated_by_mcb_date2' => date('Y-m-d H:i:s'),
                'final_uploaded_file' => time() . '_' . $request->final_uploaded_file->getClientOriginalName(),
                 ]);

             if ($request->hasFile('final_uploaded_file')) {
                 $file = $request->file('final_uploaded_file');  
                 $filename = time() . '_' . $file->getClientOriginalName();  
                 $file->move(public_path('images/uploaded-images'), $filename);  
             }
           
                if (!$itemMasterPartNumberExisting) {
                    ItemMaster::insert([
                        'part_number' => $orderList->part_number,
                        'item_description' => $orderList->item_description,
                        'store_cost' => $orderList->estimated_store_cost,
                        'srp' => $request->srp,
                        'created_at' => date('Y-m-d H:i:s'),
                    ]);
                }
        }else if ($orderList->status == self::forPayment) {
            
            $data = [
                'updated_by_store' => CommonHelpers::myId(),
                'updated_by_store_date' => date('Y-m-d H:i:s'),
            ];
            
            if ($request->action == 'Close') {
                $data['status'] = self::closed; 
            } else {
                $data['status'] = self::cancelled; 
            }
            $orderList->update($data);

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