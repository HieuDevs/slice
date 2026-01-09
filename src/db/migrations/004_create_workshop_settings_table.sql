CREATE TABLE IF NOT EXISTS workshop_settings (
    id INTEGER PRIMARY KEY CHECK(id = 1),
    is_locked INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO workshop_settings (id, is_locked) VALUES (1, 0);

