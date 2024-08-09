<?php

namespace App\Http\Controllers\OrderList;

use Ramsey\Uuid\Uuid;
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
use Illuminate\Support\Facades\Http;

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
            // 'order_qty' => 'required|integer',
            'item_description' => 'required|string|max:500',
            'phone_number' => 'required|string|regex:/^\+?[0-9\s\-]{10,11}$/',
            'original_uploaded_file' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);
    
        $uuid = Uuid::uuid4()->toString();
        $data = [
            'reference_number' => OrderList::generateReferenceNumber(),
            'customer_name' => $request->customer_name,
            'order_qty' => 1,
            'item_description' => $request->item_description,
            'phone_number' => $request->phone_number,
            'stores_id' => CommonHelpers::myLocationId(),
            'original_uploaded_file' => $uuid . '_' . $request->original_uploaded_file->getClientOriginalName(),
            'created_by' => CommonHelpers::myId(),
            'order_date' => date('Y-m-d H:i:s'),
        ];
        if ($request->hasFile('original_uploaded_file')) {
            $file = $request->file('original_uploaded_file');  
            $filename = $uuid . '_' . $file->getClientOriginalName();  
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
        if ($data['my_privilege_id'] == 6 && $data['status'] == 'For PO'){
            return Inertia::render('OrderList/EditMerchandisingPO', $data);
        } else if ($data['my_privilege_id'] == 6 && $data['status'] == 'For DR'){
            return Inertia::render('OrderList/EditMerchandisingDR', $data);
        }else if ($data['my_privilege_id'] == 6) {
            return Inertia::render('OrderList/EditMerchandising', $data);
        } else if ($data['my_privilege_id'] == 7) {
            return Inertia::render('OrderList/EditAccounting', $data);
        }else if (in_array($data['my_privilege_id'], [3,4,5]) && $data['status'] == 'For Payment'){
            return Inertia::render('OrderList/EditStore', $data);
        }else if (in_array($data['my_privilege_id'], [3,4,5]) && $data['status'] == 'For Claim') {
            return Inertia::render('OrderList/ForClaimStore', $data);
        }
    }
    

    public function editSave(Request $request) {
        // dd($request->all());
        $orderList = OrderList::find($request->order_list_id);
        $isPartNumberExisting = ItemMaster::where('part_number', $request->part_number)->first();
        $itemMasterPartNumberExisting = ItemMaster::where('part_number',  $orderList->part_number)->first();   
        if ($orderList->status == OrderList::forPartNumber) {

            $request->validate([
                'supplier_cost' => 'required|regex:/^\d+(\.\d{1,2})?$/|max:15',
                'cash_price' => 'required|regex:/^\d+(\.\d{1,2})?$/|max:15',
            ]);

            $updateData = [
                'status' => OrderList::forCosting,
                'part_number' => $request->part_number,
                'supplier_cost' => $request->supplier_cost,
                'cash_price' => $request->cash_price,
                'updated_by_mcb' => CommonHelpers::myId(),
                'updated_by_mcb_date' => date('Y-m-d H:i:s'),
            ];
            
            if ($isPartNumberExisting) {
                $updateData['digits_item_description'] = $isPartNumberExisting->item_description;
                $updateData['digits_code'] = $isPartNumberExisting->digits_code;
            }
            
            $orderList->update($updateData);

        }else if ($orderList->status == OrderList::forCosting) {

            $request->validate([
                'estimated_store_cost' => 'required|regex:/^\d+(\.\d{1,2})?$/|max:15',
                'estimated_landed_cost' => 'required|regex:/^\d+(\.\d{1,2})?$/|max:15',
                'estimated_srp' => 'required|regex:/^\d+(\.\d{1,2})?$/|max:15',
            ]);

            $orderList->update([
                'status' => OrderList::forSRP,
                'estimated_store_cost' => $request->estimated_store_cost,
                'estimated_landed_cost' => $request->estimated_landed_cost,
                'estimated_srp' => $request->estimated_srp,
                'updated_by_acctg' => CommonHelpers::myId(),
                'updated_by_acctg_date' => date('Y-m-d H:i:s'),
                 ]);
                
        }else if ($orderList->status == OrderList::forSRP) {

            $request->validate([
                'final_srp' => 'required|regex:/^\d+(\.\d{1,2})?$/|max:15',
            ]);

            $uuid = Uuid::uuid4()->toString();

            $orderList->update([
                'status' => OrderList::forPayment,
                'final_srp' => $request->final_srp,
                'updated_by_mcb2' => CommonHelpers::myId(),
                'updated_by_mcb_date2' => date('Y-m-d H:i:s'),
                'final_uploaded_file' => $uuid . '_' . $request->final_uploaded_file->getClientOriginalName(),
                ]);

             if ($request->hasFile('final_uploaded_file')) {
                 $file = $request->file('final_uploaded_file');  
                 $filename = $uuid . '_' . $file->getClientOriginalName();  
                 $file->move(public_path('images/uploaded-images'), $filename);  
             }
           
        }else if ($orderList->status == OrderList::forPayment) {

            $data = [
                'updated_by_store' => CommonHelpers::myId(),
                'updated_by_store_date' => date('Y-m-d H:i:s'),
            ];
            
            if ($request->action == 'Void') {

                $data['status'] = OrderList::voided; 
                
                $orderList->update($data);

                $responseData = ['message' => 'Order Voided successfully', 'status' => 'success'];   

                return redirect('/bto_order_list')->with($responseData);
                
            } else {

                if (!$itemMasterPartNumberExisting) {

                    $dataToPush = [
                        'supplier_item_code' => $orderList->part_number,
                        'item_description' => $orderList->item_description,
                        // 'store_cost' => $orderList->estimated_store_cost,
                        // 'estimated_landed_cost' => $orderList->estimated_landed_cost,
                        // 'supplier_cost' => $orderList->supplier_cost,
                        // 'srp' => $orderList->final_srp,
                        'has_serial' => 0,
                        'imei_code1' => 0,
                        'imei_code2' => 0,
                        'warranty_duration' => 1,
                        'created_by' => 1,
                        
                    ];

                    $response = self::pushItemToDimfs(config('services.item_master.create'), $dataToPush);
                    if(array_key_exists('id', $response)) {

                        ItemMaster::insert([
                            'part_number' => $orderList->part_number,
                            'item_description' => $orderList->item_description,
                            'store_cost' => $orderList->estimated_store_cost,
                            'srp' => $orderList->final_srp,
                            'created_at' => date('Y-m-d H:i:s'),
                            
                        ]);

                        $uuid = Uuid::uuid4()->toString();

                        if ($request->hasFile('uploaded_receipt1')) {
                            $data['status'] = OrderList::forPO; 
                            $data['uploaded_receipt1'] = $uuid . '_' . $request->uploaded_receipt1->getClientOriginalName();
                            $file = $request->file('uploaded_receipt1');  
                            $filename = $uuid . '_' . $file->getClientOriginalName();  
                            $file->move(public_path('images/uploaded-receipts'), $filename);  
                        }
                        
                        $orderList->update($data);
            
                        $responseData = ['message' => 'Order Update Successfully and Success in pushing data to DIMFS', 'status' => 'success'];   

                        return redirect('/bto_order_list')->with($responseData);
                    }else {

                        $responseData = ['message' => 'Error in pushing data to DIMFS', 'status' => 'error'];   
                        return back()->with($responseData);
                    }

                }else {
                    $uuid = Uuid::uuid4()->toString();
                    if ($request->hasFile('uploaded_receipt1')) {
                        $data['status'] = OrderList::forPO; 
                        $data['uploaded_receipt1'] = $uuid . '_' . $request->uploaded_receipt1->getClientOriginalName();
                        $file = $request->file('uploaded_receipt1');  
                        $filename = $uuid . '_' . $file->getClientOriginalName();  
                        $file->move(public_path('images/uploaded-receipts'), $filename);  
                    }
                    $orderList->update($data);
                    
                    $responseData = ['message' => 'Order Update Successfully!', 'status' => 'success'];   

                    return redirect('/bto_order_list')->with($responseData);
                }
                
            }

     
        }else if ($orderList->status == OrderList::forPO) {
            $data = [
                'status' => OrderList::forDR,
                'po_number' => $request->po_number,
                'po_by_mcb' => CommonHelpers::myId(),
                'po_by_mcb_date' => date('Y-m-d H:i:s')
            ];
            $orderList->update($data);
        }else if ($orderList->status == OrderList::forDR) {
            $data = [
                'status' => OrderList::forClaim,
                'dr_number' => $request->dr_number,
                'dr_by_mcb' => CommonHelpers::myId(),
                'dr_by_mcb_date' => date('Y-m-d H:i:s')
            ];
            $orderList->update($data);
        }else if ($orderList->status == OrderList::forClaim) {

            $uuid = Uuid::uuid4()->toString();

            $data = [
                'status' => OrderList::closed,
                'uploaded_receipt2' => $uuid . '_' . $request->uploaded_receipt2->getClientOriginalName(),
                'updated_by_store2' => CommonHelpers::myId(),
                'updated_by_store_date2' => date('Y-m-d H:i:s')
            ];


            if ($request->hasFile('uploaded_receipt2')) {
                $file = $request->file('uploaded_receipt2');  
                $filename = $uuid . '_' . $file->getClientOriginalName();  
                $file->move(public_path('images/uploaded-receipts'), $filename);  
            }

            $orderList->update($data);
        }
        
        return redirect ('/bto_order_list');
    }

    public function pushItemToDimfs($url, $data) {
        $secretKey = config('services.item_master.key');
        $uniqueString = time();
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        if($userAgent == '' || is_null($userAgent)){
            $userAgent = config('item-api.user_agent');
        }
        $xAuthorizationToken = md5( $secretKey . $uniqueString . $userAgent);
        $xAuthorizationTime = $uniqueString;

        $response = $apiItems = Http::withHeaders([
            'X-Authorization-Token' => $xAuthorizationToken,
            'X-Authorization-Time' => $xAuthorizationTime,
            'User-Agent' => $userAgent
        ])->post($url, $data);

        // dd($response->body());
        // dd([
        //     'url' => $url,
        //     'data' => $data,
        //     'response_status' => $response->status(),
        //     'response_body' => $response->body()
        // ]);

        return json_decode($apiItems->body(),true);
        }
        

    public function export(Request $request)
    {

        $filename = "BTO Order List - " . date ('Y-m-d H:i:s');

        $data = OrderList::getAllData();

        return Excel::download(new OrderListExport($data), $filename . '.xlsx');
    }

}

?>