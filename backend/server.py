from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import sqlite3
from datetime import datetime

# Init
app = Flask(__name__)

# Don't worry about this! Just some required security stuff; look into CORS and cross-site-scripting (XSS) if you're interested!
CORS(app)

# Place endpoints in this space; they define functions/routes the app will save and look out for when requests come in
# It'll parse and match accordingly; otherwise, it'll reject with a 404 error
# Also, you may see HTTP requests with an OPTIONS method; this just a "preflight" check done automatically to prevent against XSS (as mentioned above)

@app.get('/items')
def list_items():
    # Return all items ordered by timestamp

    # Connect to items database
    conn = sqlite3.connect("items.db")
    cur = conn.cursor()
    cur.execute('SELECT id, user, message, timestamp FROM items ORDER BY timestamp DESC')
    rows = cur.fetchall()
    conn.close()

    items = []
    for r in rows:
        items.append({'id': r[0], 'user': r[1], 'message': r[2], 'timestamp': r[3]})

    return jsonify(items)


@app.post('/items')
def create_item():
    # Add new item to items database

    # Error checking
    data = request.get_json(silent=True)
    print(data)
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    user = data.get('user')
    message = data.get('message')
    if not user or not message:
        return jsonify({'error': 'user and message required'}), 400

    ts = datetime.utcnow().isoformat() + 'Z'

    conn = sqlite3.connect("items.db")
    cur = conn.cursor()
    cur.execute('INSERT INTO items (user, message, timestamp) VALUES (?, ?, ?)', (user, message, ts))

    # Commit tells the connection to make the db modifications permanent
    conn.commit()
    conn.close()

    return jsonify({'message': 'added'}), 201


# How about by username?
@app.get('/items/<int:item_id>')
def get_item_by_id(item_id: int):
    conn = sqlite3.connect("items.db")
    cur = conn.cursor()
    cur.execute('SELECT id, user, message, timestamp FROM items WHERE id = ?', (item_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'not found'}), 404

    return jsonify({'id': row[0], 'user': row[1], 'message': row[2], 'timestamp': row[3]})


@app.delete('/items/<int:item_id>')
def delete_item(item_id: int):
    conn = sqlite3.connect("items.db")
    cur = conn.cursor()
    cur.execute('DELETE FROM items WHERE id = ?', (item_id,))
    affected = cur.rowcount # How many rows were deleted by the SQL query, if DELETE WHERE email = ..., check rowcount > 0
    conn.commit()
    conn.close()
    if affected == 0:
        return jsonify({'error': 'not found'}), 404
    return jsonify({'status': 'deleted'}), 200





# New APIs for user sign up and sign in that connect to the database users.db

@app.post('/api/signup')
def signup():
    data = request.get_json(silent=True)

    # API error checking
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    # Connect to the users db
    conn = sqlite3.connect("users.db")
    cur = conn.cursor()
    cur.execute('SELECT id FROM users WHERE email = ?', (email,))

    # fetchone gets next row returned from SQL query
    if cur.fetchone():
        conn.close()
        return jsonify({'error': 'user already exists'}), 409

    cur.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, password))
    conn.commit()
    conn.close()
    return jsonify({'status': 'created'}), 201


@app.post('/api/signin')
def signin():
    data = request.get_json(silent=True)

    # API error checking
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    conn = sqlite3.connect("users.db")
    cur = conn.cursor()
    cur.execute('SELECT password FROM users WHERE email = ?', (email,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return jsonify({'error': 'invalid credentials'}), 401

    real_password = row[0]
    # Check that the password is correct if user exists
    if real_password != password:
        return jsonify({'error': 'invalid credentials'}), 401

    # Successful authentication (user is logged out on site refresh)
    return jsonify({'status': 'signed-in'}), 200


if __name__ == "__main__":
    # Change port if necessary (i.e., 8080 is occupied)
    app.run(host="localhost", port=8080)


