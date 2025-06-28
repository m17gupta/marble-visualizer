-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  material_category_id INTEGER NOT NULL REFERENCES material_category(id) ON DELETE CASCADE,
  material_brand_id INTEGER NOT NULL REFERENCES material_brand(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  type VARCHAR(50) CHECK (type IN ('texture', 'color', 'pattern', 'fabric')) NOT NULL,
  thumbnail VARCHAR(500),
  preview_url VARCHAR(500),
  texture_url VARCHAR(500),
  color_code VARCHAR(20),
  finish VARCHAR(100),
  coating_type VARCHAR(100),
  substrate VARCHAR(100),
  price DECIMAL(10,2),
  is_premium BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  properties JSONB,
  status BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(material_category_id);
CREATE INDEX IF NOT EXISTS idx_materials_brand ON materials(material_brand_id);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_premium ON materials(is_premium);
CREATE INDEX IF NOT EXISTS idx_materials_price ON materials(price);
CREATE INDEX IF NOT EXISTS idx_materials_tags ON materials USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_materials_search ON materials USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_materials_slug ON materials(slug);
CREATE INDEX IF NOT EXISTS idx_materials_sku ON materials(sku);
CREATE INDEX IF NOT EXISTS idx_materials_sort ON materials(sort_order);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_materials_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_materials_updated_at_trigger ON materials;
CREATE TRIGGER update_materials_updated_at_trigger
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_materials_updated_at();

-- Enable RLS if needed (uncomment if using Row Level Security)
-- ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create policies for materials table (uncomment and modify as needed)
-- CREATE POLICY "Materials are viewable by everyone"
--   ON materials
--   FOR SELECT
--   USING (true);

-- CREATE POLICY "Authenticated users can create materials"
--   ON materials
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (true);

-- CREATE POLICY "Users can update materials they created"
--   ON materials
--   FOR UPDATE
--   TO authenticated
--   USING (true);

-- CREATE POLICY "Users can delete materials they created"
--   ON materials
--   FOR DELETE
--   TO authenticated
--   USING (true);

-- Add some sample data (optional - remove if not needed)
INSERT INTO materials (
  material_category_id,
  material_brand_id,
  title,
  slug,
  description,
  sku,
  type,
  thumbnail,
  color_code,
  price,
  is_premium,
  tags,
  status,
  sort_order
) VALUES 
(1, 1, 'Premium Concrete Texture', 'premium-concrete-texture', 'High-resolution concrete texture with realistic surface details', 'PCT-001', 'texture', 'https://example.com/concrete-thumb.jpg', null, 19.99, true, '{"concrete", "texture", "premium", "gray"}', true, 1),
(1, 2, 'Natural Wood Grain', 'natural-wood-grain', 'Beautiful natural wood grain pattern', 'NWG-002', 'texture', 'https://example.com/wood-thumb.jpg', null, 15.99, false, '{"wood", "natural", "brown", "grain"}', true, 2),
(2, 3, 'Ocean Blue', 'ocean-blue', 'Calming ocean blue color', 'OB-003', 'color', 'https://example.com/blue-thumb.jpg', '#2E86AB', 9.99, false, '{"blue", "ocean", "calm", "water"}', true, 3),
(3, 1, 'Luxury Velvet Fabric', 'luxury-velvet-fabric', 'Premium velvet fabric with soft texture', 'LVF-004', 'fabric', 'https://example.com/velvet-thumb.jpg', null, 29.99, true, '{"velvet", "luxury", "soft", "fabric"}', true, 4)
ON CONFLICT (slug) DO NOTHING;
