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
        Schema::table('bto_imfs', function (Blueprint $table) {
            $table->string('digits_code', 10)->after('id');
            $table->string('item_description')->after('part_number');
            $table->decimal('store_cost')->after('srp');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bto_imfs', function (Blueprint $table) {
            $table->dropColumn('digits_code');
            $table->dropColumn('item_description');
            $table->dropColumn('store_cost');
        });
    }
};
