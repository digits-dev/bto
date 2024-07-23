<?php
namespace App\Http\Controllers\StoreLocation;

use App\Exports\StoreLocationExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Imports\StoreLocationImport;
use App\ImportTemplates\StoreLocationTemplate;
use App\Models\StoreLocation;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class StoreLocationController extends Controller{

    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'id');
        $this->sortDir = request()->get('sortDir', 'asc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex(){

        $query = StoreLocation::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('status_name', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));

        $data = [];
        $data['storeLocation'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia("StoreLocation/StoreLocation", $data);
    }

    public function bulkUpdate(Request $request){

        $ids = $request->input('ids');
        $status = $request->input('status');

        $request->validate([
            'ids' => 'required',
            'ids.*' => 'exists:store_locations,id',
            'status' => 'required', 
        ]);

        StoreLocation::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
    }

    public function store(Request $request){

        $request->validate([
            'location_name' => 'required|unique:store_locations,location_name',
        ]);
        
        StoreLocation::create(['location_name'=> $request->input('location_name')]);
    }

    public function update(Request $request, StoreLocation $store_location){
        $request->validate([
            'location_name' => "required|unique:store_locations,location_name,$store_location->id,id",
            'status' => 'required',
        ]);

        $store_location->update(['location_name'=> $request->input('location_name'),  'status' => $request->input('status')]);
    }

    public function export()
    {

        $filename            = "BTO Store Location - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new StoreLocationExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = StoreLocation::select([
            'id', 
            'location_name', 
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date")
        ]);

        return $query;
    }

    
    public function import(Request $request)
    {   
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);
    
        try {
            $importFile = $request->file('file');

            Excel::import(new StoreLocationImport, $importFile);
    
            return to_route('/store_location');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            // Handle validation errors during import
            return back()->with('error', 'Validation error: ' . $e->getMessage());
        } catch (\Exception $e) {
            // Handle other errors
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
      
    }

    public function downloadTemplate()
    {
        $filename = "Import Store Location Template".".xlsx";
        return Excel::download(new StoreLocationTemplate, $filename);
    }


}


?>