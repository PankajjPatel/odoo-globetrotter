import os
import sys
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
        'cost_index': '$$',
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
                'cost': 50.00,
                'duration': '2.5 hours',
                'description': 'Historic fort in Old Delhi that served as the main residence of Mughal Emperors.',
                'image': 'bg-red-fort'
            },
            {
                'name': 'Qutub Minar',
                'type': 'History',
                'cost': 40.00,
                'duration': '2 hours',
                'description': 'UNESCO World Heritage Site featuring a 73-metre tall minaret built in 1193.',
                'image': 'bg-qutub-minar'
            },
            {
                'name': 'National Museum',
                'type': 'Culture',
                'cost': 20.00,
                'duration': '3 hours',
                'description': 'One of the largest museums in India showcasing historic artifacts and masterpieces.',
                'image': 'bg-national-museum'
            }
        ]
    },
    {
        'name': 'Jaipur',
        'country': 'India',
        'region': 'North India',
        'cost_index': '$$',
        'popularity': 'High',
        'description': 'The Pink City of Rajasthan famous for royal palaces, forts, and vibrant bazaars.',
        'image': 'bg-jaipur',
        'activities': [
            {
                'name': 'Amber Fort',
                'type': 'History',
                'cost': 100.00,
                'duration': '3 hours',
                'description': 'Majestic hilltop fort with Hindu-style architecture and sweeping views of Maota Lake.',
                'image': 'bg-amber-fort'
            },
            {
                'name': 'City Palace',
                'type': 'Sightseeing',
                'cost': 200.00,
                'duration': '2 hours',
                'description': 'Royal palace complex in Jaipur including Chandra Mahal and Mubarak Mahal.',
                'image': 'bg-city-palace'
            },
            {
                'name': 'Hawa Mahal',
                'type': 'History',
                'cost': 50.00,
                'duration': '1 hour',
                'description': 'Palace of Winds constructed of red and pink sandstone with ornate honeycombed windows.',
                'image': 'bg-hawa-mahal'
            },
            {
                'name': 'Jaipur Food Tour',
                'type': 'Food & Drink',
                'cost': 500.00,
                'duration': '3 hours',
                'description': 'Guided culinary walking tour trying traditional Rajasthani street foods and kachori.',
                'image': 'bg-jaipur-food'
            }
        ]
    },
    {
        'name': 'Udaipur',
        'country': 'India',
        'region': 'North India',
        'cost_index': '$$$',
        'popularity': 'High',
        'description': 'The City of Lakes known for its romantic settings, marble palaces, and scenic waters.',
        'image': 'bg-udaipur',
        'activities': [
            {
                'name': 'Lake Pichola Boat Cruise',
                'type': 'Sightseeing',
                'cost': 300.00,
                'duration': '2 hours',
                'description': 'Picturesque artificial freshwater lake with boat cruises past Jag Mandir and Lake Palace.',
                'image': 'bg-lake-pichola'
            },
            {
                'name': 'City Palace Udaipur',
                'type': 'History',
                'cost': 250.00,
                'duration': '3 hours',
                'description': 'Grand palace complex built over 400 years overlooking Lake Pichola.',
                'image': 'bg-udaipur-palace'
            },
            {
                'name': 'Sajjangarh Monsoon Palace',
                'type': 'Sightseeing',
                'cost': 90.00,
                'duration': '2 hours',
                'description': 'Monsoon Palace hilltop residence offering panoramic sunset views of the lakes.',
                'image': 'bg-sajjangarh'
            }
        ]
    },
    {
        'name': 'Goa',
        'country': 'India',
        'region': 'West India',
        'cost_index': '$$$',
        'popularity': 'Very High',
        'description': 'Tropical coastal state known for golden beaches, Portuguese heritage, and vibrant nightlife.',
        'image': 'bg-goa',
        'activities': [
            {
                'name': 'Baga Beach',
                'type': 'Adventure',
                'cost': 0.00,
                'duration': '4 hours',
                'description': 'Popular beach known for lively shacks, water sports, and beachside leisure.',
                'image': 'bg-baga-beach'
            },
            {
                'name': 'Fort Aguada',
                'type': 'History',
                'cost': 25.00,
                'duration': '2 hours',
                'description': '17th-century Portuguese fort and lighthouse overlooking the Arabian Sea.',
                'image': 'bg-fort-aguada'
            },
            {
                'name': 'Water Sports Adventure',
                'type': 'Adventure',
                'cost': 1200.00,
                'duration': '2.5 hours',
                'description': 'Exciting jet skiing, parasailing, and banana boat rides on Calangute Beach.',
                'image': 'bg-water-sports'
            },
            {
                'name': 'Scuba Diving Experience',
                'type': 'Adventure',
                'cost': 2500.00,
                'duration': '4 hours',
                'description': 'Guided underwater scuba diving experience near Grande Island with marine life.',
                'image': 'bg-scuba-diving'
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
                'description': 'Scenic 3.6 km long promenade along the coast, famously known as the Queen’s Necklace.',
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
