# Import flask and datetime module for showing date and time
import os
import pickle
import datetime
from io import BytesIO
from werkzeug.utils import secure_filename
from flask import Flask, request, jsonify, redirect, url_for

x = datetime.datetime.now()

with open('../../ml-models/classification/serialized/decisionTreeModel.pkl', 'rb') as f:
    model = pickle.load(f)

ALLOWED_EXTENSIONS = {'csv', 'xml'}

# Initializing flask app
app = Flask(__name__)



# Route for seeing a data
@app.route('/data')
def get_time():
    # Returning an api for showing in  reactjs
    return {
        'Name':"tesm", 
        "Age":"22",
        "Date":x, 
        "programming":"python"
    }

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/data_analysis', methods=['POST'])
def upload_file():
    #Handles the upload of a file
    d = {}
    try:
        file = request.files['file_from_react']
        if file.filename == '':
            print('No selected file')
            d['status'] = 0
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            os.makedirs(os.path.join(app.instance_path), exist_ok=True)
            file.save(os.path.join(app.instance_path, filename))
            print(f"Uploading file {filename}")
            d['status'] = 1
            #return redirect(url_for('download_file', name=filename))

    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0

    return jsonify(d)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Пример: предположим, что данные приходят в виде списка
    prediction = model.predict([data['features']])

    return jsonify({'prediction': prediction.tolist()})
    
# Running app
if __name__ == '__main__':
    app.run(debug=True)
