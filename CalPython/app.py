from flask import Flask, render_template, request, jsonify
import pyrebase

app = Flask(__name__)

firebaseConfig = {
    "apiKey": "AIzaSyB2HRfN-hVJgtAZqAG-k2Ot5bTc0prvpVE",
    "authDomain": "calculator-surya.firebaseapp.com",
    "projectId": "calculator-surya",
    "storageBucket": "calculator-surya.appspot.com",
    "messagingSenderId": "397004330048",
    "appId": "1:397004330048:web:88e8d69e1446270fc0fba5",
    "measurementId": "G-FH817MH6R8",
    "databaseURL": "https://calculator-surya-default-rtdb.firebaseio.com/"
}

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/set_target', methods=['POST'])
def set_target():
    data = {"name": "niel", "state": "alive"}
    db.child("List").child("Targets").set(data)
    return jsonify({"message": "Target set"})

@app.route('/calculate', methods=['POST'])
def calculate():
    input_value = request.json.get('inputValue')
    set_code = "22-08-2001"

    if input_value == set_code:
        return jsonify({"admin": True})

    try:
        result = eval(input_value.replace("%", "*0.01*"))
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": "Error"}), 400

@app.route('/set_message', methods=['POST'])
def set_message():
    birthday = request.json.get('birthday')
    message = request.json.get('message')

    if birthday and message:
        db.child("messages").child(birthday).set(message)
        return jsonify({"message": "Message set successfully"})
    else:
        return jsonify({"error": "Enter Date of Birth and Message too"}), 400

@app.route('/view_message', methods=['POST'])
def view_message():
    birthday = request.json.get('birthday')
    message = db.child("messages").child(birthday).get().val()

    if message:
        return jsonify({"message": message})
    else:
        return jsonify({"message": "Hey Buddy, No message set for you..."})

if __name__ == '__main__':
    app.run(debug=True)
