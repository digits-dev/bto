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
            $table->dropColumn([
                'customer_name',
                'order_qty',
                'store_name',
                'phone_number',
                'status',
                'order_date'
            ]);

            $table->renameColumn('part_no', 'part_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bto_imfs', function (Blueprint $table) {
            $table->string('customer_name')->nullable();
            $table->integer('order_qty')->nullable();
            $table->string('store_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('status')->nullable();
            $table->date('order_date')->nullable();

            $table->renameColumn('part_number', 'part_no');
        });
    }
};
