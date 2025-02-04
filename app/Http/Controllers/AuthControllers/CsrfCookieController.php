<?php

namespace App\Http\Controllers\AuthControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CsrfCookieController extends Controller
{
    public function show(Request $request)
    {
        if ($request->expectsJson()) {
            return new JsonResponse(null, 204);
        }

        return new Response('', 204);
    }
}
