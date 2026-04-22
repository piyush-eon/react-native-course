# Let's build Kribb in React Native 👋
<img width="893" height="355" alt="a-minimal-modern-logo-design-for-kribb-a_HXGKabojQta7r07-2pIIoQ_Yp8A-TZSRRKlOeUPJe2Wwg_sd" src="https://github.com/user-attachments/assets/29b2cbd5-e997-40df-a13a-eb70e7a2a719" />

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start -c
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Supabase Queries

### User Table

```sql
create table users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique not null,
  email text not null,
  first_name text,
  last_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);
```

### User RLS Policies

```sql
-- Enable RLS on users table
alter table users enable row level security;

create policy "Users can insert own row"
on users for insert
with check (clerk_id = auth.jwt()->>'sub');

create policy "Users can read own row"
on users for select
using (clerk_id = auth.jwt()->>'sub');

create policy "Users can update own row"
on users for update
using (clerk_id = auth.jwt()->>'sub');
```

### Properties Table

```sql
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  type text not null, -- 'apartment' | 'house' | 'villa' | 'studio'
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  area_sqft int,
  address text not null,
  city text not null,
  latitude float,
  longitude float,
  images text[] default '{}', -- array of Supabase Storage URLs
  is_featured boolean default false,
  is_sold boolean default false,
  created_at timestamp with time zone default now()
);

alter table properties enable row level security;

-- Anyone can read properties (public listings)
create policy "Properties are publicly readable"
on properties for select
using (true);
```

### Saved Property Table

```sql
create table saved_properties (
  id uuid default gen_random_uuid() primary key,
  user_clerk_id text not null references users(clerk_id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_clerk_id, property_id) -- prevents duplicate saves
);

alter table saved_properties enable row level security;

create policy "Users can read own saved properties"
on saved_properties for select
using (user_clerk_id = auth.jwt()->>'sub');

create policy "Users can insert saved properties"
on saved_properties for insert
with check (user_clerk_id = auth.jwt()->>'sub');

create policy "Users can delete own saved properties"
on saved_properties for delete
using (user_clerk_id = auth.jwt()->>'sub');

```

### Insert Public Property Image Bucket

```sql
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true);

-- Allow anyone to read images (they're public listings)
create policy "Public can read property images"
on storage.objects for select
using (bucket_id = 'property-images');
```

### Admin Flag and Properties RLS Policies

```sql
alter table users 
add column is_admin boolean default false;

create policy "Admin can insert properties"
on properties for insert
with check (
  exists (
    select 1 from users
    where clerk_id = auth.jwt()->>'sub'
    and is_admin = true
  )
);

create policy "Admin can update properties"
on properties for update
using (
  exists (
    select 1 from users
    where clerk_id = auth.jwt()->>'sub'
    and is_admin = true
  )
);

create policy "Admin can delete properties"
on properties for delete
using (
  exists (
    select 1 from users
    where clerk_id = auth.jwt()->>'sub'
    and is_admin = true
  )
);

create policy "Admin can upload property images"
on storage.objects for insert
with check (
  bucket_id = 'property-images'
  and exists (
    select 1 from users
    where clerk_id = auth.jwt()->>'sub'
    and is_admin = true
  )
);
```

### Seeding Properties

```sql
insert into properties (
  title, description, price, type, bedrooms, bathrooms,
  area_sqft, address, city, latitude, longitude, images, is_featured
) values

-- Featured Properties
(
  'Modern Luxury Villa',
  'A stunning modern villa with open floor plan, floor-to-ceiling windows, and a private pool. Perfect for families looking for premium living.',
  12500000,
  'villa',
  4, 3, 3200,
  '14 Palm Grove Lane',
  'Mumbai',
  19.1136, 72.8697,
  ARRAY[
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800'
  ],
  true
),
(
  'Sky View Penthouse',
  'Breathtaking penthouse on the 32nd floor with panoramic city views, private terrace, and top-of-the-line finishes throughout.',
  28000000,
  'apartment',
  3, 2, 2800,
  '1 Skyline Tower, BKC',
  'Mumbai',
  19.0596, 72.8656,
  ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800'
  ],
  true
),
(
  'Green Valley Bungalow',
  'Spacious bungalow surrounded by lush greenery with a large garden, modern kitchen, and serene neighborhood.',
  8500000,
  'house',
  5, 4, 4500,
  '7 Green Valley Road',
  'Bangalore',
  12.9716, 77.5946,
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
  ],
  true
),
(
  'Downtown Studio Loft',
  'Chic studio loft in the heart of the city. Perfect for young professionals. Walking distance to metro, cafes, and offices.',
  3200000,
  'studio',
  1, 1, 650,
  '22 MG Road',
  'Bangalore',
  12.9756, 77.6097,
  ARRAY[
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
  ],
  true
),

-- Regular Properties
(
  'Cozy 2BHK Apartment',
  'Well-maintained apartment in a gated society with gym, clubhouse, and 24/7 security. Great connectivity to IT hubs.',
  5500000,
  'apartment',
  2, 2, 1100,
  '45 Whitefield Main Road',
  'Bangalore',
  12.9698, 77.7499,
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
  ],
  false
),
(
  'Sea Facing 3BHK',
  'Premium sea-facing apartment with stunning Arabian Sea views, spacious balcony, modular kitchen, and covered parking.',
  18500000,
  'apartment',
  3, 2, 1800,
  '9 Marine Drive',
  'Mumbai',
  18.9438, 72.8235,
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800'
  ],
  false
),
(
  'Heritage Row House',
  'Beautifully restored heritage row house with original architecture, courtyard, and modern interiors. Rare find in old city.',
  9200000,
  'house',
  4, 3, 2800,
  '3 Civil Lines',
  'Delhi',
  28.6862, 77.2217,
  ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ],
  false
),
(
  'Golf Course Villa',
  'Luxurious villa overlooking the golf course with private pool, landscaped garden, and world-class amenities.',
  45000000,
  'villa',
  5, 5, 6000,
  '1 Golf Course Road',
  'Gurugram',
  28.4595, 77.0266,
  ARRAY[
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
  ],
  false
),
(
  'Smart Studio Apartment',
  'Fully furnished smart studio with automated lighting, AC, and security. Ideal for bachelors and working professionals.',
  2800000,
  'studio',
  1, 1, 500,
  '18 Cyber City',
  'Gurugram',
  28.4943, 77.0880,
  ARRAY[
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'
  ],
  false
),
(
  'Lake View Cottage',
  'Peaceful 3-bedroom cottage with direct lake view, private garden, and a cozy fireplace. Perfect for a quiet family life.',
  6800000,
  'house',
  3, 2, 1900,
  '5 Lake Shore Drive',
  'Pune',
  18.5204, 73.8567,
  ARRAY[
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
    'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800'
  ],
  false
),
(
  'IT Corridor Flat',
  'Affordable 2BHK in a prime IT corridor location. Walking distance to major tech parks, metro station, and shopping mall.',
  4200000,
  'apartment',
  2, 1, 950,
  '67 HITEC City',
  'Hyderabad',
  17.4474, 78.3762,
  ARRAY[
    'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800'
  ],
  false
),
(
  'Old City Haveli',
  'Majestic haveli with stunning Mughal-inspired architecture, rooftop terrace with city views, and 6 large bedrooms.',
  15000000,
  'villa',
  6, 4, 5200,
  '12 Charminar Road',
  'Hyderabad',
  17.3616, 78.4747,
  ARRAY[
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
    'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800'
  ],
  false
);
```
