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
        Schema::dropIfExists('bto_imfs');

        Schema::create('bto_imfs', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number');
            $table->string('customer_name');
            $table->integer('order_qty');
            $table->integer('stores_id');
            $table->string('phone_number', 15);
            $table->string('item_description');
            $table->string('uom');
            $table->string('brand');
            $table->string('part_number');
            $table->decimal('store_cost');
            $table->decimal('srp');
            $table->dateTime('order_date');
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bto_imfs');

    }
};
