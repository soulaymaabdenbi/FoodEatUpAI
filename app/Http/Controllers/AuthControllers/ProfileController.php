<?php

namespace App\Http\Controllers\AuthControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogService;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Image;

class ProfileController extends Controller
{
    public function update_email(Request $request)
    {
        $validated = $request->validate([
            'email' => ['unique:users']
        ]);

        $user = User::findorfail(Auth::user()->id);
        if (Hash::check($request->current_password, $user->password)) {
            $user->email = $request->email;
            $user->save();
            AuditLogService::log('update_email', 'User updated email');
            return response()->json([
                'type' => $user->type,
                'message' => 'Email successfully changed'
            ],200);
        }
        else{
            return response()->json([
                'message' => 'Current password does not match'
            ],403);
        }
    }

    public function update_password(Request $request)
    {
        $validated = $request->validate([
            'password' => ['confirmed']
        ]);

        $user = User::findorfail(Auth::user()->id);
        if (Hash::check($request->current_password, $user->password)) {
            $user->password = bcrypt($request->password);
            $user->save();
            AuditLogService::log('update_password', 'User updated password');
            return response()->json([
                'type' => $user->type,
                'message' => 'Password successfully changed'
            ],200);
        }
        else{
            return response()->json([
                'message' => 'Current password does not match'
            ],403);
        }
    }

    public function update_picture(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'image']
        ]);

        $user = User::findorfail(Auth::user()->id);
        $image = request()->file('image');
        if($image){
            $name = hexdec(uniqid());
            $fullname = $name.'.webp';
            $path = 'images/users/';
            $url = $path.$fullname;
            $resize_image=Image::make($image->getRealPath());
            $resize_image->resize(500,500);
            $resize_image->save('images/users/'.$fullname);
            if($user->image != 'images/users/default.webp'){
                if(file_exists($user->image)){
                    unlink($user->image);
                }
            }
            $user->image = $url;
            $user->save();
            AuditLogService::log('update_picture', 'User updated profile picture');
            return response()->json([
                'type' => $user->type,
                'message' => 'Profile Picture successfully changed'
            ],200);
        }
    }
}