<?php
namespace App\Http\Controllers\ItemMaster;

use App\Exports\ItemMasterExport;
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
use Maatwebsite\Excel\Facades\Excel;

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


}

?>