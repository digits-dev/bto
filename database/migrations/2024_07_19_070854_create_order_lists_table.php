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
        Schema::create('order_lists', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name')->nullable();
            $table->integer('order_qty')->nullable();
            $table->string('store_name')->nullable();
            $table->string('phone_number')->nullable();
            $table->integer('status')->default(1);
            $table->string('part_no')->nullable();
            $table->string('srp')->nullable();
            $table->string('order_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_lists');
    }
};
