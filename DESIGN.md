# ChartGPT

## Overview
ChartGPT is a webapp that allows users to create charts from a dataset. It is built on top of large language model technology (GPT-3) and uses the OpenAI API to generate the charts.

## User Interface
The user interface is a single page webapp that allows users to upload a dataset and create charts from it. The design is minimalist, modern, reactive, and dynamic. The charts are generated in a no-code fashion, with the user providing plain text requests for the charts they want to create. The interface displays the following elements, from top-to-bottom:
- A title: "ChartGPT"
- Dataset selector
  - A horizontal bar for the user to select a dataset to use
    - On the left is a dropdown menu to select a dataset to use. The menu is populated with the names of the datasets that have been uploaded to the app, including some which have been preloaded. The default selection is "Select a dataset".
    - To the right of the dropdown menu is a button to add a dataset. When clicked, the button opens a modal dialog that allows the user to add a dataset to the app. A new dataset must be given a name, and can be added either via URL or uploaded from the user's local machine.
- Chart Viewer
  - A frame to display the chart. The frame is initially empty, and is populated with the chart when the user submits a request.
- Dataset Viewer
  - A table to display a preview of the dataset. 
    - The table is initially empty, and is populated with the dataset when the user selects a dataset to use.
    - The table is dynamic, and will act as an access point to a Pandas dataframe on the backend.
    - The user can perform basic operations on the table, such as sorting, filtering, hiding/showing/rearranging columns. The table will show 5 rows by default, but the user can change this number, and advance to the next 5 rows, by using the pagination controls at the bottom of the table.
- Conversation Viewer
  - A text box for the app to display a conversation history between the user and the app. Each time the user submits a request, the app will display the request in the text box, and the response to the request below it.
  - A text box below that for the user to enter their requests.
  - A button to submit the request.

## Backend
The backend is a Flask server that handles the requests from the frontend and communicates with the OpenAI API. The backend is responsible for the following tasks:
- Loading the datasets into memory.
- Automatically determining a schema for the datasets and making it available to the frontend.
- Generating views of the datasets for the frontend.
- Wrapping user requests in the appropriate OpenAI API calls.
- Parsing the responses from the OpenAI API.
- Updating the frontend with the results of the requests.
The server is locally hosted and runs on port 5000.

## Example Usage
1. User uploads a dataset to the app.
2. A backend process loads the dataset, automatically generates a schema for it, and displays a preview of the dataset in the dataset viewer.
3. The user enters a request for a chart in the text box.
4. The user clicks the Send button.
5. The user's request is displayed in the conversation viewer.
6. The backend wraps the request with a prompt for the OpenAI API, supplying it with context about the dataset and the app itself.
7. The backend sends the request to the OpenAI API.
8. The API returns a response containing code necessary to produce the requested chart in the chart frame as well as a text response directed at the user. The response is displayed in the conversation viewer.
9. The backend parses the response and updates the chart frame with the chart.
10. The user can repeat steps 3-9 as many times as they want.

## Architecture
The app is built using the following technologies:
- Frontend
  - React - Javascript library for building user interfaces
  - Bootstrap - CSS framework for styling the user interface
- Backend
  - Flask - Python web framework
  - Pandas - Python library for data manipulation and analysis
  - OpenAI API - API for accessing GPT-3