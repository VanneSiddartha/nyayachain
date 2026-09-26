import os
import sqlite3
from pathlib import Path

db = Path(__file__).resolve().parent / "nyayachain.db"
print("db", db, "exists", db.exists())
if not db.exists():
    raise SystemExit(0)
c = sqlite3.connect(db)
print("tables", c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
print("cases", c.execute("SELECT id, case_reference FROM cases").fetchall())
for t in ["documents", "document_versions", "custody_events"]:
    try:
        print(t, c.execute(f"SELECT count(*) FROM {t}").fetchone())
    except Exception as e:
        print(t, "ERR", type(e).__name__, e)
