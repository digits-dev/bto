<?php

use App\Exports\ItemMasterExport;
use App\Helpers\CommonHelpers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\MenusController;
use App\Http\Controllers\Admin\ModulsController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\OrderList\OrderListController;
use App\Http\Controllers\BtoImfs\BtoImfsController;
use App\Http\Controllers\Admin\PrivilegesController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Users\ChangePasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\ItemMaster\ItemMasterController;
use App\Http\Controllers\Status\StatusController;
use App\Http\Controllers\StoreLocation\StoreLocationController;
use Inertia\Inertia; // We are going to use this class to render React components
use App\Http\Controllers\Users\ProfilePageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [LoginController::class, 'index']);
Route::get('login', [LoginController::class, 'index'])->name('login');

// reset password
Route::get('/reset_password', [ResetPasswordController::class, 'getIndex'])->name('reset_password');
Route::post('/send_resetpass_email',[ResetPasswordController::class, 'sendResetPasswordInstructions']);
Route::get('/reset_password_email/{email}', [ResetPasswordController::class, 'getResetIndex'])->name('reset_password_email');
Route::post('/send_resetpass_email/reset',[ResetPasswordController::class, 'resetPassword']);

Route::post('login-save', [LoginController::class, 'authenticate'])->name('login-save');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/sidebar', [MenusController::class, 'sidebarMenu'])->name('sidebar');

    //USERS
    Route::post('create-user', [AdminUsersController::class, 'postAddSave'])->name('create-user');
    Route::post('/postAddSave', [AdminUsersController::class, 'postAddSave'])->name('postAddSave');
    Route::post('/postEditSave', [AdminUsersController::class, 'postEditSave'])->name('postEditSave');
    Route::post('/deactivate-users', [AdminUsersController::class, 'setStatus'])->name('postDeactivateUsers');

    //PROFILE PAGE
    Route::get('/profile', [ProfilePageController::class, 'getIndex'])->name('profile_page');
    Route::put('/profile/{user}', [ProfilePageController::class, 'updateProfile']);

    //CHANGE PASSWORD
    Route::get('/change_password', [ChangePasswordController::class, 'getIndex'])->name('change_password');
    Route::post('/postChangePassword', [AdminUsersController::class, 'postUpdatePassword'])-> name('postChangePassword');
    
    //PRIVILEGES
    Route::get('create-privileges', [PrivilegesController::class, 'createPrivilegesView'])->name('create-privileges');
    Route::get('edit-privileges/{id}', [PrivilegesController::class, 'getEdit'])->name('edit-privileges');
    Route::post('/privilege/postAddSave', [PrivilegesController::class, 'postAddSave'])->name('postAddSave');
    Route::post('/privilege/postEditSave', [PrivilegesController::class, 'postEditSave'])->name('postEditSave');

    //MODULES
    Route::get('create-modules', [ModulsController::class, 'getAddModuls'])->name('create-modules');
    Route::post('/module_generator/postAddSave', [ModulsController::class, 'postAddSave'])->name('postAddSave');

    //MENUS
    Route::post('/menu_management/add', [MenusController::class, 'postAddSave'])->name('MenusControllerPostSaveMenu');
    Route::get('/menu_management/edit/{id}', [MenusController::class, 'getEdit'])->name('MenusControllerGetEdit');
    Route::post('/menu_management/edit-menu-save/{id}', [MenusController::class, 'postEditSave'])->name('edit-menus-save');
    Route::post('/set-status-menus', [MenusController::class, 'postStatusSave'])->name('delete-menus-save');

    //BTO STATUS
    Route::post('/bto_status', [StatusController::class, 'store']);
    Route::put('/bto_status/bulkupdate', [StatusController::class, 'bulkUpdate']);
    Route::put('/bto_status/{bto_status}', [StatusController::class, 'update']);

    //STORE LOCATION
    Route::post('/store_location', [StoreLocationController::class, 'store']);
    Route::put('/store_location/{store_location}', [StoreLocationController::class, 'update']);
    Route::put('/store_location/bulkupdate', [StoreLocationController::class, 'bulkUpdate']);

    // EXPORTS
    Route::get('/bto_order_list_export', [OrderListController::class, 'export']);
    Route::get('/item_master_export', [ItemMasterController::class, 'export']);
    Route::get('/bto_status_export', [StatusController::class, 'export']);
    Route::get('/store_location_export', [StoreLocationController::class, 'export']);

    // IMPORTS
    Route::post('/bto_status_import', [StatusController::class, 'import']);
    Route::post('/store_location_import', [StoreLocationController::class, 'import']);
    
    // TEMPLATES
    Route::get('/bto_status_template', [StatusController::class, 'downloadTemplate']);
    Route::get('/store_location_template', [StoreLocationController::class, 'downloadTemplate']);

    // BTO Order List
    Route::get('/bto_order_list/add', [OrderListController::class, 'add']);
    Route::post('/bto_order_list/add_save', [OrderListController::class, 'addSave']);
    Route::get('/bto_order_list/edit/{id}', [OrderListController::class, 'edit']);
    Route::post('/bto_order_list/edit_save', [OrderListController::class, 'editSave']);
    Route::get('/bto_order_list/{id}', [OrderListController::class, 'OrderListIndex']);


    // Item Master
    Route::post('/get-digits-code', [ItemMasterController::class, 'getDigitsCode']);
    Route::get('/get-item-master-dc', [ItemMasterController::class, 'getUpdateItem']);

});

Route::group([
    'middleware' => ['auth'],
    'prefix' => config('adm_url.ADMIN_PATH'),
    'namespace' => 'App\Http\Controllers',
], function () {
   
    // Todo: change table
    $modules = [];
    try {
        $modules = DB::table('adm_modules')->whereIn('controller', CommonHelpers::getOthersControllerFiles())->get();
    } catch (\Exception $e) {
        Log::error("Load adm moduls is failed. Caused = " . $e->getMessage());
    }

    foreach ($modules as $v) {
        if (@$v->path && @$v->controller) {
            try {
                CommonHelpers::routeOtherController($v->path, $v->controller, 'app\Http\Controllers');
            } catch (\Exception $e) {
                Log::error("Path = ".$v->path."\nController = ".$v->controller."\nError = ".$e->getMessage());
            }
        }
    }
})->middleware('auth');

//ADMIN ROUTE
Route::group([
    'middleware' => ['auth'],
    'prefix' => config('ad_url.ADMIN_PATH'),
    'namespace' => 'App\Http\Controllers\Admin',
], function () {
   
    // Todo: change table
    if (request()->is(config('ad_url.ADMIN_PATH'))) {
        $menus = DB::table('adm_menuses')->where('is_dashboard', 1)->first();
        if ($menus) {
            Route::get('/', 'Dashboard\DashboardContentGetIndex');
        } else {
            CommonHelpers::routeController('/', 'AdminController', 'App\Http\Controllers\Admin');
        }
    }

    // Todo: change table
    $modules = [];
    try {
        $modules = DB::table('adm_modules')->whereIn('controller', CommonHelpers::getMainControllerFiles())->get();
    } catch (\Exception $e) {
        Log::error("Load ad moduls is failed. Caused = " . $e->getMessage());
    }

    foreach ($modules as $v) {
        if (@$v->path && @$v->controller) {
            try {
                CommonHelpers::routeController($v->path, $v->controller, 'app\Http\Controllers\Admin');
            } catch (\Exception $e) {
                Log::error("Path = ".$v->path."\nController = ".$v->controller."\nError = ".$e->getMessage());
            }
        }
    }
})->middleware('auth');