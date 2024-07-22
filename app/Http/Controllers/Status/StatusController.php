<?php

namespace App\Http\Controllers\Status;

use App\Exports\BtoStatusExport;
use App\ImportTemplates\BtoStatusTemplate;
use App\Http\Controllers\Controller;
use App\Imports\BtoStatusImport;
use App\Models\BtoStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class StatusController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'asc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex(): Response
    {

        $query = BtoStatus::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('status_name', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));

        $data = [];
        $data['btoStatus'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('Status/Status', $data);
    }

    public function store(Request $request){

        $request->validate([
            'status_name' => 'required|unique:bto_statuses,status_name',
            'color' => 'required',
        ]);
        
        BtoStatus::create(['status_name'=> $request->input('status_name'), 'color' => $request->input('color')]);
    }

    public function update(Request $request, BtoStatus $bto_status){
        $request->validate([
            'status_name' => "required|unique:bto_statuses,status_name,$bto_status->id,id",
            'status' => 'required',
            'color' => 'required',
        ]);

        $bto_status->update(['status_name'=> $request->input('status_name'),  'status' => $request->input('status'), 'color' => $request->input('color')]);
    }

    
    public function bulkUpdate(Request $request){

        $ids = $request->input('ids');
        $status = $request->input('status');

        $request->validate([
            'ids' => 'required',
            'ids.*' => 'exists:bto_statuses,id',
            'status' => 'required', 
        ]);

        BtoStatus::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
    }

    public function export()
    {

        $filename            = "BTO Status - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new BtoStatusExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = BtoStatus::select([
            'id', 
            'status_name', 
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

            Excel::import(new BtoStatusImport, $importFile);
    
            return to_route('/status');
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
        $filename = "Import BTO Status Template".".xlsx";
        return Excel::download(new BtoStatusTemplate, $filename);
    }
    
}

?>