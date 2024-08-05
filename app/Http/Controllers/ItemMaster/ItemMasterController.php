<?php
namespace App\Http\Controllers\ItemMaster;

use App\Exports\ItemMasterExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\ItemMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\OrderList;
use Illuminate\Support\Facades\Http;

class ItemMasterController extends Controller{

    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'id');
        $this->sortDir = request()->get('sortDir', 'asc');
        $this->perPage = request()->get('perPage', 10);
    }


    public function getIndex(){
        
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $query = ItemMaster::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('part_number', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));

        $data = [];
        $data['itemMaster'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia("ItemMaster/ItemMaster", $data);
    }
    public function getDigitsCode(Request $request)
    {
        $partNumber = $request->input('part_number');

        $btoImf = ItemMaster::where('part_number', $partNumber)->first();

        if ($btoImf) {
            return response()->json($btoImf, 200);
        } else {
            return response()->json(['message' => 'Part number is not existing'], 404);
        }
    }

    
    public function getAllData()
    {
        return ItemMaster::select([
            'id',
            'digits_code',
            'part_number',
            'item_description',
            'srp',
            'store_cost',
        ]);
    }

    public function export()
    {
        $filename = "BTO Item Master - " . date('Y-m-d H:i:s');
        $query = $this->getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new ItemMasterExport($query), $filename . '.xlsx');
    }

    public function getItemMasterDataApi(Request $request) {
        $secretKey = config('services.item_master.key');
        $url = config('services.item_master.url');
        
        $uniqueString = time(); 
        // $userAgent = $_SERVER['HTTP_USER_AGENT']; 
   
        // if($userAgent == '' || is_null($userAgent)){
        //     $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36';    
        // }
        // Check if running from command line (CLI)
        if (php_sapi_name() == 'cli') {
            $userAgent = 'Scheduled Task';
        } else {
            $userAgent = $request->header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36');
        }
        $xAuthorizationToken = md5( $secretKey . $uniqueString . $userAgent);
        $xAuthorizationTime = $uniqueString;
        $vars = [
            "your_param"=>1
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_POST, FALSE);
        curl_setopt($ch, CURLOPT_POSTFIELDS,null);
        curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT , 30);

        $headers = [
        'X-Authorization-Token: ' . $xAuthorizationToken,
        'X-Authorization-Time: ' . $xAuthorizationTime,
        'User-Agent: '.$userAgent
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $server_output = curl_exec ($ch);
        curl_close ($ch);

        $response = json_decode($server_output, true);
        // dd( $response );
        $data = [];
        if(!empty($response["data"])) {
            foreach ($response["data"] as $key => $value) {
                DB::beginTransaction();
                try {

                    ItemMaster::where('part_number', $value['supplier_item_code'])->update([
                        'digits_code' => $value['digits_code'],
                    ]);
                    OrderList::where('part_number', $value['supplier_item_code'])->update([
                        'digits_code' => $value['digits_code'],
                    ]);
                    
                    DB::commit();
                } catch (\Exception $e) {
                    \Log::debug($e);
                    DB::rollback();
                }
                
            }
        }
        \Log::info('Item Create: executed! items');
    }
    public function getItemMasterDataApiV2($url) {
            $secretKey = config('services.item_master.key');
            $uniqueString = time();
            $userAgent = $_SERVER['HTTP_USER_AGENT'];
            if($userAgent == '' || is_null($userAgent)){
                $userAgent = config('item-api.user_agent');
            }
            $xAuthorizationToken = md5( $secretKey . $uniqueString . $userAgent);
            $xAuthorizationTime = $uniqueString;
    
            $apiItems = Http::withHeaders([
                'X-Authorization-Token' => $xAuthorizationToken,
                'X-Authorization-Time' => $xAuthorizationTime,
                'User-Agent' => $userAgent
            ])->get($url);
    
            return json_decode($apiItems->body(),true);
    }

    public function getUpdateItem(){
        //pull updated items from api
        $updatedItems = $this->getItemMasterDataApiV2(config('services.item_master.url'));
        // dd($updatedItems);
        foreach ($updatedItems['data'] ?? [] as $key => $value) {
            try {
                ItemMaster::where('part_number', $value['supplier_item_code'])->update([
                    'digits_code' => $value['digits_code'],
                ]);
                OrderList::where('part_number', $value['supplier_item_code'])->update([
                    'digits_code' => $value['digits_code'],
                ]);
                
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }

       
}
}

?>