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
            $table->string('digits_item_description')->nullable()->after('item_description');
            $table->decimal('store_cost')->nullable()->after('part_number');
            $table->string('oum')->nullable()->default('PCS')->after('digits_item_description');
            $table->string('brand')->nullable()->default('APPLE')->after('oum');
            $table->decimal('srp')->nullable()->after('store_cost');
            $table->dropColumn('item_master_id');
            $table->string('digits_code', 10)->after('id')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_lists', function (Blueprint $table) {
            $table->integer('item_master_id')->after('id')->nullable();
            $table->dropColumn('digits_item_description');
            $table->dropColumn('store_cost');
            $table->dropColumn('oum');
            $table->dropColumn('brand');
            $table->dropColumn('srp');
            $table->dropColumn('digits_code');

        });
    }
};