import os
import openai
from dotenv import load_dotenv
from tiktoken import encoding_for_model

# Load environment variables from .env
load_dotenv()

# Load OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
 
# Initialize OpenAI Client
openai.api_key = OPENAI_API_KEY

def assembleScriptWithSSML(script_chunks) -> str:
    """Assemble SSML script with breaks between chunks."""
    return f"<speak>{' <break time=\"1500ms\" />'.join(script_chunks)}</speak>"

def truncate_context(context, max_tokens=500):
    """Truncate context to fit within the token limit."""
    
    context_str = "\n\n".join(context)
    
    enc = encoding_for_model("gpt-3.5-turbo")
    tokens = enc.encode(context_str)
    
    if len(tokens) > max_tokens:
        truncated_tokens = tokens[:max_tokens]
        truncated_context = enc.decode(truncated_tokens)
        return truncated_context
    return context_str

async def getContent(prompt: str, context : list | None = None) -> str:
    """Generate content using OpenAI API."""
    try:
        limited_context = truncate_context(context) if context else ""

        new_prompt = f"""{prompt} 
         {('Here is some additional context: ' + limited_context) if context else ''}
        """
        

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": new_prompt}],
        )
        return completion['choices'][0]['message']['content']
    except Exception as e:
        print("Error in OpenAI API call:", e)
        raise e
