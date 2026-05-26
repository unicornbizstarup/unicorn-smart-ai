-- Migration: Update Product Categories to Premium Branding
-- Date: 2026-02-28

-- 1. Insert new categories or update existing ones by slug
INSERT INTO product_categories (name, slug, sort_order)
VALUES
  ('U-LIFE BOOST', 'u-life-boost', 1),
  ('U-SKIN',       'u-skin',       2),
  ('U-CARE',       'u-care',       3),
  ('U-PLANT',      'u-plant',      4),
  ('U-TECH',       'u-tech',       5)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order;

-- 2. Optional: If you want to deactivate old categories that don't match the new slugs
UPDATE product_categories
SET is_active = FALSE
WHERE slug NOT IN ('u-life-boost', 'u-skin', 'u-care', 'u-plant', 'u-tech');
