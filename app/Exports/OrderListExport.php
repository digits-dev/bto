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
                    "Digits Code",
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
            $item->btoStatus->status_name ?? null,
            $item->reference_number ?? null,
            $item->customer_name ?? null,
            $item->order_qty ?? null,
            $item->storeLocation->location_name ?? null,
            $item->phone_number ?? null,
            $item->itemMaster->digits_code ?? null,
            $item->itemMaster->item_description ?? null,
            $item->itemMaster->uom ?? null,
            $item->itemMaster->brand ?? null,
            $item->itemMaster->part_number ?? null,
            $item->itemMaster->store_cost ?? null,
            $item->itemMaster->srp ?? null,
            $item->order_date ?? null,
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
