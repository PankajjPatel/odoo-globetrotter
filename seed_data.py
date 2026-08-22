import os
import sys
from pathlib import Path

# Automatically discover and add venv site-packages if django is not installed globally
try:
    import django
except ModuleNotFoundError:
    base_dir = Path(__file__).resolve().parent
    # Windows venv path
    win_venv = base_dir / 'venv' / 'Lib' / 'site-packages'
    # Linux/Mac venv path
    nix_venv = base_dir / 'venv' / 'lib' / f'python{sys.version_info.major}.{sys.version_info.minor}' / 'site-packages'
    
    if win_venv.exists():
        sys.path.insert(0, str(win_venv))
    elif nix_venv.exists():
        sys.path.insert(0, str(nix_venv))
    
    import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'globetrotter.settings')
django.setup()

from travel.models import City, Activity

CITIES_DATA = [
    {
        'name': 'Delhi',
        'country': 'India',
        'region': 'North India',
        'cost_index': '₹₹',
        'popularity': 'Very High',
        'description': 'The historic capital city of India blending rich heritage with modern sprawl.',
        'image': 'bg-delhi',
        'activities': [
            {
                'name': 'India Gate',
                'type': 'Sightseeing',
                'cost': 0.00,
                'duration': '1.5 hours',
                'description': 'Iconic war memorial arch located along the Rajpath in New Delhi.',
                'image': 'bg-delhi-gate'
            },
            {
                'name': 'Red Fort',
                'type': 'History',
                'cost': 500.00,
                'duration': '2.5 hours',
                'description': 'Historic fort in Old Delhi that served as the main residence of Mughal Emperors.',
                'image': 'bg-red-fort'
            },
            {
                'name': 'Qutub Minar',
                'type': 'History',
                'cost': 350.00,
                'duration': '2 hours',
                'description': 'UNESCO World Heritage Site featuring a 73-metre tall minaret built in 1193.',
                'image': 'bg-qutub-minar'
            },
            {
                'name': 'National Museum',
                'type': 'Culture',
                'cost': 200.00,
                'duration': '3 hours',
                'description': 'One of the largest museums in India with over 200,000 works of art.',
                'image': 'bg-delhi-museum'
            }
        ]
    },
    {
        'name': 'Jaipur',
        'country': 'India',
        'region': 'North India',
        'cost_index': '₹₹',
        'popularity': 'Very High',
        'description': 'The famed Pink City known for royal palaces, vibrant bazaars, and grand forts.',
        'image': 'bg-jaipur',
        'activities': [
            {
                'name': 'Amber Fort',
                'type': 'History',
                'cost': 500.00,
                'duration': '3.5 hours',
                'description': 'Majestic hilltop fort known for artistic Hindu style elements and elephant rides.',
                'image': 'bg-amber-fort'
            },
            {
                'name': 'City Palace',
                'type': 'Culture',
                'cost': 700.00,
                'duration': '2.5 hours',
                'description': 'Royal residence displaying a stunning fusion of Rajasthani and Mughal architecture.',
                'image': 'bg-city-palace'
            },
            {
                'name': 'Hawa Mahal',
                'type': 'Sightseeing',
                'cost': 200.00,
                'duration': '1 hour',
                'description': 'Palace of Winds with 953 intricately designed jharokhas (casements).',
                'image': 'bg-hawa-mahal'
            },
            {
                'name': 'Jaipur Food Tour',
                'type': 'Food',
                'cost': 1200.00,
                'duration': '3 hours',
                'description': 'Culinary walking tour exploring traditional Rajasthani sweets and street snacks.',
                'image': 'bg-jaipur-food'
            }
        ]
    },
    {
        'name': 'Udaipur',
        'country': 'India',
        'region': 'West India',
        'cost_index': '₹₹₹',
        'popularity': 'High',
        'description': 'The romantic City of Lakes surrounded by the Aravali Hills.',
        'image': 'bg-udaipur',
        'activities': [
            {
                'name': 'Lake Pichola Boat Cruise',
                'type': 'Sightseeing',
                'cost': 850.00,
                'duration': '1.5 hours',
                'description': 'Scenic boat tour across Lake Pichola offering sunset views of palaces.',
                'image': 'bg-lake-pichola'
            },
            {
                'name': 'City Palace Udaipur',
                'type': 'History',
                'cost': 450.00,
                'duration': '3 hours',
                'description': 'Palace complex overlooking Lake Pichola with opulent balconies and courtyards.',
                'image': 'bg-udaipur-palace'
            },
            {
                'name': 'Sajjangarh Monsoon Palace',
                'type': 'Sightseeing',
                'cost': 300.00,
                'duration': '2 hours',
                'description': 'Hilltop palace offering panoramic sunset views over the lakes of Udaipur.',
                'image': 'bg-monsoon-palace'
            }
        ]
    },
    {
        'name': 'Goa',
        'country': 'India',
        'region': 'West India',
        'cost_index': '₹₹₹',
        'popularity': 'Very High',
        'description': 'Tropical coastal haven famous for golden sandy beaches, lively shacks, and Portuguese history.',
        'image': 'bg-goa',
        'activities': [
            {
                'name': 'Baga Beach',
                'type': 'Relaxation',
                'cost': 0.00,
                'duration': '4 hours',
                'description': 'Popular beach famous for water sports, beach shacks, and vibrant nightlife.',
                'image': 'bg-baga-beach'
            },
            {
                'name': 'Fort Aguada',
                'type': 'History',
                'cost': 250.00,
                'duration': '2 hours',
                'description': 'Seventeenth-century Portuguese fort and lighthouse overlooking Sinquerim Beach.',
                'image': 'bg-fort-aguada'
            },
            {
                'name': 'Water Sports Adventure',
                'type': 'Adventure',
                'cost': 2500.00,
                'duration': '3 hours',
                'description': 'Exciting jet ski, parasailing, and banana boat rides on the Arabian Sea.',
                'image': 'bg-goa-watersports'
            },
            {
                'name': 'Scuba Diving Experience',
                'type': 'Adventure',
                'cost': 3500.00,
                'duration': '4 hours',
                'description': 'Guided scuba dive off Grande Island with coral reefs and marine life.',
                'image': 'bg-goa-scuba'
            }
        ]
    },
    {
        'name': 'Mumbai',
        'country': 'India',
        'region': 'West India',
        'cost_index': '$$$$',
        'popularity': 'Very High',
        'description': 'The bustling financial capital and entertainment hub of India on the western coast.',
        'image': 'bg-mumbai',
        'activities': [
            {
                'name': 'Gateway of India',
                'type': 'Sightseeing',
                'cost': 0.00,
                'duration': '1.5 hours',
                'description': 'Iconic waterfront monument built in the early 20th century facing the Arabian Sea.',
                'image': 'bg-gateway-india'
            },
            {
                'name': 'Marine Drive Walk',
                'type': 'Sightseeing',
                'cost': 0.00,
                'duration': '2 hours',
                'description': "Scenic 3.6 km long promenade along the coast, famously known as the Queen's Necklace.",
                'image': 'bg-marine-drive'
            },
            {
                'name': 'Elephanta Caves Tour',
                'type': 'History',
                'cost': 260.00,
                'duration': '5 hours',
                'description': 'UNESCO site on Elephanta Island with rock-cut cave temples dedicated to Lord Shiva.',
                'image': 'bg-elephanta-caves'
            }
        ]
    },
    {
        'name': 'Manali',
        'country': 'India',
        'region': 'North India',
        'cost_index': '$$',
        'popularity': 'High',
        'description': 'Popular Himalayan resort town surrounded by pine forests, snowy peaks, and river valleys.',
        'image': 'bg-manali',
        'activities': [
            {
                'name': 'Solang Valley Adventure',
                'type': 'Adventure',
                'cost': 1500.00,
                'duration': '4 hours',
                'description': 'Top destination for paragliding, zorbing, ropeway rides, and winter skiing.',
                'image': 'bg-solang-valley'
            },
            {
                'name': 'Rohtang Pass Excursion',
                'type': 'Adventure',
                'cost': 600.00,
                'duration': '6 hours',
                'description': 'High mountain pass at 3,978 m offering breathtaking snow landscapes and mountain views.',
                'image': 'bg-rohtang-pass'
            },
            {
                'name': 'Mall Road Stroll',
                'type': 'Food & Drink',
                'cost': 0.00,
                'duration': '2.5 hours',
                'description': 'Bustling pedestrian shopping street with local wooden handicrafts, cafes, and eateries.',
                'image': 'bg-mall-road'
            }
        ]
    },
    {
        'name': 'Bengaluru',
        'country': 'India',
        'region': 'South India',
        'cost_index': '$$$',
        'popularity': 'High',
        'description': 'India’s Silicon Valley, famous for tech hubs, sprawling parks, and craft breweries.',
        'image': 'bg-bengaluru',
        'activities': [
            {
                'name': 'Lalbagh Botanical Garden',
                'type': 'Sightseeing',
                'cost': 30.00,
                'duration': '2 hours',
                'description': 'Famous 240-acre botanical garden with a historic glasshouse and rare tropical flora.',
                'image': 'bg-lalbagh'
            },
            {
                'name': 'Bangalore Palace',
                'type': 'History',
                'cost': 230.00,
                'duration': '2.5 hours',
                'description': 'Royal palace built in Tudor-style architecture with elegant wood carvings and grounds.',
                'image': 'bg-bangalore-palace'
            },
            {
                'name': 'Cubbon Park Walk',
                'type': 'Sightseeing',
                'cost': 0.00,
                'duration': '2 hours',
                'description': 'Sprawling green landmark park in the heart of the city ideal for nature walks.',
                'image': 'bg-cubbon-park'
            }
        ]
    },
    {
        'name': 'Hyderabad',
        'country': 'India',
        'region': 'South India',
        'cost_index': '$$',
        'popularity': 'High',
        'description': 'The City of Pearls famous for Nizami architecture, historic forts, and authentic Biryani.',
        'image': 'bg-hyderabad',
        'activities': [
            {
                'name': 'Charminar',
                'type': 'History',
                'cost': 25.00,
                'duration': '1.5 hours',
                'description': '16th-century mosque and landmark monument with four grand minarets in Old Hyderabad.',
                'image': 'bg-charminar'
            },
            {
                'name': 'Golconda Fort',
                'type': 'History',
                'cost': 25.00,
                'duration': '3.5 hours',
                'description': 'Formidable ruined medieval fort complex known for extraordinary acoustic engineering.',
                'image': 'bg-golconda-fort'
            },
            {
                'name': 'Ramoji Film City Tour',
                'type': 'Sightseeing',
                'cost': 1350.00,
                'duration': '6 hours',
                'description': 'World’s largest film studio complex offering film sets, live shows, and theme parks.',
                'image': 'bg-ramoji-film-city'
            }
        ]
    },
    {
        'name': 'Agra',
        'country': 'India',
        'region': 'North India',
        'cost_index': '$$',
        'popularity': 'Very High',
        'description': 'Historic city on the Yamuna river, home to the world-famous Taj Mahal.',
        'image': 'bg-agra',
        'activities': [
            {
                'name': 'Taj Mahal',
                'type': 'History',
                'cost': 1100.00,
                'duration': '3 hours',
                'description': 'World-famous ivory-white marble mausoleum on the south bank of the Yamuna river.',
                'image': 'bg-taj-mahal'
            },
            {
                'name': 'Agra Fort',
                'type': 'History',
                'cost': 600.00,
                'duration': '2.5 hours',
                'description': 'Historical red sandstone fort that was the main residence of the Mughal emperors.',
                'image': 'bg-agra-fort'
            },
            {
                'name': 'Mehtab Bagh Sunset',
                'type': 'Sightseeing',
                'cost': 300.00,
                'duration': '1.5 hours',
                'description': 'Charbagh garden complex providing stunning sunset views of the Taj Mahal across the river.',
                'image': 'bg-mehtab-bagh'
            }
        ]
    },
    {
        'name': 'Varanasi',
        'country': 'India',
        'region': 'North India',
        'cost_index': '$',
        'popularity': 'High',
        'description': 'One of the oldest continually inhabited cities in the world and spiritual heart of India.',
        'image': 'bg-varanasi',
        'activities': [
            {
                'name': 'Dashashwamedh Ghat Ganga Aarti',
                'type': 'Culture',
                'cost': 0.00,
                'duration': '2 hours',
                'description': 'Spiritual and mesmerizing evening river worship ritual along the holy Ganges.',
                'image': 'bg-ganga-aarti'
            },
            {
                'name': 'Kashi Vishwanath Temple',
                'type': 'Culture',
                'cost': 0.00,
                'duration': '2 hours',
                'description': 'One of the most sacred Hindu temples dedicated to Lord Shiva.',
                'image': 'bg-kashi-temple'
            },
            {
                'name': 'Sarnath Deer Park',
                'type': 'History',
                'cost': 25.00,
                'duration': '3 hours',
                'description': 'Historical Buddhist pilgrimage site where Gautama Buddha first taught the Dhamma.',
                'image': 'bg-sarnath'
            }
        ]
    },
    {
        'name': 'Paris',
        'country': 'France',
        'region': 'Europe',
        'cost_index': '$$$$',
        'popularity': 'Very High',
        'description': 'The romantic capital of France, globally famed for art, fashion, gastronomy, and culture.',
        'image': 'bg-paris',
        'activities': [
            {
                'name': 'Eiffel Tower Summit',
                'type': 'Sightseeing',
                'cost': 2500.00,
                'duration': '3 hours',
                'description': 'Ascend the iconic lattice tower for breathtaking panoramic views across Paris.',
                'image': 'bg-eiffel-tower'
            },
            {
                'name': 'Louvre Museum Tour',
                'type': 'Culture',
                'cost': 1800.00,
                'duration': '4 hours',
                'description': 'World’s largest art museum housing iconic masterpieces including Mona Lisa.',
                'image': 'bg-louvre'
            },
            {
                'name': 'Seine River Dinner Cruise',
                'type': 'Food & Drink',
                'cost': 4500.00,
                'duration': '2.5 hours',
                'description': 'Gourmet French dinner cruise past illuminated Parisian monuments along the Seine.',
                'image': 'bg-seine-cruise'
            },
            {
                'name': 'Palace of Versailles Excursion',
                'type': 'History',
                'cost': 2200.00,
                'duration': '5 hours',
                'description': 'Opulent former royal residence of King Louis XIV featuring the Hall of Mirrors.',
                'image': 'bg-versailles'
            }
        ]
    },
    {
        'name': 'Bali',
        'country': 'Indonesia',
        'region': 'Asia',
        'cost_index': '$$',
        'popularity': 'Very High',
        'description': 'Tropical Indonesian island paradise known for volcanic mountains, iconic rice paddies, and beaches.',
        'image': 'bg-bali',
        'activities': [
            {
                'name': 'Tegallalang Rice Terrace Visit',
                'type': 'Sightseeing',
                'cost': 200.00,
                'duration': '2 hours',
                'description': 'Famous terraced hillside landscapes and traditional Balinese irrigation in Ubud.',
                'image': 'bg-tegallalang'
            },
            {
                'name': 'Uluwatu Sunset Temple & Kecak Dance',
                'type': 'Culture',
                'cost': 800.00,
                'duration': '3 hours',
                'description': 'Clifftop sea temple offering dramatic sunset views and live traditional Kecak fire dance.',
                'image': 'bg-uluwatu'
            },
            {
                'name': 'Mount Batur Sunrise Trek',
                'type': 'Adventure',
                'cost': 2500.00,
                'duration': '6 hours',
                'description': 'Guided early-morning volcano hike reaching the peak in time for a stunning sunrise view.',
                'image': 'bg-mount-batur'
            },
            {
                'name': 'Nusa Penida Island Tour',
                'type': 'Adventure',
                'cost': 3500.00,
                'duration': '8 hours',
                'description': 'Day trip visiting Kelingking Beach T-Rex cliff and snorkeling with manta rays.',
                'image': 'bg-nusa-penida'
            }
        ]
    },
    {
        'name': 'Tokyo',
        'country': 'Japan',
        'region': 'Asia',
        'cost_index': '$$$$',
        'popularity': 'Very High',
        'description': 'Japan’s ultra-modern capital combining neon skyscrapers with historic temples.',
        'image': 'bg-tokyo',
        'activities': [
            {
                'name': 'Senso-ji Temple Stroll',
                'type': 'Culture',
                'cost': 0.00,
                'duration': '2 hours',
                'description': 'Tokyo’s oldest and most significant Buddhist temple located in Asakusa.',
                'image': 'bg-sensoji'
            },
            {
                'name': 'Shibuya Crossing & Sky Deck',
                'type': 'Sightseeing',
                'cost': 1200.00,
                'duration': '2 hours',
                'description': 'Experience the world’s busiest pedestrian intersection and observation deck.',
                'image': 'bg-shibuya'
            },
            {
                'name': 'Tsukiji Outer Market Food Tour',
                'type': 'Food & Drink',
                'cost': 2800.00,
                'duration': '3 hours',
                'description': 'Sample fresh sushi, wagyu beef skewers, and authentic Japanese street foods.',
                'image': 'bg-tsukiji'
            }
        ]
    },
    {
        'name': 'Dubai',
        'country': 'UAE',
        'region': 'Middle East',
        'cost_index': '$$$$',
        'popularity': 'Very High',
        'description': 'Luxury desert metropolis famous for futuristic architecture, shopping malls, and nightlife.',
        'image': 'bg-dubai',
        'activities': [
            {
                'name': 'Burj Khalifa Observation Deck',
                'type': 'Sightseeing',
                'cost': 3800.00,
                'duration': '2.5 hours',
                'description': 'Visit the 124th and 125th floors of the world’s tallest skyscraper.',
                'image': 'bg-burj-khalifa'
            },
            {
                'name': 'Desert Safari & BBQ Dinner',
                'type': 'Adventure',
                'cost': 3000.00,
                'duration': '6 hours',
                'description': 'Thrilling dune bashing, camel riding, sandboarding, and Bedouin camp dinner.',
                'image': 'bg-desert-safari'
            },
            {
                'name': 'Dubai Mall & Fountain Show',
                'type': 'Shopping',
                'cost': 0.00,
                'duration': '3 hours',
                'description': 'World’s largest shopping mall with spectacular dancing fountain shows.',
                'image': 'bg-dubai-mall'
            }
        ]
    },
    {
        'name': 'Rome',
        'country': 'Italy',
        'region': 'Europe',
        'cost_index': '$$$',
        'popularity': 'High',
        'description': 'The Eternal City packed with nearly 3,000 years of globally influential art, architecture, and history.',
        'image': 'bg-rome',
        'activities': [
            {
                'name': 'Colosseum & Roman Forum Tour',
                'type': 'History',
                'cost': 2200.00,
                'duration': '3.5 hours',
                'description': 'Walk through the ancient gladiatorial arena and center of the Roman Empire.',
                'image': 'bg-colosseum'
            },
            {
                'name': 'Vatican Museums & Sistine Chapel',
                'type': 'Culture',
                'cost': 2600.00,
                'duration': '4 hours',
                'description': 'Explore papal art collections and Michelangelo’s famous ceiling frescoes.',
                'image': 'bg-vatican'
            },
            {
                'name': 'Trevi Fountain & Gelato Walking Tour',
                'type': 'Food & Drink',
                'cost': 800.00,
                'duration': '2 hours',
                'description': 'Toss a coin in Trevi Fountain and sample handmade Italian gelato in Piazza Navona.',
                'image': 'bg-trevi'
            }
        ]
    },
    {
        'name': 'Singapore',
        'country': 'Singapore',
        'region': 'Asia',
        'cost_index': '$$$$',
        'popularity': 'Very High',
        'description': 'Global financial city-state famous for futuristic gardens, cleanliness, and diverse cuisine.',
        'image': 'bg-singapore',
        'activities': [
            {
                'name': 'Gardens by the Bay & Supertrees',
                'type': 'Sightseeing',
                'cost': 1600.00,
                'duration': '3 hours',
                'description': 'Explore Flower Dome, Cloud Forest waterfall, and light show at Supertree Grove.',
                'image': 'bg-gardens-bay'
            },
            {
                'name': 'Marina Bay Sands Skypark',
                'type': 'Sightseeing',
                'cost': 1800.00,
                'duration': '2 hours',
                'description': 'Observation deck offering panoramic views of Singapore skyline and port.',
                'image': 'bg-marina-bay'
            },
            {
                'name': 'Sentosa Island Cable Car & Beach',
                'type': 'Adventure',
                'cost': 2200.00,
                'duration': '5 hours',
                'description': 'Scenic cable car ride to resort island featuring beaches and attractions.',
                'image': 'bg-sentosa'
            }
        ]
    },
    {
        'name': 'London',
        'country': 'UK',
        'region': 'Europe',
        'cost_index': '$$$$',
        'popularity': 'High',
        'description': 'Capital of the UK blending royal history, world-class theatre, and iconic landmarks.',
        'image': 'bg-london',
        'activities': [
            {
                'name': 'Tower of London & Crown Jewels',
                'type': 'History',
                'cost': 3200.00,
                'duration': '3 hours',
                'description': 'Historic castle fortress on the Thames showcasing Britain’s royal treasures.',
                'image': 'bg-tower-london'
            },
            {
                'name': 'London Eye Flight',
                'type': 'Sightseeing',
                'cost': 3500.00,
                'duration': '1.5 hours',
                'description': 'Giant cantilevered observation wheel providing 360-degree views of Big Ben and Parliament.',
                'image': 'bg-london-eye'
            },
            {
                'name': 'West End Musical Show',
                'type': 'Culture',
                'cost': 4500.00,
                'duration': '3 hours',
                'description': 'Attend world-renowned theatrical performances in London’s West End theatre district.',
                'image': 'bg-west-end'
            }
        ]
    },
    {
        'name': 'New York',
        'country': 'USA',
        'region': 'North America',
        'cost_index': '$$$$$',
        'popularity': 'High',
        'description': 'The Big Apple, a global center of culture, finance, media, and iconic skyscrapers.',
        'image': 'bg-new-york',
        'activities': [
            {
                'name': 'Statue of Liberty Ferry Tour',
                'type': 'Sightseeing',
                'cost': 2200.00,
                'duration': '4 hours',
                'description': 'Ferry to Liberty Island and Ellis Island immigration museum.',
                'image': 'bg-statue-liberty'
            },
            {
                'name': 'Central Park Bicycle Ride',
                'type': 'Adventure',
                'cost': 1500.00,
                'duration': '2.5 hours',
                'description': 'Explore 843 acres of green parkland, bridges, and lakes in Manhattan.',
                'image': 'bg-central-park'
            },
            {
                'name': 'Empire State Building Observatory',
                'type': 'Sightseeing',
                'cost': 3800.00,
                'duration': '2 hours',
                'description': '86th floor open-air observation deck overlooking NYC skyline.',
                'image': 'bg-empire-state'
            }
        ]
    }
]


