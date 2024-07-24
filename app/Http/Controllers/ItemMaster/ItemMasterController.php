<?php
namespace App\Http\Controllers\ItemMaster;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\ItemMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;

    
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

        $query = ItemMaster::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('status_name', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));

        $data = [];
        $data['itemMaster'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia("ItemMaster/ItemMaster", $data);
    }

    public function store(Request $request){

        $request->validate([
            'digits_code' => 'required',
            'part_number' => 'required|unique:item_masters,part_number',
            'item_description' => 'required',
            'srp' => 'required',
            'store_cost' => 'required',
        ]);
        
        ItemMaster::create([
            'digits_code'=> $request->input('digits_code'), 
            'part_number' => $request->input('part_number'),
            'item_description' => $request->input('item_description'),
            'srp' => $request->input('srp'),
            'store_cost' => $request->input('store_cost'),
        ]);
    }

    public function update(Request $request, ItemMaster $itemMaster){
        $request->validate([
            'digits_code' => 'required',
            'part_number' => 'required|unique:item_masters,part_number',
            'item_description' => 'required',
            'srp' => 'required',
            'store_cost' => 'required',
        ]);

        $itemMaster->update([
            'digits_code'=> $request->input('digits_code'),  
            'part_number' => $request->input('part_number'), 
            'item_description' => $request->input('item_description'), 
            'srp' => $request->input('srp'), 
            'store_cost' => $request->input('store_cost'), 
        ]);
    }
}

?>