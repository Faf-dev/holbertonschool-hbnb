from flask import Flask
from flask import render_template
from flask_restx import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import config

bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()

from app.api.v1.users import api as users_ns
from app.api.v1.amenities import api as amenities_ns
from app.api.v1.places import api as places_ns
from app.api.v1.reviews import api as reviews_ns
from app.api.v1.auth import api as auth_ns
from app.api.v1.protected import api as protected_ns

def create_app(config_class=config.DevelopmentConfig):
    # Création de l'application
    app = Flask(__name__, template_folder='templates', static_folder='static')
        
    app.config.from_object(config_class)
    
    # Initialisation des extensions
    bcrypt.init_app(app)
    jwt.init_app(app)
    db.init_app(app)

    # Configuration de CORS
    CORS(app)  # Autorise toutes les origines par défaut
    
    # Configuration de l'API
    authorizations = {
        'apikey': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': "Type in the *'Value'* input box below: **'Bearer &lt;JWT&gt;'**, where JWT is the token"
        }
    }
    
    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/index.html')
    def index():
        return render_template('index.html')
    
    @app.route('/login')
    def login():
        return render_template('login.html')
    
    @app.route('/places')
    def places():
        return render_template('places.html')
    
    # Initialiser l'API
    api = Api(app, version='1.0', title='HBnB API', description='HBnB Application API', authorizations=authorizations)

    # Ajouter les namespaces pour l'API
    api.add_namespace(users_ns, path='/api/v1/users')
    api.add_namespace(amenities_ns, path='/api/v1/amenities')
    api.add_namespace(places_ns, path='/api/v1/places')
    api.add_namespace(reviews_ns, path='/api/v1/reviews')
    api.add_namespace(auth_ns, path='/api/v1/auth')
    api.add_namespace(protected_ns, path='/api/v1/protected')

    return app
