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
        Schema::table('item_masters', function (Blueprint $table) {
            $table->string('uom')->default('PCS')->after('item_description');
            $table->string('brand')->default('APPLE')->after('uom');
            $table->integer('order_list_id')->after('id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_masters', function (Blueprint $table) {
            $table->dropColumn('uom');
            $table->dropColumn('brand');
            $table->dropColumn('order_list_id');

        });
    }
};
