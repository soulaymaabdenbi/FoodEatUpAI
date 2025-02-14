<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Establishment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone_number',
        'address_line_one',
        'address_line_two',
        'city',
        'state',
        'country',
        'zip_code',
        'domain',
        'logo_path',
        'user_id'
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        return $this->logo_path ? Storage::url($this->logo_path) : 'https://via.placeholder.com/150';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
