<?php

namespace App\Http\Controllers\AuthControllers;

use App\Http\Controllers\Controller;
use App\Http\Traits\AuthenticatesUsers;
use App\Http\Traits\ThrottlesLogins;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Image;

class AuthController extends Controller
{
    use AuthenticatesUsers, ThrottlesLogins;

    public function register(Request $req){
        $users = User::all();
        $data = array();
        $data['type'] = $req->type;
        $data['name'] = $req->name;
        $data['email'] = $req->email;
        $data['phone'] = $req->phone;

        $data['password'] = $req->password;
        if(count($users) >  0){
            if(isset($data['type']) && $data['type'] == 'Pro'){
                $validated = $req->validate([
                    'email' => ['unique:users'],
                    'phone' => ['unique:users'],
                    'image' => ['image'],
                    'password' => ['confirmed']
                ]);

                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'phone' => $data['phone'],
                    'type' => 'Pro',
                    'password' => bcrypt($data['password']),
                ]);
                $image = request()->file('image');
                if($image){
                    $name = hexdec(uniqid());
                    $fullname = $name.'.webp';
                    $path = 'images/users/';
                    $url = $path.$fullname;
                    $resize_image=Image::make($image->getRealPath());
                    $resize_image->resize(500,500);
                    $resize_image->save('images/users/'.$fullname);
                    $user->update(['image' => $url]);
                }
            }
            else{
                $validated = $req->validate([
                    'email' => ['unique:users'],
                    'image' => ['image'],
                    'password' => ['confirmed']
                ]);

                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'type' => 'User',
                    'password' => bcrypt($data['password']),
                ]);
                $image = request()->file('image');
                if($image){
                    $name = hexdec(uniqid());
                    $fullname = $name.'.webp';
                    $path = 'images/users/';
                    $url = $path.$fullname;
                    $resize_image=Image::make($image->getRealPath());
                    $resize_image->resize(500,500);
                    $resize_image->save('images/users/'.$fullname);
                    $user->update(['image' => $url]);
                }
            }
        }
        else{
            $validated = $req->validate([
                'email' => ['unique:users'],
                'image' => ['image'],
                'password' => ['confirmed']
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'type' => 'Admin',
                'password' => bcrypt($data['password']),
            ]);
            $image = request()->file('image');
            if($image){
                $name = hexdec(uniqid());
                $fullname = $name.'.webp';
                $path = 'images/users/';
                $url = $path.$fullname;
                $resize_image=Image::make($image->getRealPath());
                $resize_image->resize(500,500);
                $resize_image->save('images/users/'.$fullname);
                $user->update(['image' => $url]);
            }
        }
        Auth::attempt($req->only('email', 'password'));
        $auth_user = Auth::user();
        $token = $auth_user->createToken('auth_token')->plainTextToken;
        $user->sendEmailVerificationNotification();
        AuditLogService::log('register', 'User registered');
        return response()->json([
            'type' => $auth_user->type,

            'token' => $token
        ],200);
    }

    public function login(Request $request)
    {
        if (method_exists($this, 'hasTooManyLoginAttempts') &&
            $this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        $credentials = array();
        $credentials['email'] = $request->email;
        $credentials['password'] = $request->password;
        $credentials['remember'] = $request->remember;
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);
        if (Auth::attempt($credentials, $remember)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;
            AuditLogService::log('login', 'User logged in');
            if($user->hasVerifiedEmail()){
                return response()->json([
                    'type' => $user->type,
                    'verified' => true,
                    'token' => $token
                ],200);
            }
            else{
                return response()->json([
                    'type' => $user->type,
                    'verified' => false,
                    'token' => $token
                ],200);
            }
        }
        else {
            $this->incrementLoginAttempts($request);

            throw ValidationException::withMessages([
                'email' => [trans('auth.failed')],
            ]);
        }
    }

    public function logout(){
        $user = Auth::user();
        $user->tokens()->delete();
        Auth::guard('web')->logoutCurrentDevice();
        AuditLogService::log('logout', 'User logged out');

        return response()->json([
            'success' => true
        ],200);
    }
}