def seed_database():
    print("Starting database seeding for Search & Budget module...")
    cities_created_count = 0
    cities_updated_count = 0
    activities_created_count = 0
    activities_updated_count = 0

    for item in CITIES_DATA:
        city_info = item.copy()
        activities_list = city_info.pop('activities', [])
        city, created = City.objects.get_or_create(
            name=city_info['name'],
            defaults=city_info
        )
        if created:
            cities_created_count += 1
            print(f"  [+] Created City: {city.name}")
        else:
            cities_updated_count += 1
            for key, val in city_info.items():
                setattr(city, key, val)
            city.save()
            print(f"  [~] Existing City updated: {city.name}")

        for act_info in activities_list:
            activity, act_created = Activity.objects.get_or_create(
                name=act_info['name'],
                city=city,
                defaults=act_info
            )
            if act_created:
                activities_created_count += 1
                print(f"      [+] Created Activity: {activity.name}")
            else:
                activities_updated_count += 1
                for key, val in act_info.items():
                    setattr(activity, key, val)
                activity.save()
                print(f"      [~] Existing Activity updated: {activity.name}")

    # Synchronize with trips app models (trips.models.City and trips.models.Activity)
    try:
        from trips.models import City as TripCity, Activity as TripActivityModel
        for item in CITIES_DATA:
            t_city, _ = TripCity.objects.get_or_create(
                name=item['name'],
                defaults={'country': item['country']}
            )
            for act_info in item.get('activities', []):
                # parse numeric duration if needed
                dur_hours = 2
                try:
                    dur_str = act_info.get('duration', '2')
                    dur_hours = int(float(dur_str.split()[0]))
                except Exception:
                    dur_hours = 2

                TripActivityModel.objects.get_or_create(
                    name=act_info['name'],
                    defaults={
                        'type': act_info.get('type', 'Sightseeing'),
                        'cost': act_info.get('cost', 0.00),
                        'duration_hours': dur_hours
                    }
                )
    except Exception as e:
        print(f"  [-] Warning syncing trips models: {e}")

    # Synchronize with api.models.City if api app is present
    try:
        from api.models import City as ApiCity
        for item in CITIES_DATA:
            ApiCity.objects.get_or_create(
                name=item['name'],
                defaults={
                    'country': item['country'],
                    'description': item['description'],
                    'image_url': item['image']
                }
            )
    except Exception:
        pass

    total_cities = City.objects.count()
    total_activities = Activity.objects.count()

    print("\n" + "=" * 50)
    print("SEED DATA SUMMARY")
    print("=" * 50)
    print(f"Cities Created      : {cities_created_count}")
    print(f"Cities Updated      : {cities_updated_count}")
    print(f"Total Cities in DB  : {total_cities}")
    print(f"Activities Created  : {activities_created_count}")
    print(f"Activities Updated  : {activities_updated_count}")
    print(f"Total Activities DB : {total_activities}")
    print("=" * 50)
    print("Seeding completed successfully!")

if __name__ == '__main__':
    seed_database()

