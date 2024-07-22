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
            $table->integer('stores_id');
            $table->string('phone_number')->nullable();
            $table->string('item_description')->nullable();
            $table->integer('status')->default(1);
            $table->string('digits_code', 10)->nullable();
            $table->string('part_number', 255)->nullable();
            $table->decimal('store_cost')->nullable();
            $table->decimal('srp')->nullable();
            $table->dateTime('order_date')->nullable();
            $table->integer('created_by');
            $table->timestamps();
            $table->integer('updated_by_mcb')->nullable();
            $table->dateTime('updated_by_mcb_date')->nullable();
            $table->integer('updated_by_acctg')->nullable();
            $table->dateTime('updated_by_acctg_date')->nullable();
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
