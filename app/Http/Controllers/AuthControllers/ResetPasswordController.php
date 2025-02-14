<?php

namespace App\Http\Controllers\AuthControllers;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class ResetPasswordController extends Controller
{
    public function showResetForm(Request $request){
        $token = $request->route()->parameter('token');
        return response()->json([
            'token' => $token,
            'email' => $request->email
        ],200);
    }

    public function reset(Request $request)
    {
        \Log::info("✅ Reset Password Request Received:", $request->all());

        try {
            // Validate the request
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
                'token' => 'required'
            ]);

            \Log::info("✅ Validation Passed", $request->all());

            // Fetch password reset record
            $resetRecord = DB::table('password_resets')
                ->where('email', $request->email)
                ->first();

            if (!$resetRecord) {
                \Log::error("❌ Token not found for email: " . $request->email);
                return response()->json([
                    'error' => 'Token invalide ou expiré'
                ], 400);
            }

            // Verify token
            if (!Hash::check($request->token, $resetRecord->token)) {
                \Log::error("❌ Token mismatch for email: " . $request->email);
                return response()->json([
                    'error' => 'Token invalide ou expiré'
                ], 400);
            }

            // Update user password
            $user = \App\Models\User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'error' => 'Utilisateur non trouvé'
                ], 404);
            }

            $user->password = Hash::make($request->password);
            $user->save();

            // Delete the reset token
            DB::table('password_resets')
                ->where('email', $request->email)
                ->delete();

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Mot de passe réinitialisé avec succès',
                'redirect' => '/login'
            ], 200);

        } catch (\Exception $e) {
            \Log::error("❌ Reset password error: " . $e->getMessage());
            return response()->json([
                'error' => 'Une erreur est survenue lors de la réinitialisation du mot de passe'
            ], 500);
        }
    }
    protected function rules()
    {
        return [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed'
        ];
    }


    protected function validationErrorMessages()
    {
        return [];
    }

    protected function credentials(Request $request)
    {
        return $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );
    }

    protected function resetPassword($user, $password)
    {
        $this->setUserPassword($user, $password);

        $user->setRememberToken(Str::random(60));

        $user->save();

        event(new PasswordReset($user));
    }

    protected function setUserPassword($user, $password)
    {
        $user->password = bcrypt($password);
    }

    protected function sendResetResponse(Request $request)
    {
        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
            'redirect' => '/login'
        ], 200);
    }

    protected function sendResetFailedResponse(Request $request, $response)
    {
        throw ValidationException::withMessages([
            'email' => [trans($response)],
        ]);
    }

    public function broker()
    {
        return Password::broker();
    }
}
