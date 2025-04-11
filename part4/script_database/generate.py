import uuid
from app import db
from app.models import User, Place, Review, Amenity
from werkzeug.security import generate_password_hash

# Nettoyage de la base (optionnel, à ne pas faire en prod)
db.drop_all()
db.create_all()

# 1. Créer un utilisateur administrateur
admin_id = str(uuid.uuid4())
admin = User(
    id=admin_id,
    email='admin@hbnb.io',
    first_name='Admin',
    last_name='HBnB',
    password='password1',
    is_admin=True
)
db.session.add(admin)

# 2. Créer des commodités
wifi = Amenity(id=str(uuid.uuid4()), name='WiFi')
pool = Amenity(id=str(uuid.uuid4()), name='Swimming Pool')
ac = Amenity(id=str(uuid.uuid4()), name='Air Conditioning')
db.session.add_all([wifi, pool, ac])

# 3. Créer un lieu
place_id = str(uuid.uuid4())
place = Place(
    id=place_id,
    title='Luxury Villa',
    description='Beautiful beachfront villa',
    price=250.00,
    latitude=40.7128,
    longitude=-74.0060,
    user_id=admin_id
)
db.session.add(place)

# 4. Associer des commodités au lieu
place.amenities = [wifi]  # tu peux en mettre plusieurs si tu veux

# 5. Créer un avis
review = Review(
    id=str(uuid.uuid4()),
    text='Amazing place!',
    rating=5,
    user_id=admin_id,
    place_id=place_id
)
db.session.add(review)

# Commit final
db.session.commit()

print("✅ Données insérées avec succès !")