"""
Below is a sample of how to use the OpenAI API to generate text.
```
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello world!"}]
)
```

Below is a sample response to the above request:
```
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "Hello! How can I assist you today?",
        "role": "assistant"
      }
    }
  ],
  "created": 1680040050,
  "id": "chatcmpl-6zBS6NItW987IqqgvM67U1zYtZInI",
  "model": "gpt-3.5-turbo-0301",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 9,
    "prompt_tokens": 11,
    "total_tokens": 20
  }
}
```

This script provides a simple interface to the OpenAI API.
"""
# Import libraries
import os

import openai


# Define the API key
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    raise ValueError("No OpenAI API key found!")
openai.api_key = API_KEY


def get_response(content: str, prompt: None | str = None) -> tuple:
    """
    Get a response from the OpenAI API based on the provided content. If a prompt is
    provided, it will be prepended to the content, separated by a newline.

    Args:
        content (str): The content to use as the prompt.
        prompt (None | str): The prompt to prepend to the content. Defaults to None.

    Returns:
        tuple: The token counts and response.
    """
    if prompt is not None:
        content = f"{prompt}\n{content}"

    # Get the response
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": content}],
    )

    # Get the response as well as token counts
    try:
        token_counts = response.usage.to_dict()
        response = response["choices"][0].message.content
    except KeyError as e:
        token_counts = None
        response = None
        print(f"Error: {e}")
        print(f"Response: {response}")

    # Return the token counts and response
    return token_counts, response

# Define the main function
def main():
    """
    The main function.
    """
    # Get the response
    response = get_response("Say this is a test!")

    # Print the response
    print(response)

# Run the main function
if __name__ == "__main__":
    main()
