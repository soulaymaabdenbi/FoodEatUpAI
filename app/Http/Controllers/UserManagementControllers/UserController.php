<?php

namespace App\Http\Controllers\UserManagementControllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:255',
            'type' => 'required|string|in:Admin,User,Pro', // Add this validation
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'type' => $validated['type'], // Make sure this is included
        ]);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    public function toggleStatus($id)
    {
        try {
            $user = User::findOrFail($id);

            // Don't allow toggling the authenticated user's status
            if ($user->id === auth()->id()) {
                return response()->json([
                    'message' => 'You cannot change your own status'
                ], 403);
            }

            $user->active = !$user->active;
            $user->save();

            return response()->json([
                'message' => 'User status updated successfully',
                'active' => $user->active
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}