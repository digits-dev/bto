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
            $table->decimal('srp')->nullable()->after('store_cost');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_lists', function (Blueprint $table) {
            $table->dropColumn('digits_item_description');
            $table->dropColumn('store_cost');
            $table->dropColumn('srp');
        });
    }
};
