CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposal_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    score INTEGER NOT NULL CHECK(score >= 0 AND score <= 100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(proposal_id, username)
);

