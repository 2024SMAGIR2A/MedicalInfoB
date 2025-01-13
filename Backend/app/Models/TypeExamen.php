<?php
    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class TypeExamen extends Model
    {
        use HasFactory;

        protected $table = 'typeexamen'; // Nom de la table dans la base de données
        protected $primaryKey = 'idTypeExamen'; // Clé primaire de la table

        protected $fillable = [
            'nom',
            'description',
            'isDeleted',
        ];

        // Relation avec les examens médicaux
        public function examens()
        {
            return $this->hasMany(Examen::class, 'idTypeExamen');
        }
    }
