<?php

namespace App\Http\Controllers\OrderList;

use App\Http\Controllers\Controller;
use App\Models\OrderList;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

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
        $query = OrderList::query()->with('btoStatus:id,status_name,color');


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

    public function add() {

        return Inertia::render('OrderList/add');
    }
    
    public function addSave(Request $request) {
        if ($request->hasFile('uploaded_file')) {
            $file = $request->file('uploaded_file');  // Use the `file` method to get the uploaded file
            $filename = time() . '_' . $file->getClientOriginalName();  // Get the original file name
            $file->move(public_path('images'), $filename);  // Move the file to the desired directory
        
            return response()->json(['success' => 'File uploaded successfully', 'filename' => $filename], 200);
        }
        


    }
}

?>