<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStyles;

class OrderListExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "Status",
                    "Reference Number",
                    "Customer Name",
                    "Order Qty",
                    "Store Location",
                    "Phone Number",
                    "Item Description",
                    "UOM",
                    "Brand",
                    "Part #",
                    "Store Cost",
                    "SRP",
                    "Order Date",
                ];

        return $headers;
    }

    public function map($item): array {

       $orderlist = [
                    $item->btoStatus->status_name,
                    $item->reference_number,
                    $item->customer_name,
                    $item->order_qty,
                    $item->storeLocation->location_name,
                    $item->phone_number,
                    $item->item_description,
                    $item->uom,
                    $item->brand,
                    $item->part_number,
                    $item->store_cost,
                    $item->srp,
                    $item->order_date,
                 ];
       
        return $orderlist;
    }

    public function query(){       
        return $this->query;
    }
    
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }
    
}
