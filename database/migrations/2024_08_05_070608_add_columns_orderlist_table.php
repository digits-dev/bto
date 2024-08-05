<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::table('order_lists', function (Blueprint $table) {
            $table->decimal('supplier_cost', 15, 2)->nullable()->change();
            $table->decimal('estimated_store_cost', 15, 2)->nullable()->change();
            $table->decimal('estimated_landed_cost', 15, 2)->nullable()->change();
            $table->decimal('srp', 15, 2)->nullable()->change();
            $table->decimal('estimated_srp', 15, 2)->after('estimated_landed_cost')->nullable();
            $table->string('uploaded_reciept1')->after('final_uploaded_file')->nullable();
            $table->string('uploaded_reciept2')->after('uploaded_reciept1')->nullable();
            $table->string('po_number')->after('srp')->nullable();
            $table->string('dr_number')->after('po_number')->nullable();
            $table->integer('po_by_mcb')->after('updated_by_store_date')->nullable();
            $table->integer('po_by_mcb_date')->after('po_by_mcb')->nullable();
            $table->integer('dr_by_mcb')->after('po_by_mcb_date')->nullable();
            $table->integer('dr_by_mcb_date')->after('dr_by_mcb')->nullable();
            $table->integer('updated_by_store2')->after('dr_by_mcb_date')->nullable();
            $table->integer('updated_by_store_date2')->after('updated_by_store2')->nullable();

        });

        Schema::table('order_lists', function (Blueprint $table) {
            $table->renameColumn('srp', 'final_srp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('order_lists')->whereNull('supplier_cost')->update(['supplier_cost' => 0]);
        DB::table('order_lists')->whereNull('estimated_store_cost')->update(['estimated_store_cost' => 0]);
        DB::table('order_lists')->whereNull('estimated_landed_cost')->update(['estimated_landed_cost' => 0]);
        DB::table('order_lists')->whereNull('final_srp')->update(['final_srp' => 0]);

        Schema::table('order_lists', function (Blueprint $table) {
            $table->decimal('supplier_cost', 15, 2)->nullable(false)->change();
            $table->decimal('estimated_store_cost', 15, 2)->nullable(false)->change();
            $table->decimal('estimated_landed_cost', 15, 2)->nullable(false)->change();
            $table->decimal('final_srp', 15, 2)->nullable(false)->change();
            $table->dropColumn('estimated_srp');
            $table->dropColumn('uploaded_reciept1');
            $table->dropColumn('uploaded_reciept2');
            $table->dropColumn('po_number');
            $table->dropColumn('dr_number');
            $table->dropColumn('po_by_mcb');
            $table->dropColumn('po_by_mcb_date');
            $table->dropColumn('dr_by_mcb');
            $table->dropColumn('dr_by_mcb_date');
            $table->dropColumn('updated_by_store2');
            $table->dropColumn('updated_by_store_date2');
        });

        Schema::table('order_lists', function (Blueprint $table) {
            $table->renameColumn('final_srp', 'srp');
        });
    }
};
