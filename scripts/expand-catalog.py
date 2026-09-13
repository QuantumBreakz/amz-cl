"""Reproducible local fixture expansion from the observed Amazon homepage.
Names and images are reference content; prices, ratings and inventory are demo fixtures.
"""
import json, shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
manifest = Path('/var/folders/1f/tr5wzfz93kz0z8jnp14m2k5r0000gn/T/browser-use/assets/6b4dd33d-dca9-47d9-8c41-5563c832f9c4/manifest.json')
assets = json.loads(manifest.read_text())['assets']
destination = root / 'public/assets/reference'
destination.mkdir(exist_ok=True)
mapping = {}
for asset in assets:
    if asset['contentType'] not in ['image/jpeg', 'image/png', 'image/webp', 'font/woff2']: continue
    target = destination / Path(asset['path']).name
    shutil.copy2(asset['path'], target)
    mapping[asset['name']] = '/assets/reference/' + target.name
(root / 'lib/reference-assets.json').write_text(json.dumps(mapping, indent=2))
(root / 'docs/reference-assets.json').write_text(json.dumps([{'url': a['url'], 'local': mapping[a['name']]} for a in assets if a['name'] in mapping], indent=2))

# image identifier | product name | department | subcategory | fixture price
rows = '''41ZPiDU6woL|Owala FreeSip Stainless Steel Water Bottle, 24 oz, Black Cherry|Sports & Outdoors|Water Bottles|29.99
61UEXxKIlrL|Amazon Basics Neoprene Dumbbell Hand Weights, Pair, 10 Pounds|Sports & Outdoors|Exercise & Fitness|29.49
61kqPiVuSAL|Owala FreeSip Sway Water Bottle, 30 oz, Denim|Sports & Outdoors|Water Bottles|34.99
61qm+2koyBL|Callaway Golf Supersoft Golf Balls, 12 Pack|Sports & Outdoors|Golf|24.99
61+hrZzQ18L|LifeStraw Personal Water Filter for Hiking, Camping and Travel|Sports & Outdoors|Camping & Hiking|17.47
71S4-NjoTDL|Fit Simplify Resistance Loop Exercise Bands, Set of 5|Sports & Outdoors|Exercise & Fitness|9.95
71CEj9AzUgL|Gaiam Yoga Block, Non-Slip Supportive Foam|Sports & Outdoors|Yoga|9.98
71DxWxvCwlL|LHKNL Rechargeable LED Headlamp, 2 Pack|Sports & Outdoors|Camping & Hiking|19.99
51prbUuRLHL|Wilson Championship Tennis Balls, Extra Duty|Sports & Outdoors|Tennis|4.99
61HHXRkRz6L|Rainleaf Microfiber Quick Dry Travel Towel|Sports & Outdoors|Camping & Hiking|12.99
61lbSexzAUL|Garneck Gold Stainless Steel Mixing and Serving Bowl, 9.4 Inch|Kitchen & Dining|Cookware|21.99
81YlKeBDwML|Homaxy Cotton Waffle Weave Kitchen Dish Cloths, 6 Pack|Kitchen & Dining|Kitchen Linens|9.99
71NpF4JP7HL|Electric Salt and Pepper Grinder Set with Adjustable Coarseness|Kitchen & Dining|Kitchen Tools|24.99
716cglvmUwL|Huusk Japanese Chef Knife, 8 Inch, Full Tang Handle|Kitchen & Dining|Cutlery|29.99
81tgAaVTpXL|Syntus Adjustable Cooking Apron with 2 Pockets|Kitchen & Dining|Kitchen Linens|12.99
71WZluQTSeL|Silicone Jumbo Muffin Pan, Non-Stick, Set of 2|Kitchen & Dining|Bakeware|15.99
311JdFvhtVL|Owala SmoothSip Slider Insulated Stainless Steel Coffee Tumbler|Kitchen & Dining|Coffee & Tea|24.99
71EeTMv8GKL|Quatish Portable Stainless Steel Travel Utensils with Case|Kitchen & Dining|Flatware|8.99
61Eut3FkasL|DeltaTrak Professional Digital Meat Thermometer|Kitchen & Dining|Kitchen Tools|19.99
716HuBmcRsL|TrendPlain Glass Olive Oil Sprayer and Dispenser, 16 oz|Kitchen & Dining|Kitchen Tools|9.99
81sjJMsIhOL|Ninja BN801 Professional Plus Kitchen System, 1400W, Auto-iQ|Kitchen & Dining|Small Appliances|159.99
81n5m6Ulw-L|ORIDOM Acacia Wood Lazy Susan Turntable, 14 Inch|Kitchen & Dining|Storage & Organization|24.99
71GP1cZneBL|Hanes EcoSmart Fleece Pullover Hoodie|Clothing, Shoes & Jewelry|Men|14.99
61CGDIk7SEL|Stelle Soft Leather Ballet Shoes for Girls|Clothing, Shoes & Jewelry|Kids|19.99
71QyRZzbaUL|Hanes EcoSmart Fleece Full-Zip Hooded Sweatshirt|Clothing, Shoes & Jewelry|Men|18.99
51wDsZxtTLL|Gildan Crew T-Shirts, Soft Cotton Multipack|Clothing, Shoes & Jewelry|Men|19.99
51rkKPruYvL|J.VER Long Sleeve Wrinkle-Free Dress Shirt|Clothing, Shoes & Jewelry|Men|22.99
71SRrNMlH0L|Carhartt K87 Loose Fit Heavyweight Pocket T-Shirt|Clothing, Shoes & Jewelry|Men|19.99
61Q13fPs1lL|Amazon Essentials Ribbed Scoop Neck Tank Tops, Pack of 2|Clothing, Shoes & Jewelry|Women|14.90
51ALuls6oZL|YEOREO Ease Straight Leg Workout Leggings|Clothing, Shoes & Jewelry|Women|29.99
61lFO3NRrKL|Hstyle Ruffle Ankle Socks, 6 Pairs|Clothing, Shoes & Jewelry|Women|13.99
61SuPkDGYfL|Crocs Unisex Classic Clog|Clothing, Shoes & Jewelry|Shoes|39.95
71tg-6WKPbL|LILLUSORY Open Front Lightweight Cardigan with Pockets|Clothing, Shoes & Jewelry|Women|32.99
61cUIJInYES|Douglas Chase Border Collie Plush Stuffed Animal, 16 Inch|Toys & Games|Stuffed Animals|29.95
81x+b41M2gL|Little Tikes T-Rex Cozy Coupe Ride-On Toy|Toys & Games|Outdoor Play|69.99
812WxRYZtGL|Hot Wheels City Ultimate Garage with 2 Die-Cast Cars|Toys & Games|Vehicles & Playsets|99.99
713lnXyKmjL|Melissa & Doug Giant Cheetah Lifelike Stuffed Animal|Toys & Games|Stuffed Animals|79.99
71xDrqyNzuL|Dragon Shield Matte Trading Card Sleeves, 100 Count|Toys & Games|Trading Cards|12.99
81yC3+wkGxL|GoSports Portable Cornhole Set with Bean Bags and Carry Case|Toys & Games|Outdoor Play|49.99
81VMo02DKoL|Maxi-Cosi Zelia 2 Luxe 5-in-1 Modular Travel System|Baby|Strollers|399.99
713ykHkGRJL|Mompush Meteor2 Reversible Bassinet Baby Stroller|Baby|Strollers|199.99
61IxcsVycqL|INFANS Folding Baby Changing Table with Bath Tub|Baby|Nursery|129.99
71bnHYPTufL|Pampers Sensitive Unscented Baby Wipes, Multi-Pack|Baby|Diapering|22.99
51HDr5mqkGL|Owala Kids Spill-Resistant Straw Tumbler, 15 oz, Unicorn|Baby|Feeding|14.99
71jOI43ommL|CRAFTSMAN VERSASTACK Lockable Rolling Tool Box|Tools & Home Improvement|Tool Storage|99.99
81XPDrUh9sL|DEWALT 20V MAX Cordless Drill and Impact Driver Combo Kit|Tools & Home Improvement|Power Tools|139.99
71eWRYTIS5L|iSpring 7-Stage Reverse Osmosis Water Filtration System|Tools & Home Improvement|Water Filtration|289.99
61opnzNAaFL|Skar Audio Dual 10 Inch 2400W Loaded Subwoofer Enclosure|Automotive|Car Electronics|249.99
61q403pmagL|Nakkaa Headlight Assembly for Nissan Maxima 2019–2021|Automotive|Lights & Accessories|189.99
71Ryl5xKbuL|LISEN Retractable USB C Car Charger, 84W, Dual Cable|Automotive|Car Electronics|19.99
71j2kJ+5R7L|Old Spice Invisible Solid Antiperspirant Deodorant for Men|Beauty & Personal Care|Personal Care|6.99
81+6huui9GL|VENOMKILLER 6-in-1 Tick Remover Tool Kit|Pet Supplies|Pet Grooming|12.99
71LDkpTW5fL|A Day in the Life of Zianna|Books|Children’s Books|12.99
714VRmqcVmL|Lenovo Idea Tab 11 Inch 2.5K Tablet, 8GB RAM, 256GB|Computers|Tablets|179.99
81-7N-LhOoL|MNN 15.6 Inch Full HD USB-C Portable Monitor|Computers|Monitors|69.99
81j2qQfvoxL|Dell 27 Inch 240Hz Full HD IPS Gaming Monitor|Computers|Monitors|179.99
61DeeFwkrpL|TP-Link Deco 7 Pro Tri-Band Wi-Fi 7 Mesh System|Computers|Networking|299.99
51wX5vhTB4L|JanSport Laptop Backpack with Ergonomic Shoulder Straps|Luggage & Travel|Backpacks|49.99
61oCbMGW57L|Natuvite Foldable Bamboo Luggage Rack with Storage Shelf|Luggage & Travel|Travel Accessories|39.99
71cBfxUjyYL|Nelko P21 Bluetooth Label Maker with Tape|Office Products|Office Electronics|22.99
81lQCqgoUNL|Guangna 240 Acrylic Paint Markers, Brush Tip|Arts & Crafts|Painting|39.99
616sd9yyK+L|HTVRONT Non-Stick Teflon Sheets for Heat Press, 12 Inch x 8 Feet|Arts & Crafts|Crafting|9.99
61CxVoRr7BL|Rit All Purpose Concentrated Color Remover|Arts & Crafts|Fabric Dye|4.99
717cXC1UQdL|GcFoir Self Adhesive Magnetic Sheets, 4 x 6 Inch, 80 Pack|Arts & Crafts|Crafting|19.99
81EcUzLN7FL|Eye Candy Premium Mica Pigment Powder, Orangeola, 50g|Arts & Crafts|Painting|12.99
71wGv7Fh2AL|Levoit Core Mini Air Purifier for Bedroom with Fragrance Sponge|Home & Kitchen|Air Quality|39.99
712wdsCwBkL|Gorilla Grip Absorbent Chenille Bath Rug, 24 x 17 Inch|Home & Kitchen|Bath|12.99
51gpc1r1PGL|EIUE Hotel Collection King Size Bed Pillows, 2 Pack|Home & Kitchen|Bedding|24.99
71dNwm+Vj8L|Scalloped Picture Frame with Real Glass, 5 x 7 Inch, Olive Green|Home & Kitchen|Home Décor|14.99
71SWO2d3WcL|Lasko Oscillating Pedestal Fan, Adjustable 47 Inch|Home & Kitchen|Fans|34.99
61pQJkr3hYL|Tapo LiDAR Robot Vacuum and Mop with Self-Emptying Dock|Home & Kitchen|Vacuums|229.99
71tsg-7mqHL|Handy Laundry Extra Large Nylon Laundry Bag, Navy Blue|Home & Kitchen|Storage & Organization|7.99
61-mTtLvQ6L|OWAAE Quiet Dehumidifier with Auto Shutoff, 1000 Sq Ft|Home & Kitchen|Air Quality|59.99
41R4vNxhXtL|XFSPYY Reusable Microfiber Cleaning Cloths, Green|Health & Household|Household Supplies|9.99
61UVPi1tYML|AcuRite Digital Indoor Thermometer and Humidity Meter|Health & Household|Home Environment|12.99
71mqaEv2KRL|HyperX Cloud III S Wireless Gaming Headset|Video Games|Gaming Accessories|129.99
81VrmGXhZKL|DJI Osmo Action 4 Essential Combo, Waterproof 4K Camera|Electronics|Cameras|199.99
71E7t6HQ2DL|CMF Buds Pro 2 Wireless Noise Cancelling Earbuds|Electronics|Audio|59.99
614YGaNBmUL|UGREEN Nexode Air 65W USB-C GaN Charger with Cable|Electronics|Accessories|29.99
61m+fKy7wzL|Garmin Forerunner 165 GPS Running Smartwatch, Black|Electronics|Wearable Technology|249.99
61AfYlS-zhL|UGREEN Uno 30W Robot USB-C GaN Fast Charger|Electronics|Accessories|19.99'''
catalog = json.loads((root / 'lib/catalog.json').read_text())
catalog['products'] = [p for p in catalog['products'] if not p['id'].startswith('ref-')]
for p in catalog['products']:
    if p['category'].startswith('Fashion'): p['category'] = 'Clothing, Shoes & Jewelry'
