import os
import sys
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from werkzeug.serving import run_simple
from loguru import logger

from dataset_handler import load_dataset, add_dataset, get_available_datasets
from openai_api import get_response

app = Flask(__name__, template_folder="templates")

CORS(app)
socketio = SocketIO(app)
loaded_datasets = {}

is_debug = os.environ.get("ENV", "prod") == "dev"
logger.remove()
logger.add(sys.stderr, level="DEBUG" if is_debug else "INFO")
logger.info(f"Starting app in {'debug' if is_debug else 'production'} mode...")


@app.route('/')
def index():
    logger.info("Rendering index page")
    return render_template('index.html')

@app.route('/load-dataset', methods=['POST'])
def load_dataset_route():
    dataset_name = request.form['dataset_name']
    logger.debug(f"Request to load dataset: {dataset_name}")
    if dataset_name in loaded_datasets:
        preview_data = loaded_datasets[dataset_name]["preview"]
        dataset = loaded_datasets[dataset_name]["data"]
        response_data = {
            "status": "success",
            "name": dataset_name,
            "dataset": dataset.to_json(orient="split"),
            "previewData": preview_data,
        }
    else:
        try:
            dataset, preview_data = load_dataset(dataset_name)
            response_data = {
                "status": "success",
                "name": dataset_name,
                "dataset": dataset.to_json(orient="split"),
                "previewData": preview_data,
            }
            loaded_datasets[dataset_name] = {"data": dataset, "preview": preview_data}
        except Exception as e:
            logger.error(f"Error loading dataset: {e}")
            response_data = {
                "status": "error",
                "name": dataset_name,
                "message": str(e),
            }
    if response_data["status"] == "success":
        logger.debug(f"Loaded dataset '{dataset_name}' preview: {preview_data}")
        logger.debug(f"Dataset columns:\n{dataset.columns}")
        logger.debug(f"Dataset info:\n{dataset.info()}")
    return jsonify(response_data)

@app.route('/datasets')
def datasets():
    available_datasets = get_available_datasets()
    logger.debug(f"Available datasets: {available_datasets}")
    return jsonify(available_datasets)

@app.route('/add-dataset', methods=['POST'])
def add_dataset_route():
    dataset_name = request.form['dataset_name']
    dataset_url = request.form['dataset_url']
    logger.debug(f"Request to add dataset: {dataset_name}, URL: {dataset_url}")
    success, message = add_dataset(dataset_name, dataset_url)
    return jsonify({"success": success, "message": message})

@app.route('/process-request', methods=['POST'])
def process_request():
    content = request.get_json()['content']
    logger.debug(f"Processing request: {content}")
    try:
        _, response = get_response(content)
        response_data = {
            "status": "success",
            "response": response,
        }
    except Exception as e:
        logger.error(f"Error processing request chart: {e}")
        response_data = {
            "status": "error",
            "message": str(e),
        }
    return jsonify(response_data)


if __name__ == '__main__':
    is_debug = os.environ.get("ENV", "prod") == "dev"
    if is_debug:
        run_simple("0.0.0.0", 5000, app, use_reloader=True)
    else:
        socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
