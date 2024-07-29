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
            $table->dropColumn('digits_code');
            $table->dropColumn('store_cost');
            $table->dropColumn('srp');
            $table->dropColumn('uom');
            $table->dropColumn('brand');
            $table->integer('item_master_id')->nullable()->after('id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_lists', function (Blueprint $table) {
            $table->string('uom')->after('item_description')->default('PCS');
            $table->string('brand')->after('uom')->default('APPLE');
            $table->string('digits_code', 10)->after('uploaded_file')->nullable();
            $table->decimal('store_cost')->after('phone_number')->nullable();
            $table->decimal('srp')->after('store_cost')->nullable();
            $table->dropColumn('item_master_id');
        });
    }
};
