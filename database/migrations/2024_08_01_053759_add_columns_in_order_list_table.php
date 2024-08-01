<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_lists', function (Blueprint $table) {
            $table->renameColumn('store_cost', 'estimated_store_cost');
            $table->renameColumn('uploaded_file', 'original_uploaded_file');
        });

        Schema::table('order_lists', function (Blueprint $table) {
            $table->decimal('supplier_cost', 8, 2)->after('part_number')->nullable();
            $table->decimal('estimated_landed_cost', 8, 2)->after('estimated_store_cost')->nullable();
            $table->string('final_uploaded_file')->after('original_uploaded_file')->nullable();
            $table->integer('updated_by_store')->after('updated_by_mcb_date2')->nullable();
            $table->dateTime('updated_by_store_date')->after('updated_by_store')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_lists', function (Blueprint $table) {
            $table->dropColumn('supplier_cost');
            $table->dropColumn('estimated_landed_cost');
            $table->dropColumn('final_uploaded_file');
            $table->dropColumn('updated_by_store');
            $table->dropColumn('updated_by_store_date');
        });

        Schema::table('order_lists', function (Blueprint $table) {
            $table->renameColumn('estimated_store_cost', 'store_cost');
            $table->renameColumn('original_uploaded_file', 'uploaded_file');
        });
    }
};
