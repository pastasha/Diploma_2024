# Import flask and datetime module for showing date and time
from io import BytesIO
from flask import Flask, request, jsonify
import datetime
import pickle

x = datetime.datetime.now()

with open('../../ml-models/classification/serialized/decisionTreeModel.pkl', 'rb') as f:
    model = pickle.load(f)

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

@app.route('/data_analysis', methods=['POST'])
def upload_file():
    """Handles the upload of a file."""
    d = {}
    try:
        file = request.files['file_from_react']
        filename = file.filename
        print(f"Uploading file {filename}")
        file_bytes = file.read()
        file_content = BytesIO(file_bytes).readlines()
        print(file_content)
        d['status'] = 1

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
