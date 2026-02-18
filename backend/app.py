from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # allow requests from React frontend

# Function to connect to database
def db():
    return sqlite3.connect("data.db")

# Create table if not exists
with db() as con:
    con.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT
        )
    """)

# ------------------- ROUTES -------------------

# Get all users
@app.route("/users", methods=["GET"])
def get_users():
    cur = db().cursor()
    cur.execute("SELECT * FROM users")
    data = cur.fetchall()
    return jsonify(data)

# Add a new user
@app.route("/users", methods=["POST"])
def add_user():
    data = request.json
    with db() as con:
        con.execute(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            (data["name"], data["email"])
        )
    return "User added"

# Update a user
@app.route("/users/<id>", methods=["PUT"])
def update_user(id):
    data = request.json
    with db() as con:
        con.execute(
            "UPDATE users SET name=?, email=? WHERE id=?",
            (data["name"], data["email"], id)
        )
    return "User updated"

# Delete a user
@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    with db() as con:
        con.execute("DELETE FROM users WHERE id=?", (id,))
    return "User deleted"

# Delete all users
@app.route("/users", methods=["DELETE"])
def delete_all_users():
    with db() as con:
        con.execute("DELETE FROM users")
    return "All users deleted"

# ------------------- RUN APP -------------------
if __name__ == "__main__":
    app.run(debug=True)
