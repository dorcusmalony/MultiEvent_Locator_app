-- Change the type of the `location` column to GEOMETRY(Point, 4326)
ALTER TABLE events
    ALTER COLUMN location TYPE GEOMETRY(Point, 4326) USING location::geometry;

-- Allow NULL values for `location`
ALTER TABLE events
    ALTER COLUMN location DROP NOT NULL;

-- Remove default values for `latitude` and `longitude`
ALTER TABLE events
    ALTER COLUMN latitude DROP DEFAULT,
    ALTER COLUMN longitude DROP DEFAULT;

-- Ensure `latitude` and `longitude` are NOT NULL
ALTER TABLE events
    ALTER COLUMN latitude SET NOT NULL,
    ALTER COLUMN longitude SET NOT NULL;

-- Ensure `name` and `categories` are NOT NULL
ALTER TABLE events
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN categories SET NOT NULL;
