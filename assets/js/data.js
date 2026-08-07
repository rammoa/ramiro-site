/* ============================================================
   SITE DATA — edit here to change images, prints, and pricing.
   Images currently load from Ramiro's live Squarespace CDN.
   For production, replace CDN_BASE with your own optimized image URLs.
   ============================================================ */
(function (w) {
  var CDN_BASE = 'https://images.squarespace-cdn.com/content/v1/63ba51fb90f98d55e734bffe/';
  function img(seg, width) { return CDN_BASE + seg + '?format=' + (width || 1500) + 'w'; }

  var HERO = '1673491763391-B9MS42ETWEONO4VIQZ82/DJI_0200.JPG';

  // -------- PORTFOLIO GALLERIES --------
  var AERIAL = [
    ['1674612118141-NSB5OU8GD16M4ORVM2O8/DJI_0383-Edit.jpg', 'Dallas · golden hour'],
    ['1674612119078-DU2LTFNHB5DRKHF6IRCN/DJI_0394-HDR-Edit.jpg', 'Suburb sprawl'],
    ['1674612121138-ZG5SR8QSPAK60Y9CQ2Z8/DJI_0523-Edit-Edit.jpg', 'Lakeside'],
    ['1674612122164-CX9KZYSROXXHG2HZCSHW/DJI_0539.jpg', 'Overpass'],
    ['1674612120333-X0J608A03RUD5YSI0SOW/DJI_0532-Edit-Edit.jpg', 'Neighborhood grid'],
    ['1673492349758-VZ62IUWSLLLHD3SZINSL/DJI_0200.JPG', 'Skyline at dusk']
  ];
  // Spaces / Real estate — new self-hosted photos interleaved with existing CDN shots.
  var ESTATE = [
    ['assets/img/portfolio/spaces/exterior.jpg', 'Exterior'],
    ['1674612114001-TD0YZFEYBRZMC5SHPITX/8E8A4726.jpg', 'Living room'],
    ['assets/img/portfolio/spaces/open-concept.jpg', 'Open concept'],
    ['1674612114348-0TP9KV75KO7XGKOKCH2U/8E8A4734.jpg', 'Dining'],
    ['assets/img/portfolio/spaces/kitchen-1.jpg', 'Kitchen'],
    ['1674612115646-3840LYU1ZSVO7QLE0AHB/8E8A5155-HDR-Edit.jpg', 'Great room · HDR'],
    ['assets/img/portfolio/spaces/living-room.jpg', 'Great room'],
    ['1674612115142-DISGWEMOO55JKP50T250/8E8A4737.jpg', 'Kitchen'],
    ['assets/img/portfolio/spaces/kitchen-2.jpg', 'Kitchen'],
    ['1674612116908-H6RUF3Z4C9ECE7E6DP8H/8E8A6617-HDR.jpg', 'Primary suite · HDR'],
    ['1674612117522-IAKJKKKU7M42CL40T2U3/8E8A8795-HDR-Edit-Edit-Edit-Edit.jpg', 'Exterior · dusk']
  ];
  // People — new "Other Work" (self-hosted) + existing portraits (CDN), interleaved.
  var PORTRAIT = [
    ['assets/img/portfolio/people/portrait-1.jpg', 'Headshot'],
    ['1674781293200-5R2PION4RCTKTHSKFT8G/8E8A1587.jpg', 'Portrait'],
    ['assets/img/portfolio/people/graduation.jpg', 'Graduation'],
    ['1674781294098-D4QT17DA3SR3OUM5HF0F/8E8A2015.jpg', 'Portrait'],
    ['assets/img/portfolio/people/lifestyle-1.jpg', 'Lifestyle'],
    ['assets/img/portfolio/people/razors-1.jpg', 'Barbershop'],
    ['1674781294224-YC78LFG92G1TT7HXX14O/8E8A5936.jpg', 'Portrait'],
    ['assets/img/portfolio/people/portrait-2.jpg', 'Headshot'],
    ['1674781294984-M03ZUNYG85KMIZY1O09E/8E8A5973.jpg', 'Portrait'],
    ['assets/img/portfolio/people/razors-3.jpg', 'Barbershop'],
    ['1674824585876-TK2LPTONVX82KEOAUPCC/8E8A9723-Edit.jpg', 'Portrait'],
    ['assets/img/portfolio/people/bw-graduation.jpg', 'Graduation'],
    ['1674824841510-90WNJTJW25TW8FAGZP9V/8E8A9613-Edit.jpg', 'Portrait'],
    ['assets/img/portfolio/people/lifestyle-2.jpg', 'Lifestyle'],
    ['1674781297147-V2KEW8F7PHEZ808WBDOJ/8E8A9740.jpg', 'Portrait'],
    ['assets/img/portfolio/people/razors-2.jpg', 'Barbershop']
  ];

  // ============================================================
  //  PRINT STORE
  //  Accessible / volume pricing, paper prints only.
  //  ONE place to change pricing for every print: PRINT_SIZES.
  //  Sizes are inches. Price is whole USD.
  //  (Keep these prices in sync with ALLOWED_PRICES in
  //   netlify/functions/create-checkout.js)
  // ============================================================
  var PRINT_SIZES = [ ['12×18', 45], ['18×24', 85], ['24×36', 150] ];

  // [ id, title, badge, imageSegment ]
  var PRINT_ITEMS = [
    ['dallas-skyline',      'Dallas Skyline',        'Skyline',   '1673492349758-VZ62IUWSLLLHD3SZINSL/DJI_0200.JPG'],
    ['el-sunset-de-dallas', 'El Sunset de Dallas',   'Skyline',   '1674614258130-28UQRJZMCEM5MX36KS3B/DJI_0200-2.JPG'],
    ['la-dallas',           'La Dallas',             'Cityscape', '1673492350448-WHWRY4FDGVC3UZFPSNB9/GalaxyDallas2.jpg'],
    ['el-att-fog',          'El AT&T Fog',           'Cityscape', '1673492359292-BGUKPQYCUZT1MRM6Y2J9/IMG_5347-Edit.jpg'],
    ['el-bridge',           'El Bridge',             'Cityscape', '1673492359467-25HT1PUZ1OHI4KAHJJF2/IMG_4890-Edit.jpg'],
    ['el-new-year-dallas',  'El New Year in Dallas', 'Aerial',    '1673492347388-JCQHOPO7H8I5SO8664DE/DJI_0384-Edit-Edit-Edit.jpg'],
    ['la-mountain',         'La Mountain',           'Aerial',    '1673492341287-XX8WT9BX9E4UZVIQI2ST/DJI_0328-Edit.jpg'],
    ['el-sunny-day',        'El Sunny Day in the D', 'Aerial',    '1673492319710-8467HRAOS1H107YLU10C/DJI_0058-Edit.jpg'],
    ['el-boat-drive',       'El Boat Drive',         'Aerial',    '1673492349192-CIO2VFINQXAZX0CRO49P/DJI_0386-Edit.jpg'],
    ['la-ball',             'La Ball',               'Street',    '1673492368893-DOIJ2FPM788IZTRGNY5H/IMG_8937-Edit.jpg'],
    ['la-street',           'La Street',             'Street',    '1673492369529-5CGVK5C15IUQ2KHU1NFT/IMG_7834-Edit.jpg'],
    ['el-woody',            'El Woody',              'Street',    '1673525699535-Q6S5I41ZO6BMBAEP6RJJ/......jpg'],
    ['el-thunder',          'El Thunder',            'Street',    '1675989356581-0AP8NDO20MVSHFPQVXPK/IMG_0830.jpg'],
    ['el-kid-thunder',      'El Kid Thunder',        'Street',    '1673492358001-4VODPRYK28YGVMJD0CRS/IMG_0346-Edit-Edit.jpg'],
    ['el-bro-on-el-wire',   'El Bro on El Wire',     'Street',    '1674614111848-L9MYJQ9NTU8Y9OXM4MNN/4-Edit-Edit-Edit.JPG'],
    ['el-happy-drinko',     'El Happy 5 de Drinko',  'Street',    '1673492328719-IJFYFCE9RF67WO75C5BP/8E8A7793-Edit-Edit.jpg'],
    ['el-beavers',          'El Beavers',            'Street',    '1673492315638-L8R2DDCKPDZ5GSF8TZF4/8E8A7454-Edit-2-100-2.jpg'],
    ['el-cowboy',           'El Cowboy',             'Portrait',  '1673492315641-UZN302V1ECVMIRZ07WB1/8E8A4916-Edit-Edit.jpg'],
    ['el-porsche-master',   'El Porsche Master',     'Portrait',  '1674614706094-87QN5PRQ44JJXM8LNLX6/8E8A9218-Edit-Edit.jpg'],
    ['la-porche',           'La Porche',             'Portrait',  '1674614735919-FKMP5MD8Q9HENL8HZOVM/8E8A9260-Edit.jpg'],
    ['el-bro-hiker',        'El Bro Hiker',          'Portrait',  '1674614625940-9UH4R1VNHEG9LBT43Y23/8E8A6813-Edit-Edit-Edit-Edit.jpg'],
    ['el-bro-hiker-2',      'El Bro Hiker Pt. 2',    'Portrait',  '1674614675914-72KYMKLJYZO5EICVG0TI/8E8A6849-Edit-Edit-2-Edit.jpg']
  ];

  var PRINTS = PRINT_ITEMS.map(function (p) {
    return { id: p[0], title: p[1], badge: p[2], img: p[3], sizes: PRINT_SIZES };
  });

  // filter categories used by the shop filter bar
  var PRINT_CATEGORIES = ['All', 'Skyline', 'Cityscape', 'Aerial', 'Street', 'Portrait'];

  // -------- SERVICE PACKAGES --------
  // No prices — every project is quoted individually. Cards show a "request a quote" CTA.
  var SERVICES = [
    { k: 'Real Estate', title: 'Listing Photography', desc: 'HDR interior & exterior stills that make a property stand out and sell faster.' },
    { k: 'Real Estate', title: 'Aerial & Drone', desc: 'Licensed drone photo & video — lot lines, neighborhood context, cinematic reveals.' },
    { k: 'Real Estate', title: 'Listing Video Tour', desc: 'Walkthrough video edited to music, formatted for MLS, YouTube & social.' },
    { k: 'People', title: 'Portrait Sessions', desc: 'Headshots, families, couples & personal branding — studio or on location.' },
    { k: 'Video', title: 'Color Grading', desc: 'Cinematic color for filmmakers & creators — your footage, elevated.' },
    { k: 'Creative', title: 'Commercial & Events', desc: 'Brands, venues & events across DFW. Photo, video, or both.' }
  ];

  w.SITE = {
    img: img,
    HERO: HERO,
    AERIAL: AERIAL, ESTATE: ESTATE, PORTRAIT: PORTRAIT,
    PRINTS: PRINTS,
    PRINT_CATEGORIES: PRINT_CATEGORIES,
    SERVICES: SERVICES,
    contact: { phone: '469 432 1084', email: 'ramiromorales234@gmail.com', instagram: 'https://instagram.com/' }
  };
})(window);
