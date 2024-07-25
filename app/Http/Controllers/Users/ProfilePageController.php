<?php

namespace App\Http\Controllers\Users;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\StoreLocation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProfilePageController extends Controller
{

    public function getIndex()
    {
        $data = [];
        $data['user'] = User::with('userStore:id,location_name', 'userPrivilege:id,name')
            ->where('users.id', CommonHelpers::myId())
            ->first();

        $data['store'] = StoreLocation::get();


        return Inertia::render('Users/ProfilePage',$data);
    }

    public function updateProfile(Request $request, User $user){

        $user->update(['stores_id'=> $request->input('selectedLocation.value')]);


        return back()->with(['message'=> 'Profile Update Successful', 'status'=> 'success']);

    }
    
}
