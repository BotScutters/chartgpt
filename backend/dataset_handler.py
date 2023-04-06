import io
import json
import os
import pandas as pd
import requests
import sys
import xml.etree.ElementTree as ET
import zipfile
from loguru import logger
from pathlib import Path


UCI_DATASETS_BASE_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/"
DATASETS = {
    "Bank Marketing": f"{UCI_DATASETS_BASE_URL}00222/bank.zip",
    "Adult Data": f"{UCI_DATASETS_BASE_URL}adult/adult.data",
    "Online Retail": f"{UCI_DATASETS_BASE_URL}00502/online_retail_II.xlsx"
}

DATA_DIR = Path("data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

is_debug = os.environ.get("DEBUG", "0") == "1"
logger.remove()
logger.add(sys.stderr, level="DEBUG" if is_debug else "INFO")

def load_dataset(dataset_name: str) -> tuple[pd.DataFrame, str]:
    if dataset_name in DATASETS:
        dataset_url = DATASETS[dataset_name]
        filename_stem = dataset_name.lower().replace(" ", "_")
        filepath = DATA_DIR / f"{filename_stem}.csv"
        if filepath.exists():
            logger.info(f"Loading dataset '{dataset_name}' from local file")
            df = pd.read_csv(filepath)
        else:
            df = download_dataset(dataset_url, filepath)
        preview_data = df.head(5).to_json(orient="split")
        return df, preview_data
    else:
        raise ValueError(f"Dataset '{dataset_name}' not found.")

def download_dataset(url: str, filepath: Path) -> pd.DataFrame:
    logger.info(f"Downloading dataset from {url}")
    response = requests.get(url)
    if response.status_code != 200:
        logger.error(f"Failed to download dataset from {url}")
        return None
    try:
        df = convert_to_df(response, url)
        df.to_csv(filepath, index=False)
        return df
    except Exception as e:
        logger.error(f"Failed to convert dataset to DataFrame: {e}")
        return None


def convert_to_df(response: requests.Response, url: str) -> pd.DataFrame:
    """All we know about the response is that it is the result of a GET request to a URL
    that we presume is a dataset. We don't know the format of the response, so we
    try various strategies to get it into a Pandas DataFrame. We'll try to inspect the
    response and identify its format so that we can load it into a Pandas DataFrame and
    then store it as a CSV. We should be prepared for it to be in any number of formats,
    including Excel, JSON, XML, CSV, zip files, etc. Even if we successfully get the
    data into a DataFrame, we still should validate that it's sensible and may still
    need to do some further processing or try other techniques.
    """
    content_type = response.headers.get("Content-Type", "").split(";")[0].strip()
    logger.debug(f"Content-Type: {content_type}")
    content_disposition = response.headers.get("Content-Disposition", "")
    logger.debug(f"Content-Disposition: {content_disposition}")

    if "filename=" in content_disposition:
        filename = content_disposition.split("filename=")[-1].strip('"')
        file_ext = filename.split(".")[-1].lower()
        logger.debug(f"Filename: {filename}")
    else:
        file_ext = url.split("/")[-1].split(".")[-1].lower()

    # CSV
    if content_type == "text/csv" or file_ext == "csv":
        df = pd.read_csv(io.StringIO(response.text))
        logger.debug("Parsed dataset as CSV")
        return df

    # Excel
    elif content_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" or file_ext == "xlsx":
        df = pd.read_excel(io.BytesIO(response.content))
        logger.debug("Parsed dataset as Excel")
        return df

    # JSON
    elif content_type == "application/json" or file_ext == "json":
        json_data = json.loads(response.text)
        df = pd.json_normalize(json_data)
        logger.debug("Parsed dataset as JSON")
        return df

    # XML
    elif content_type == "application/xml" or content_type == "text/xml" or file_ext == "xml":
        root = ET.fromstring(response.text)
        data = [elem.attrib for elem in root]
        df = pd.DataFrame(data)
        logger.debug("Parsed dataset as XML")
        return df

    # Zip
    elif content_type == "application/zip" or file_ext == "zip":
        with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
            for file_info in zf.infolist():
                if file_info.filename.endswith(".csv"):
                    with zf.open(file_info) as f:
                        df = pd.read_csv(f)
                    logger.debug("Parsed dataset as CSV from a Zip file")
                    return df
                elif file_info.filename.endswith(".xlsx"):
                    with zf.open(file_info) as f:
                        df = pd.read_excel(f)
                    logger.debug("Parsed dataset as Excel from a Zip file")
                    return df

    # Fallback: try to parse as CSV
    try:
        return pd.read_csv(io.StringIO(response.text))
    except Exception as e:
        pass

    raise ValueError(
        "Unable to convert the response content to a DataFrame. "
        f"Content-Type: {content_type}"
    )


def add_dataset(dataset_name: str, dataset_url: str) -> tuple[bool, str]:
    if dataset_name not in DATASETS:
        DATASETS[dataset_name] = dataset_url
        message = f"Added new dataset '{dataset_name}' with URL '{dataset_url}'"
        logger.info(message)
        return True, message
    message = f"Dataset '{dataset_name}' already exists"
    return False, message

def get_available_datasets() -> list[str]:
    logger.debug("Getting available datasets")
    return list(DATASETS.keys())
