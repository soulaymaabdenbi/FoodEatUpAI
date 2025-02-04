<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthControllers\AuthController;
use App\Http\Controllers\AuthControllers\CsrfCookieController;
use App\Http\Controllers\AuthControllers\ForgotPasswordController;
use App\Http\Controllers\AuthControllers\ProfileController;
use App\Http\Controllers\AuthControllers\ResetPasswordController;
use App\Http\Controllers\AuthControllers\SocialiteController;
use App\Http\Controllers\AuthControllers\VerificationController;
use App\Http\Controllers\UserManagementControllers\UserController;
use App\Http\Controllers\UserManagementControllers\RoleController;
use App\Http\Controllers\UserManagementControllers\PermissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::controller(AuthController::class)->group(function(){
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

Route::post('/reset-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password-with-token', [ResetPasswordController::class, 'reset']);


Route::patch('/auth/github-redirect', [SocialiteController::class, 'githubredirect']);
Route::post('/auth/github-callback', [SocialiteController::class, 'githubcallback']);
Route::patch('/auth/google-redirect', [SocialiteController::class, 'googleredirect']);
Route::post('/auth/google-callback', [SocialiteController::class, 'googlecallback']);

Route::middleware(['auth:sanctum', 'verifiedEmail'])->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::patch('/{type_profile}/update-email', [ProfileController::class, 'update_email']);
    Route::patch('/{type_profile}/update-password', [ProfileController::class, 'update_password']);
    Route::patch('/{type_profile}/update-picture', [ProfileController::class, 'update_picture']);
    Route::patch('/{type_profile}/connect-github-account', [SocialiteController::class, 'githubredirect']);
    Route::patch('/{type_profile}/remove-github-account', [SocialiteController::class, 'githubremove']);
    Route::patch('/{type_profile}/connect-google-account', [SocialiteController::class, 'googleredirect']);
    Route::patch('/{type_profile}/remove-google-account', [SocialiteController::class, 'googleremove']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/check-authentication', function (Request $request) {
        $user = $request->user();
        $type = $user->type;
        $verified = $user->hasVerifiedEmail();
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'type' => $type,
            'verified' => $verified,
            'token' => $token
        ]);
    });

    Route::post('/verify-email/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify')->middleware('signed');
    Route::post('/resend-verify-email', [VerificationController::class, 'resend']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/refresh-csrf-token', [CsrfCookieController::class, 'show']);
Route::get('/export-audit-logs', [AuditLogController::class, 'export'])->middleware('auth:sanctum');

// User Management Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
});