for i, row in enumerate(rows.splitlines()):
    image, name, category, sub, price = row.split('|')
    matches = [v for k,v in mapping.items() if k.startswith(image + '.')]
    if not matches: print('Missing', image); continue
    price = float(price)
    catalog['products'].append(dict(id=f'ref-{i+1}', name=name, price=price, originalPrice=round(price*1.25,2), categoryId=category, subCategoryId=sub, category=category, subCategory=sub, images=[matches[0]], description=f'{name}. Explore this selection from {category.lower()} and find the right fit for your everyday needs.', inStock=True, stockQuantity=25+i%35, rating=round(4.2+(i%7)/10,1), ratingCount=128+i*379, brand='Amazon Basics' if name.startswith('Amazon Basics') else name.split()[0], isDeal=i%3==0, isBestseller=i%4==0))
names=sorted(set(p['category'] for p in catalog['products']))
catalog['categories']=[dict(id=name,name=name,image=next(p['images'][0] for p in catalog['products'] if p['category']==name),order=i,subCategories=[dict(id=sub,name=sub) for sub in sorted(set(p['subCategory'] for p in catalog['products'] if p['category']==name))]) for i,name in enumerate(names)]
(root / 'lib/catalog.json').write_text(json.dumps(catalog,indent=2))
print(f"{len(catalog['products'])} products, {len(names)} populated departments")
