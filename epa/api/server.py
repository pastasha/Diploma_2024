# Import flask and datetime module for showing date and time
import os
import pickle
import psycopg2
import pandas as pd
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, make_response
from utilities import *
from eda import ExploratoryDataAnalysis

# Initializing flask app
app = Flask(__name__)


# Connect to the database
try:
    # host, database, user, password
    conn_info = load_connection_info("db.ini")
    # Connect to the "houses" database
    connection = psycopg2.connect(**conn_info)
    cursor = connection.cursor()
    print("✔ Database connected successfully")
except:
    print("- Database not connected successfully")



@app.route("/get-session", methods=["GET"])
def get_session():
    user_id = request.cookies.get("user_id")
    if not user_id:
        # Generate a new guest session
        user_id = generate_user_id()
        # Insert customer if it not exist in database
        upsert_customer_to_db(user_id, app.instance_path, connection, cursor)
        # Send serponse
        response = make_response(jsonify({"message": "New guest session started", "user_id": user_id}))
        response.set_cookie(
            "user_id",
            user_id,
            max_age=SESSION_MAX_AGE,
            httponly=True,
            secure=False
        )
        print ("✔ New guest session started: " + user_id)
        return response

    return jsonify({"message": "Existing session", "user_id": user_id})


@app.route('/upload-data', methods=['POST'])
def upload_file():
    #Handles the upload of a file
    d = {}
    try:
        file = request.files['file_from_react']
        if file.filename == '':
            print('No selected file')
            d['status'] = 0
        if file and allowed_file(file.filename):
            user_id = request.cookies.get('user_id')
            get_statement = "SELECT * from " + USER_TABLE + " WHERE user_id='" + user_id + "'"
            col_names = get_column_names(USER_TABLE, cursor)
            user_df = pd.DataFrame(columns=col_names)
            user_df = get_data_from_db(get_statement, connection, cursor, user_df, col_names)[0][0]
            file_path = user_df['files_path']
            filename = secure_filename("data.csv")
            os.makedirs(os.path.join(file_path), exist_ok=True)
            file.save(os.path.join(file_path, filename))
            print(f"✔ Uploading file {filename}")
            d['status'] = 1
            #return redirect(url_for('download_file', name=filename))
    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0

    return jsonify(d)

@app.route('/start-eda', methods=['POST'])
def start_eda():
    user_id = request.cookies.get('user_id')
    get_statement = "SELECT * from " + USER_TABLE + " WHERE user_id='" + user_id + "'"
    col_names = get_column_names(USER_TABLE, cursor)
    user_df = pd.DataFrame(columns=col_names)
    user_df = get_data_from_db(get_statement, connection, cursor, user_df, col_names)[0][0]
    customer_folder = user_df['files_path']
    eda = ExploratoryDataAnalysis(customer_folder)

    return jsonify({'eda result': eda.correlationMatrixPlot})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    with open('../../ml-models/classification/serialized/decisionTreeModel.pkl', 'rb') as f:
        model = pickle.load(f)
    # Пример: предположим, что данные приходят в виде списка
    prediction = model.predict([data['features']])

    return jsonify({'prediction': prediction.tolist()})
    

# Route for seeing a data
@app.route('/data')
def get_time():
    # Returning an api for showing in  reactjs
    return {
        'Name':"tesm", 
        "Age":"22",
        "Date":datetime.now(), 
        "programming":"python"
    }


# Running app
if __name__ == '__main__':
    app.run(debug=True)
