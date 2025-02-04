<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Response;

class AuditLogController extends Controller
{
    public function export()
    {
        $logs = AuditLog::all();
        $csv = "ID,User ID,Action,Description,Created At\n";

        foreach ($logs as $log) {
            $csv .= "{$log->id},{$log->user_id},{$log->action},{$log->description},{$log->created_at}\n";
        }

        $filename = "audit_logs_" . now()->format('Y-m-d_H-i-s') . ".csv";
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }
}