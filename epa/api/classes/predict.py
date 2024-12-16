from sklearn.preprocessing import LabelEncoder
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import matplotlib
import seaborn as sns
import pandas as pd
import numpy as np
import pickle
import os

matplotlib.use("agg")

DATA_FILE_NAME = "/data.csv"
SERIALIZED_MODELS_FOLDER = "../models"

SERIALIZED_MODELS = {
    "decision-tree": {
        "path": "./models/decisionTreeModel.pkl"
    },
    "random-forest": {
        "path": "./models/randomForestModel.pkl"
    },
    "xg-boost": {
        "path": "./models/XGBoostModel.pkl"
    }
}


class Predict:
    @staticmethod
    def getCustomerData(customer_folder):
        data_path = customer_folder + DATA_FILE_NAME
        data = os.path.abspath(data_path)
        dataframe = pd.read_csv(data)
        return dataframe

    def prepareData(self, dataframe):
        requiredColumns = ["Location", "Day", "Hour","AQI", "PM2.5", "PM10", "O3", "CO", "SO2", "NO2"]
        processedDf = dataframe.loc[:, dataframe.columns.intersection(requiredColumns)]
        # Label encoding
        le = LabelEncoder()
        processedDf['Location'] = le.fit_transform(processedDf['Location'])
        processedDf['Hour'] = le.fit_transform(processedDf['Hour'])
        return processedDf

    def callModel(self, root_folder, modelID):
        model_path = os.path.join(root_folder, SERIALIZED_MODELS[modelID]["path"])
        model = pickle.load(open(model_path, 'rb'))
        return model

    def predict(self, model, dataframe):
        prediction = model.predict(dataframe)
        return prediction
    
    def __init__(self, user_id, customer_folder, root_folder, modelID):
        dataframe = self.getCustomerData(customer_folder)
        processedDf = self.prepareData(dataframe)
        model = self.callModel(root_folder, modelID)
        self.predictionResult = self.predict(model, processedDf)


