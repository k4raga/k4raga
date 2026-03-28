from flask import Flask, jsonify, request, send_from_directory
from datetime import datetime
import sqlite3
import json
import os

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'training.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS training (
                date      TEXT PRIMARY KEY,
                cs        INTEGER DEFAULT 0,
                voice     INTEGER DEFAULT 0,
                cs_tasks  TEXT    DEFAULT '[]'
            )
        ''')

# --- Static files ---

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)

# --- API: date ---

@app.route('/api/date')
def get_date():
    now = datetime.now()
    return jsonify({
        'date':  now.strftime('%Y-%m-%d'),
        'year':  now.year,
        'month': now.month,
        'day':   now.day
    })

# --- API: training ---

@app.route('/api/training', methods=['GET'])
def get_all_training():
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM training').fetchall()
    result = {}
    for row in rows:
        result[row['date']] = {
            'cs':       bool(row['cs']),
            'voice':    bool(row['voice']),
            'cs_tasks': json.loads(row['cs_tasks'])
        }
    return jsonify(result)

@app.route('/api/training/<date>', methods=['GET'])
def get_training(date):
    with get_db() as conn:
        row = conn.execute('SELECT * FROM training WHERE date = ?', (date,)).fetchone()
    if row:
        return jsonify({
            'cs':       bool(row['cs']),
            'voice':    bool(row['voice']),
            'cs_tasks': json.loads(row['cs_tasks'])
        })
    return jsonify({'cs': False, 'voice': False, 'cs_tasks': []})

@app.route('/api/training/<date>', methods=['POST'])
def update_training(date):
    data = request.get_json() or {}
    with get_db() as conn:
        conn.execute('''
            INSERT INTO training (date, cs, voice, cs_tasks)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
                cs       = COALESCE(excluded.cs,       cs),
                voice    = COALESCE(excluded.voice,    voice),
                cs_tasks = COALESCE(excluded.cs_tasks, cs_tasks)
        ''', (
            date,
            int(data['cs'])       if 'cs'       in data else None,
            int(data['voice'])    if 'voice'    in data else None,
            json.dumps(data['cs_tasks']) if 'cs_tasks' in data else None
        ))
    return jsonify({'ok': True})

if __name__ == '__main__':
    init_db()
    print('Сервер запущен: http://localhost:8080')
    app.run(host='0.0.0.0', port=8080, debug=True)
