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
            $table->string('status')->default(1)->after('id')->change();
            $table->string('reference_number')->nullable()->after('status');
            $table->string('uom')->default('PCS')->after('item_description');
            $table->string('brand')->default('APPLE')->after('uom');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_lists', function (Blueprint $table) {
            $table->dropColumn('uom');
            $table->dropColumn('brand');
            $table->dropColumn('reference_number');
            $table->string('status')->after('uploaded_file')->change();
        });
    }
};