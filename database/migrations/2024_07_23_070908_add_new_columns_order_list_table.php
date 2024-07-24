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
            if (Schema::hasColumn('order_lists', 'reference_number')) {
                $table->dropColumn('reference_number');
            }
            if (Schema::hasColumn('order_lists', 'uom')) {
                $table->dropColumn('uom');
            }
            if (Schema::hasColumn('order_lists', 'brand')) {
                $table->dropColumn('brand');
            }
            $table->string('status')->after('uploaded_file')->change();
        });
    }
};