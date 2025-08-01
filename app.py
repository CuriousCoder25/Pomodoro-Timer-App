from flask import Flask, render_template, request, jsonify
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

@app.route('/')
def index():
    return render_template('pomodoro.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/timer/start', methods=['POST'])
def start_timer():
    data = request.get_json()
    timer_type = data.get('type', 'work')
    duration = data.get('duration', 25)
    
    return jsonify({
        'status': 'success',
        'message': f'{timer_type.replace("_", " ").title()} timer started',
        'type': timer_type,
        'duration': duration
    })

@app.route('/api/timer/complete', methods=['POST'])
def complete_timer():
    data = request.get_json()
    timer_type = data.get('type', 'work')
    
    return jsonify({
        'status': 'success',
        'message': f'{timer_type.replace("_", " ").title()} session completed!',
        'type': timer_type
    })

if __name__ == '__main__':
    app.run(debug=True)
