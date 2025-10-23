import sqlite3

# Connect to the database
conn = sqlite3.connect("users.db")

# Create a pointer object to access the database through the connection
cur = conn.cursor()

# Run a query
cur.execute("SELECT * FROM users")

# Fetch all rows
rows = cur.fetchall()

# Print them out
for row in rows:
    print(row)

# Close connection when done
conn.close()
