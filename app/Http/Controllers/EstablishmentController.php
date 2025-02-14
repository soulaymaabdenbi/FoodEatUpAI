<?php

namespace App\Http\Controllers;

use App\Models\Establishment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EstablishmentController extends Controller
{
    public function index()
    {
        return response()->json(Establishment::all());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:establishments,email',
                'phone_number' => 'nullable|string',
                'address_line_one' => 'required|string',
                'city' => 'required|string',
                'country' => 'required|string',
                'zip_code' => 'required|string',
                'domain' => 'required|string|unique:establishments,domain',
                'logo' => 'nullable|image|mimes:jpeg,png|max:2048'
            ]);

            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('establishments', 'public');
                $validated['logo_path'] = $path;
            }

            $validated['user_id'] = auth()->id();

            $establishment = Establishment::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Établissement créé avec succès',
                'data' => $establishment
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Establishment creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la création de l\'établissement',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getCitiesByCountry($countryCode)
    {
        try {
            // You can use an API service or database to fetch cities
            // Example using a cities API
            $response = Http::get("https://api.example.com/cities/{$countryCode}");

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json([
                'message' => 'Unable to fetch cities'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching cities',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy(Establishment $establishment)
    {
        $establishment->delete();
        return response()->json(['message' => 'Establishment deleted successfully']);
    }
}
